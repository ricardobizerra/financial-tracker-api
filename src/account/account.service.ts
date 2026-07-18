import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { Account, AccountCreateInput } from '@/lib/graphql/prisma-client';
import {
  CardBillingStatus,
  InvestmentStatus,
  InvestmentTransactionRole,
  Prisma,
  TransactionStatus,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { AccountModel, OrdenationAccountArgs } from './account.model';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { OrderDirection } from '@/utils/args/ordenation.args';
import { selectObject } from '@/utils/select-object';

@Injectable()
export class AccountService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany({
    userId,
    queriedFields,
    paginationArgs,
    searchArgs,
    ordenationArgs,
  }: {
    userId: string;
    queriedFields: (keyof AccountModel)[];
    paginationArgs: PaginationArgs;
    searchArgs: SearchArgs;
    ordenationArgs: OrdenationAccountArgs;
  }) {
    const { after, before, first, last } = paginationArgs;
    const { orderBy, orderDirection = OrderDirection.Asc } = ordenationArgs;

    const unbufferedCursor = after
      ? Number(Buffer.from(after, 'base64').toString('utf-8'))
      : before
        ? Number(Buffer.from(before, 'base64').toString('utf-8'))
        : 0;

    const accountsLengthQuery = last
      ? await this.prismaService.account.count({
          where: {
            institutionLink: {
              userId,
            },
            ...(!!searchArgs.search && {
              OR: ['name', 'description'].map((field) => ({
                [field]: {
                  contains: searchArgs.search,
                  mode: 'insensitive',
                },
              })),
            }),
          },
        })
      : undefined;

    const accountsLength = !!accountsLengthQuery
      ? Number(accountsLengthQuery)
      : undefined;

    const accounts = await this.prismaService.account.findMany({
      take: last
        ? unbufferedCursor
          ? last
          : accountsLength % last === 0
            ? last
            : accountsLength % last
        : first
          ? first
          : undefined,
      skip: unbufferedCursor
        ? last
          ? accountsLength - unbufferedCursor + 1
          : unbufferedCursor
        : last
          ? 0
          : undefined,
      orderBy: orderBy
        ? {
            [orderBy]: last
              ? orderDirection === OrderDirection.Asc
                ? OrderDirection.Desc
                : OrderDirection.Asc
              : orderDirection === OrderDirection.Asc
                ? OrderDirection.Asc
                : OrderDirection.Desc,
          }
        : undefined,
      select: {
        ...selectObject<Account, AccountModel>(queriedFields, {
          balance: [
            'initialBalance',
            'sourceTransactions',
            'destinyTransactions',
          ],
          currentBillingAmount: [],
          totalInvested: [],
        }),
        // Garantir que date e status estejam disponíveis para o calculateBalance
        ...(queriedFields.includes('balance') && {
          sourceTransactions: {
            select: { amount: true, date: true, status: true },
          },
          destinyTransactions: {
            select: { amount: true, date: true, status: true },
          },
          startDate: true,
          institutionLinkId: true,
        }),
        // Garantir dados para currentBillingAmount
        ...(queriedFields.includes('currentBillingAmount') && {
          type: true,
          accountCard: {
            select: {
              billings: {
                where: {
                  status: {
                    in: [
                      CardBillingStatus.PENDING,
                      CardBillingStatus.CLOSED,
                      CardBillingStatus.OVERDUE,
                    ],
                  },
                },
                select: {
                  status: true,
                  transactions: {
                    select: { amount: true },
                  },
                },
                orderBy: { periodStart: 'desc' },
                take: 1,
              },
            },
          },
        }),
        // Garantir dados para totalInvested
        ...(queriedFields.includes('totalInvested') && {
          type: true,
          investments: {
            where: { status: InvestmentStatus.OPEN },
            select: { amount: true },
          },
        }),
      },
      where: {
        institutionLink: {
          userId,
        },
        ...(!!searchArgs.search && {
          OR: ['name', 'description'].map((field) => ({
            [field]: {
              contains: searchArgs.search,
              mode: 'insensitive',
            },
          })),
        }),
      },
    });

    if (last) {
      accounts.reverse();
    }

    if (accounts.length === 0) {
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: !!after,
          startCursor: null,
          endCursor: null,
        },
      };
    }

    // Batch-fetch investment transactions for balance calculation
    const investmentsByLinkId = new Map<string, any[]>();
    if (queriedFields.includes('balance')) {
      const linkIds = accounts
        .map((a: any) => a.institutionLinkId)
        .filter(Boolean);
      if (linkIds.length > 0) {
        const investments = await this.prismaService.investment.findMany({
          where: {
            institutionLinkId: { in: linkIds },
          },
          select: {
            institutionLinkId: true,
            startDate: true,
            finishedAt: true,
            transactions: {
              where: {
                role: {
                  in: [
                    InvestmentTransactionRole.FUNDING,
                    InvestmentTransactionRole.REDEMPTION,
                  ],
                },
              },
              select: { amount: true, role: true },
            },
          },
        });
        for (const inv of investments) {
          const existing = investmentsByLinkId.get(inv.institutionLinkId) || [];
          existing.push(inv);
          investmentsByLinkId.set(inv.institutionLinkId, existing);
        }
      }
    }

    const edges = accounts.map((account, index) => {
      const cursorIndex =
        index +
        1 +
        (last
          ? unbufferedCursor
            ? unbufferedCursor - last - 1
            : accountsLength - accounts.length
          : unbufferedCursor || 0);

      const bufferedCursor = Buffer.from(cursorIndex.toString())
        .toString('base64')
        .split('=')[0];

      const accountWithInvestments = {
        ...account,
        _investments: (account as any).institutionLinkId
          ? investmentsByLinkId.get((account as any).institutionLinkId) || []
          : [],
      };

      return {
        cursor: bufferedCursor,
        node: {
          ...account,
          balance: this.calculateBalance(
            account.sourceTransactions,
            account.destinyTransactions,
            account.initialBalance,
            this.mapInvestmentTransactions(accountWithInvestments),
          ),
        },
      };
    });

    const startCursor = edges[0].cursor;
    const endCursor = edges[edges.length - 1].cursor;

    if (!first && !last) {
      return {
        edges,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: !!after,
          startCursor,
          endCursor,
        },
      };
    }

    const extraItem = !(
      last && Number(Buffer.from(startCursor, 'base64').toString('utf-8')) <= 1
    )
      ? await this.prismaService.account.findFirst({
          take: 1,
          skip: last
            ? Number(Buffer.from(startCursor, 'base64').toString('utf-8')) - 2
            : first
              ? Number(Buffer.from(endCursor, 'base64').toString('utf-8'))
              : unbufferedCursor,
          orderBy: orderBy
            ? {
                [orderBy]: last
                  ? orderDirection === OrderDirection.Asc
                    ? OrderDirection.Desc
                    : OrderDirection.Asc
                  : orderDirection === OrderDirection.Asc
                    ? OrderDirection.Asc
                    : OrderDirection.Desc,
              }
            : undefined,
          select: {
            id: true,
          },
          where: {
            institutionLink: {
              userId,
            },
            ...(!!searchArgs.search && {
              OR: ['name', 'description'].map((field) => ({
                [field]: {
                  contains: searchArgs.search,
                  mode: 'insensitive',
                },
              })),
            }),
          },
        })
      : undefined;

    const hasNextPage = last ? !!before : !!extraItem;

    const hasPreviousPage = last ? !!extraItem : !!after;

    const pageInfo = {
      hasNextPage,
      hasPreviousPage,
      startCursor,
      endCursor,
    };

    return {
      edges,
      pageInfo,
    };
  }

  async find(
    where: Prisma.AccountWhereUniqueInput,
    queriedFields?: (keyof AccountModel)[],
  ) {
    const needsBalance =
      !queriedFields?.length || queriedFields.includes('balance');

    const account = await this.prismaService.account.findUnique({
      where,
      ...(queriedFields?.length && {
        select: {
          ...selectObject<Account, AccountModel>(queriedFields, {
            balance: [
              'initialBalance',
              'sourceTransactions',
              'destinyTransactions',
            ],
            currentBillingAmount: [],
            totalInvested: [],
          }),
          // Garantir que date e status estejam disponíveis para o calculateBalance
          ...(needsBalance && {
            sourceTransactions: {
              select: { amount: true, date: true, status: true },
            },
            destinyTransactions: {
              select: { amount: true, date: true, status: true },
            },
            startDate: true,
            institutionLinkId: true,
          }),
        },
      }),
    });

    // Fetch investment transactions separately to avoid overriding institutionLink select
    if (needsBalance && account?.institutionLinkId) {
      const investments = await this.prismaService.investment.findMany({
        where: {
          institutionLinkId: account.institutionLinkId,
        },
        select: {
          startDate: true,
          finishedAt: true,
          transactions: {
            where: {
              role: {
                in: [
                  InvestmentTransactionRole.FUNDING,
                  InvestmentTransactionRole.REDEMPTION,
                ],
              },
            },
            select: { amount: true, role: true },
          },
        },
      });
      (account as any)._investments = investments;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return account as any;
  }

  async create(data: AccountCreateInput) {
    return this.prismaService.account.create({ data });
  }

  async update(id: string, data: AccountCreateInput) {
    return this.prismaService.account.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prismaService.account.delete({ where: { id } });
  }

  /**
   * Maps investment data (from _investments or institutionLink.investments) into
   * a flat array of investment transactions with effective dates.
   */
  mapInvestmentTransactions(account: any): {
    role: InvestmentTransactionRole;
    amount: Decimal;
    date: Date;
  }[] {
    // Support both the batch-queried _investments and nested institutionLink.investments
    const investments =
      account?._investments || account?.institutionLink?.investments;
    if (!investments) return [];

    const accountStartDate = account.startDate
      ? new Date(account.startDate)
      : null;

    const result: {
      role: InvestmentTransactionRole;
      amount: Decimal;
      date: Date;
    }[] = [];

    for (const inv of investments) {
      const invStartDate = new Date(inv.startDate);

      // Only consider investments whose startDate >= account startDate
      if (accountStartDate && invStartDate < accountStartDate) continue;

      for (const tx of inv.transactions || []) {
        if (tx.role === InvestmentTransactionRole.FUNDING) {
          result.push({
            role: tx.role,
            amount: new Decimal(tx.amount),
            date: invStartDate,
          });
        } else if (
          tx.role === InvestmentTransactionRole.REDEMPTION &&
          inv.finishedAt
        ) {
          result.push({
            role: tx.role,
            amount: new Decimal(tx.amount),
            date: new Date(inv.finishedAt),
          });
        }
      }
    }

    return result;
  }

  calculateBalance(
    sourceTransactions: {
      amount: Decimal;
      date: Date;
      status: TransactionStatus;
    }[],
    destinyTransactions: {
      amount: Decimal;
      date: Date;
      status: TransactionStatus;
    }[],
    initialBalance: Decimal,
    investmentTransactions?: {
      role: InvestmentTransactionRole;
      amount: Decimal;
      date: Date;
    }[],
  ): Decimal {
    const now = new Date();

    // Filtra apenas transações não canceladas até hoje
    const filterValidTransactions = (
      transactions: {
        amount: Decimal;
        date: Date;
        status: TransactionStatus;
      }[],
    ) =>
      transactions.filter((t) => t.date <= now);

    const validDestinyTransactions =
      filterValidTransactions(destinyTransactions);
    const validSourceTransactions = filterValidTransactions(sourceTransactions);

    const incomingAmount = validDestinyTransactions.reduce(
      (total, transaction) => total.plus(transaction.amount),
      new Decimal(0),
    );

    const outgoingAmount = validSourceTransactions.reduce(
      (total, transaction) => total.plus(transaction.amount),
      new Decimal(0),
    );

    let balance = initialBalance.plus(incomingAmount).minus(outgoingAmount);

    // Apply investment transactions impact
    if (investmentTransactions) {
      for (const invTx of investmentTransactions) {
        if (invTx.date > now) continue; // Only apply past/current events

        if (invTx.role === InvestmentTransactionRole.FUNDING) {
          // Money left the account → subtract
          balance = balance.minus(invTx.amount);
        } else if (invTx.role === InvestmentTransactionRole.REDEMPTION) {
          // Money returned to the account → add
          balance = balance.plus(invTx.amount);
        }
      }
    }

    return balance;
  }

  calculateCurrentBillingAmount(account: {
    accountCard?: {
      billings?: Array<{
        status: CardBillingStatus;
        transactions?: Array<{ amount: Decimal }>;
      }>;
    };
  }): Decimal | null {
    const currentBilling = account.accountCard?.billings?.[0];
    if (!currentBilling) {
      return new Decimal(0);
    }

    return (
      currentBilling.transactions?.reduce(
        (total, t) => total.plus(t.amount),
        new Decimal(0),
      ) || new Decimal(0)
    );
  }

  calculateTotalInvested(account: {
    investments?: Array<{ amount: Decimal | number }>;
  }): Decimal | null {
    return (
      account.investments?.reduce(
        (total, inv) => total.plus(new Decimal(inv.amount)),
        new Decimal(0),
      ) || new Decimal(0)
    );
  }
}
