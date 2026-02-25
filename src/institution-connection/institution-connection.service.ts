import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { InstitutionConnection } from '@/lib/graphql/prisma-client';
import { Prisma } from '@prisma/client';
import {
  InstitutionConnectionFilterArgs,
  InstitutionConnectionModel,
  OrdenationInstitutionConnectionArgs,
} from './institution-connection.model';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { OrderDirection } from '@/utils/args/ordenation.args';
import { selectObject } from '@/utils/select-object';

@Injectable()
export class InstitutionConnectionService {
  constructor(private readonly prismaService: PrismaService) {}

  async find(
    where: Prisma.InstitutionConnectionWhereUniqueInput,
    queriedFields?: (keyof InstitutionConnectionModel)[],
  ) {
    return this.prismaService.institutionConnection.findUnique({
      where,
      select: queriedFields
        ? selectObject<InstitutionConnection, InstitutionConnectionModel>(
            queriedFields,
          )
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
    queriedFields: (keyof InstitutionConnectionModel)[];
    paginationArgs: PaginationArgs;
    searchArgs: SearchArgs;
    ordenationArgs: OrdenationInstitutionConnectionArgs;
    filterArgs: InstitutionConnectionFilterArgs;
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
      ? await this.prismaService.institutionConnection.count({
          where: queryWhere,
        })
      : undefined;

    const length = !!lengthQuery ? Number(lengthQuery) : undefined;

    const connections = await this.prismaService.institutionConnection.findMany(
      {
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
        select: selectObject<InstitutionConnection, InstitutionConnectionModel>(
          queriedFields,
        ),
        where: queryWhere,
      },
    );

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

      return {
        cursor: bufferedCursor,
        node: connection,
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
      ? await this.prismaService.institutionConnection.findFirst({
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
