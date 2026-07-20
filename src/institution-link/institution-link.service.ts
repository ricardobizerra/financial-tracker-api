import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { InstitutionLink } from '@/lib/graphql/prisma-client';
import { Prisma } from '@prisma/client';
import {
  CreateInstitutionLinkInput,
  InstitutionLinkFilterArgs,
  InstitutionLinkModel,
  OrdenationInstitutionLinkArgs,
} from './institution-link.model';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { OrderDirection } from '@/utils/args/ordenation.args';
import { selectObject } from '@/utils/select-object';
import { AccountService } from '@/account/account.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class InstitutionLinkService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
  ) {}

  async create({
    userId,
    data,
  }: {
    userId: string;
    data: CreateInstitutionLinkInput;
  }) {
    // Check if link already exists to avoid Prisma unhandled unique constraint errors
    const existing = await this.prismaService.institutionLink.findUnique({
      where: {
        institutionId_userId: {
          userId,
          institutionId: data.institutionId,
        },
      },
    });

    if (existing) {
      throw new Error('Você já possui um vínculo com esta instituição.');
    }

    return this.prismaService.institutionLink.create({
      data: {
        userId,
        institutionId: data.institutionId,
      },
    });
  }

  async find(
    where: Prisma.InstitutionLinkWhereUniqueInput,
    queriedFields?: (keyof InstitutionLinkModel)[],
  ) {
    return this.prismaService.institutionLink.findUnique({
      where,
      select: queriedFields
        ? selectObject<InstitutionLink, InstitutionLinkModel>(queriedFields)
        : undefined,
    });
  }

  async findMany({
    filterArgs,
    userId,
    queriedFields,
    paginationArgs,
    searchArgs,
    ordenationArgs,
  }: {
    userId: string;
    queriedFields: (keyof InstitutionLinkModel)[];
    paginationArgs: PaginationArgs;
    searchArgs: SearchArgs;
    ordenationArgs: OrdenationInstitutionLinkArgs;
    filterArgs: InstitutionLinkFilterArgs;
  }) {
    const { after, before, first, last } = paginationArgs;
    const { orderBy, orderDirection = OrderDirection.Asc } = ordenationArgs;

    const unbufferedCursor = after
      ? Number(Buffer.from(after, 'base64').toString('utf-8'))
      : before
        ? Number(Buffer.from(before, 'base64').toString('utf-8'))
        : 0;

    const queryWhere = {
      userId,
      ...(filterArgs.institutionTypes && {
        institution: {
          types: {
            hasSome: filterArgs.institutionTypes,
          },
        },
      }),
      ...(!!searchArgs.search && {
        institution: {
          name: {
            contains: searchArgs.search,
            mode: 'insensitive' as const,
          },
        },
      }),
    };

    const lengthQuery = last
      ? await this.prismaService.institutionLink.count({
          where: queryWhere,
        })
      : undefined;

    const length = !!lengthQuery ? Number(lengthQuery) : undefined;

    const connections = await this.prismaService.institutionLink.findMany({
      take: last
        ? unbufferedCursor
          ? last
          : length % last === 0
            ? last
            : length % last
        : first
          ? first
          : undefined,
      skip: unbufferedCursor
        ? last
          ? length - unbufferedCursor + 1
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
      select: (() => {
        const select = selectObject<InstitutionLink, InstitutionLinkModel>(
          queriedFields,
        ) as any;

        if (select.account?.select) {
          if (select.account.select.balance) {
            delete select.account.select.balance;
            select.account.select.initialBalance = true;
            select.account.select.startDate = true;
            select.account.select.sourceTransactions = {
              where: { deletedAt: null },
              select: { amount: true, date: true, status: true },
            };
            select.account.select.destinyTransactions = {
              where: { deletedAt: null },
              select: { amount: true, date: true, status: true },
            };
            select.account.select.institutionLinkId = true;
          }
          if (select.account.select.currentBillingAmount) {
            delete select.account.select.currentBillingAmount;
            select.account.select.type = true;
            select.account.select.accountCard = {
              select: {
                billings: {
                  where: {
                    status: {
                      in: ['PENDING', 'CLOSED', 'OVERDUE'],
                    },
                  },
                  select: {
                    status: true,
                    transactions: {
                      where: {
                        deletedAt: null,
                        installments: { none: {} },
                      },
                      select: { amount: true },
                    },
                    installments: {
                      where: {
                        transaction: {
                          deletedAt: null,
                        },
                      },
                      select: { amount: true },
                    },
                  },
                  orderBy: { periodStart: 'desc' },
                  take: 1,
                },
              },
            };
          }
          if (select.account.select.totalInvested) {
            delete select.account.select.totalInvested;
            select.account.select.type = true;
            select.account.select.investments = {
              where: { status: 'OPEN' },
              select: { amount: true },
            };
          }
        }
        if (select.cards?.select) {
          const needsCurrentBilling = Boolean(
            select.cards.select.currentBilling,
          );
          const needsPayableBillings = Boolean(
            select.cards.select.payableBillings,
          );
          if (needsCurrentBilling || needsPayableBillings) {
            delete select.cards.select.currentBilling;
            delete select.cards.select.payableBillings;
            select.cards.select.billings = {
              where: {
                periodStart: { lte: new Date() },
                status: needsPayableBillings
                  ? { in: ['PENDING', 'CLOSED', 'OVERDUE'] }
                  : 'PENDING',
              },
              orderBy: [{ paymentDate: 'asc' }, { periodStart: 'asc' }],
              include: {
                transactions: {
                  where: {
                    deletedAt: null,
                    installments: { none: {} },
                  },
                  select: { amount: true },
                },
                installments: {
                  where: {
                    transaction: {
                      deletedAt: null,
                    },
                  },
                  include: {
                    transaction: {
                      select: { status: true, deletedAt: true },
                    },
                  },
                },
              },
            };
          }
        }
        return select;
      })(),
      where: queryWhere,
    });

    if (last) {
      connections.reverse();
    }

    if (connections.length === 0) {
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
    const needsBalance = (queriedFields as string[]).includes(
      'account.balance',
    );
    const investmentsByLinkId = new Map<string, any[]>();
    if (needsBalance) {
      const linkIds = connections
        .map((c: any) => c.account?.institutionLinkId)
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
                  in: ['FUNDING', 'REDEMPTION'],
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

    const edges = connections.map((connection, index) => {
      const cursorIndex =
        index +
        1 +
        (last
          ? unbufferedCursor
            ? unbufferedCursor - last - 1
            : length - connections.length
          : unbufferedCursor || 0);

      const bufferedCursor = Buffer.from(cursorIndex.toString())
        .toString('base64')
        .split('=')[0];

      const mappedCards =
        (connection as any).cards?.map((card: any) => {
          const billings = card.billings ?? [];
          const getTotalAmount = (billing: any) => {
            const txTotal = (billing.transactions ?? []).reduce(
              (acc: Decimal, tx: any) => acc.add(tx.amount),
              new Decimal(0),
            );
            const installmentsTotal = (billing.installments ?? [])
              .filter((i: any) => !i.transaction?.deletedAt)
              .reduce(
                (acc: Decimal, i: any) => acc.add(i.amount),
                new Decimal(0),
              );
            const totalAmount = txTotal.add(installmentsTotal);
            return {
              ...billing,
              totalAmount,
              usagePercentage: totalAmount
                .div(billing.limit)
                .mul(100)
                .toNumber(),
              transactionsCount:
                (billing.transactions?.length ?? 0) +
                (billing.installments?.filter(
                  (i: any) => !i.transaction?.deletedAt,
                ).length ?? 0),
            };
          };

          const currentPending = billings
            .filter((b: any) => b.status === 'PENDING')
            .sort(
              (a: any, b: any) =>
                new Date(b.periodStart).getTime() -
                new Date(a.periodStart).getTime(),
            )[0];

          const payableBillings = billings
            .filter((b: any) => b.status === 'CLOSED' || b.status === 'OVERDUE')
            .sort((a: any, b: any) => {
              const aTime = a.paymentDate
                ? new Date(a.paymentDate).getTime()
                : new Date(a.periodStart).getTime();
              const bTime = b.paymentDate
                ? new Date(b.paymentDate).getTime()
                : new Date(b.periodStart).getTime();
              return aTime - bTime;
            })
            .map(getTotalAmount);

          return {
            ...card,
            currentBilling: currentPending
              ? getTotalAmount(currentPending)
              : null,
            payableBillings,
          };
        }) ?? undefined;

      return {
        cursor: bufferedCursor,
        node: {
          ...connection,
          ...(mappedCards && { cards: mappedCards }),
          ...(connection.account && {
            account: {
              ...connection.account,
              ...(needsBalance && {
                balance: this.accountService.calculateBalance(
                  (connection.account as any).sourceTransactions,
                  (connection.account as any).destinyTransactions,
                  (connection.account as any).initialBalance,
                  this.accountService.mapInvestmentTransactions({
                    ...connection.account,
                    _investments:
                      investmentsByLinkId.get(
                        (connection.account as any).institutionLinkId,
                      ) || [],
                  }),
                ),
              }),
              ...((queriedFields as string[]).includes(
                'account.currentBillingAmount',
              ) && {
                currentBillingAmount:
                  this.accountService.calculateCurrentBillingAmount(
                    connection.account as any,
                  ),
              }),
              ...((queriedFields as string[]).includes(
                'account.totalInvested',
              ) && {
                totalInvested: this.accountService.calculateTotalInvested(
                  connection.account as any,
                ),
              }),
            } as any,
          }),
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
      ? await this.prismaService.institutionLink.findFirst({
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
          where: queryWhere,
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
}
