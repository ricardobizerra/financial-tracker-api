import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { Account, AccountCreateInput } from '@/lib/graphql/prisma-client';
import { Prisma } from '@prisma/client';
import {
  AccountFilterArgs,
  AccountModel,
  OrdenationAccountArgs,
} from './account.model';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { OrderDirection } from '@/utils/args/ordenation.args';
import { selectObject } from '@/utils/select-object';

@Injectable()
export class AccountService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany({
    filterArgs,
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
    filterArgs: AccountFilterArgs;
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
            type: filterArgs.type ?? undefined,
            userId,
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
      select: selectObject<Account, AccountModel>(queriedFields),
      where: {
        type: filterArgs.type ?? undefined,
        userId,
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

      return {
        cursor: bufferedCursor,
        node: account,
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
            type: filterArgs.type ?? undefined,
            userId,
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

  async find(where: Prisma.AccountWhereUniqueInput): Promise<Account | null> {
    return this.prismaService.account.findUnique({
      where,
    });
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
}
