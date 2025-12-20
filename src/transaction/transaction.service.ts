import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma/prisma.service';
import {
  Transaction,
  TransactionCreateInput,
} from '@/lib/graphql/prisma-client';
import { Prisma, TransactionType } from '@prisma/client';
import {
  TransactionModel,
  OrdenationTransactionArgs,
  TransactionFilterArgs,
} from './transaction.model';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { OrderDirection } from '@/utils/args/ordenation.args';
import { selectObject } from '@/utils/select-object';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  private buildWhereClause({
    userId,
    filterArgs,
    searchArgs,
  }: {
    userId: string;
    filterArgs: TransactionFilterArgs;
    searchArgs: SearchArgs;
  }): Prisma.TransactionWhereInput {
    return {
      userId,
      ...(filterArgs.accountId && {
        OR: [
          { sourceAccountId: filterArgs.accountId },
          { destinyAccountId: filterArgs.accountId },
        ],
      }),
      ...(filterArgs.cardBillingId && {
        cardBillingId: filterArgs.cardBillingId,
      }),
      ...(filterArgs.startDate && {
        date: {
          gte: filterArgs.startDate,
          ...(filterArgs.endDate && { lte: filterArgs.endDate }),
        },
      }),
      ...(!filterArgs.startDate &&
        filterArgs.endDate && {
          date: { lte: filterArgs.endDate },
        }),
      ...(filterArgs.types &&
        filterArgs.types.length > 0 && {
          type: { in: filterArgs.types },
        }),
      ...(filterArgs.statuses &&
        filterArgs.statuses.length > 0 && {
          status: { in: filterArgs.statuses },
        }),
      ...(searchArgs.search && {
        OR: ['name', 'description'].map((field) => ({
          [field]: {
            contains: searchArgs.search,
            mode: 'insensitive',
          },
        })),
      }),
    };
  }

  async findMany({
    filterArgs,
    userId,
    queriedFields,
    paginationArgs,
    searchArgs,
    ordenationArgs,
  }: {
    filterArgs: TransactionFilterArgs;
    userId: string;
    queriedFields: (keyof TransactionModel)[];
    paginationArgs: PaginationArgs;
    searchArgs: SearchArgs;
    ordenationArgs: OrdenationTransactionArgs;
  }) {
    const { after, before, first, last } = paginationArgs;
    const { orderBy, orderDirection = OrderDirection.Asc } = ordenationArgs;

    const unbufferedCursor = after
      ? Number(Buffer.from(after, 'base64').toString('utf-8'))
      : before
        ? Number(Buffer.from(before, 'base64').toString('utf-8'))
        : 0;

    const whereClause = this.buildWhereClause({
      userId,
      filterArgs,
      searchArgs,
    });

    const transactionsLengthQuery = last
      ? await this.prismaService.transaction.count({
          where: whereClause,
        })
      : undefined;

    const transactionsLength = !!transactionsLengthQuery
      ? Number(transactionsLengthQuery)
      : undefined;

    const transactions = await this.prismaService.transaction.findMany({
      take: last
        ? unbufferedCursor
          ? last
          : transactionsLength % last === 0
            ? last
            : transactionsLength % last
        : first
          ? first
          : undefined,
      skip: unbufferedCursor
        ? last
          ? transactionsLength - unbufferedCursor + 1
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
      select: selectObject<Transaction, TransactionModel>(queriedFields),
      where: whereClause,
    });

    if (last) {
      transactions.reverse();
    }

    if (transactions.length === 0) {
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

    const edges = transactions.map((transaction, index) => {
      const cursorIndex =
        index +
        1 +
        (last
          ? unbufferedCursor
            ? unbufferedCursor - last - 1
            : transactionsLength - transactions.length
          : unbufferedCursor || 0);

      const bufferedCursor = Buffer.from(cursorIndex.toString())
        .toString('base64')
        .split('=')[0];

      return {
        cursor: bufferedCursor,
        node: transaction,
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
      ? await this.prismaService.transaction.findFirst({
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
          where: whereClause,
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

  async getSummary({
    userId,
    filterArgs,
    searchArgs,
  }: {
    userId: string;
    filterArgs: TransactionFilterArgs;
    searchArgs: SearchArgs;
  }) {
    const whereClause = this.buildWhereClause({
      userId,
      filterArgs,
      searchArgs,
    });

    const aggregations = await this.prismaService.transaction.groupBy({
      by: ['type'],
      where: whereClause,
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;
    let transactionCount = 0;

    for (const agg of aggregations) {
      const amount = Number(agg._sum.amount || 0);
      const count = agg._count.id;

      if (agg.type === TransactionType.INCOME) {
        totalIncome += amount;
      } else if (agg.type === TransactionType.EXPENSE) {
        totalExpense += amount;
      }

      transactionCount += count;
    }

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount,
    };
  }

  async find(
    where: Prisma.TransactionWhereUniqueInput,
  ): Promise<Transaction | null> {
    return this.prismaService.transaction.findUnique({
      where,
    });
  }

  async create(data: TransactionCreateInput) {
    return this.prismaService.transaction.create({ data });
  }

  async update(id: string, data: TransactionCreateInput) {
    return this.prismaService.transaction.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prismaService.transaction.delete({ where: { id } });
  }
}
