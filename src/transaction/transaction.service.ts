import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma/prisma.service';
import {
  Transaction,
  TransactionCreateInput,
} from '@/lib/graphql/prisma-client';
import { Prisma } from '@prisma/client';
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

    const transactionsLengthQuery = last
      ? await this.prismaService.transaction.count({
          where: {
            userId,
            ...(filterArgs.accountId && {
              OR: [
                {
                  sourceAccountId: filterArgs.accountId,
                },
                {
                  destinyAccountId: filterArgs.accountId,
                },
              ],
            }),
            ...(filterArgs.cardBillingId && {
              cardBillingId: filterArgs.cardBillingId,
            }),
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
      where: {
        userId,
        ...(filterArgs.accountId && {
          OR: [
            {
              sourceAccountId: filterArgs.accountId,
            },
            {
              destinyAccountId: filterArgs.accountId,
            },
          ],
        }),
        ...(!!filterArgs.cardBillingId && {
          cardBillingId: filterArgs.cardBillingId,
        }),
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
          where: {
            userId,
            ...(filterArgs.accountId && {
              OR: [
                {
                  sourceAccountId: filterArgs.accountId,
                },
                {
                  destinyAccountId: filterArgs.accountId,
                },
              ],
            }),
            ...(!!filterArgs.cardBillingId && {
              cardBillingId: filterArgs.cardBillingId,
            }),
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
