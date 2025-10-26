import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma/prisma.service';
import {
  Institution,
  InstitutionCreateInput,
} from '@/lib/graphql/prisma-client';
import { Prisma } from '@prisma/client';
import {
  InstitutionModel,
  OrdenationInstitutionArgs,
} from './institution.model';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { OrderDirection } from '@/utils/args/ordenation.args';
import { selectObject } from '@/utils/select-object';

@Injectable()
export class InstitutionService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany({
    queriedFields,
    paginationArgs,
    searchArgs,
    ordenationArgs,
  }: {
    queriedFields: (keyof InstitutionModel)[];
    paginationArgs: PaginationArgs;
    searchArgs: SearchArgs;
    ordenationArgs: OrdenationInstitutionArgs;
  }) {
    const { after, before, first, last } = paginationArgs;
    const { orderBy, orderDirection = OrderDirection.Asc } = ordenationArgs;

    const unbufferedCursor = after
      ? Number(Buffer.from(after, 'base64').toString('utf-8'))
      : before
        ? Number(Buffer.from(before, 'base64').toString('utf-8'))
        : 0;

    const institutionsLengthQuery = last
      ? await this.prismaService.institution.count({
          where: {
            ...(!!searchArgs.search && {
              OR: ['name', 'code'].map((field) => ({
                [field]: {
                  contains: searchArgs.search,
                  mode: 'insensitive',
                },
              })),
            }),
          },
        })
      : undefined;

    const institutionsLength = !!institutionsLengthQuery
      ? Number(institutionsLengthQuery)
      : undefined;

    const institutions = await this.prismaService.institution.findMany({
      take: last
        ? unbufferedCursor
          ? last
          : institutionsLength % last === 0
            ? last
            : institutionsLength % last
        : first
          ? first
          : undefined,
      skip: unbufferedCursor
        ? last
          ? institutionsLength - unbufferedCursor + 1
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
      select: selectObject<Institution, InstitutionModel>(queriedFields),
      where: {
        ...(!!searchArgs.search && {
          OR: ['name', 'code'].map((field) => ({
            [field]: {
              contains: searchArgs.search,
              mode: 'insensitive',
            },
          })),
        }),
      },
    });

    if (last) {
      institutions.reverse();
    }

    if (institutions.length === 0) {
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

    const edges = institutions.map((institution, index) => {
      const cursorIndex =
        index +
        1 +
        (last
          ? unbufferedCursor
            ? unbufferedCursor - last - 1
            : institutionsLength - institutions.length
          : unbufferedCursor || 0);

      const bufferedCursor = Buffer.from(cursorIndex.toString())
        .toString('base64')
        .split('=')[0];

      return {
        cursor: bufferedCursor,
        node: institution,
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
      ? await this.prismaService.institution.findFirst({
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
            ...(!!searchArgs.search && {
              OR: ['name', 'code'].map((field) => ({
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
    where: Prisma.InstitutionWhereUniqueInput,
  ): Promise<Institution | null> {
    return this.prismaService.institution.findUnique({
      where,
    });
  }

  async create(data: InstitutionCreateInput) {
    return this.prismaService.institution.create({ data });
  }

  async update(id: string, data: InstitutionCreateInput) {
    return this.prismaService.institution.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prismaService.institution.delete({ where: { id } });
  }
}
