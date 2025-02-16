import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { OrdenationUserArgs } from '@/user/models/user.model';
import { OrderDirection } from '@/utils/args/ordenation.args';
import { Investment } from '@prisma/client';
import { selectObject } from '@/utils/select-object';
import { InvestmentConnection, InvestmentModel } from './investment.model';
import { formatDate } from '@/utils/date-formatter';
import { addDays, differenceInDays } from 'date-fns';
import { formatCurrency } from '@/utils/currency-formatter';
import { CdiValuesResponse } from '@/external/ipeadata/types/cdi-values-response';
import { getIrpfTax } from './utils/get-irpf-tax';
import { Regime } from '@/lib/graphql/prisma-client';
import { RedisCacheService } from '@/lib/redis/redis-cache.service';

type CorrectInvestmentAmountReturn = {
  correctedAmount: number;
  taxedAmount: number;
};

@Injectable()
export class InvestmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async findMany({
    queriedFields,
    paginationArgs,
    ordenationArgs,
  }: {
    queriedFields: (keyof InvestmentModel)[];
    paginationArgs: PaginationArgs;
    ordenationArgs: OrdenationUserArgs;
  }): Promise<InvestmentConnection> {
    const { after, before, first, last } = paginationArgs;
    const { orderBy, orderDirection = OrderDirection.Asc } = ordenationArgs;

    const unbufferedCursor = after
      ? Number(Buffer.from(after, 'base64').toString('utf-8'))
      : before
        ? Number(Buffer.from(before, 'base64').toString('utf-8'))
        : 0;

    const investmentsLengthQuery = last
      ? await this.prismaService.investment.count()
      : undefined;

    const investmentsLength = !!investmentsLengthQuery
      ? Number(investmentsLengthQuery?.[0].count)
      : undefined;

    const investmentsQuery = await this.prismaService.investment.findMany({
      take: last
        ? unbufferedCursor
          ? last
          : investmentsLength % last === 0
            ? last
            : investmentsLength % last
        : first
          ? first
          : undefined,
      skip: unbufferedCursor
        ? last
          ? investmentsLength - unbufferedCursor + 1
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
      select: selectObject<Investment, InvestmentModel>(queriedFields, {
        initialAmount: ['amount'],
        currentAmount: ['amount'],
        taxedAmount: ['amount'],
        period: ['startDate', 'duration'],
        ...((queriedFields.includes('currentAmount') ||
          queriedFields.includes('taxedAmount')) && {
          DEFAULT: [
            'amount',
            'startDate',
            'duration',
            'regimeName',
            'regimePercentage',
          ] satisfies (keyof Investment)[],
        }),
      }),
    });

    const investments: InvestmentModel[] = [];

    for (const investment of investmentsQuery) {
      const { correctedAmount, taxedAmount } =
        queriedFields.includes('currentAmount') ||
        queriedFields.includes('taxedAmount')
          ? await this.correctInvestmentAmount(investment)
          : {};

      investments.push({
        ...(queriedFields.includes('id') && { id: investment.id }),
        ...(queriedFields.includes('initialAmount') && {
          initialAmount: formatCurrency(investment.amount),
        }),
        ...(queriedFields.includes('currentAmount') && {
          currentAmount: formatCurrency(correctedAmount),
        }),
        ...(queriedFields.includes('taxedAmount') && {
          taxedAmount: formatCurrency(taxedAmount),
        }),
        ...(queriedFields.includes('period') && {
          period: `${formatDate(investment.startDate)} - ${formatDate(
            addDays(investment.startDate, investment.duration),
          )}`,
        }),
        ...(queriedFields.includes('duration') && {
          duration: investment.duration,
        }),
        ...(queriedFields.includes('regimeName') && {
          regimeName: investment.regimeName as Regime,
        }),
        ...(queriedFields.includes('regimePercentage') && {
          regimePercentage: investment.regimePercentage,
        }),
      });
    }

    if (last) {
      investments.reverse();
    }

    if (investments.length === 0) {
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

    const edges = investments.map((investment, index) => {
      const cursorIndex =
        index +
        1 +
        (last
          ? unbufferedCursor
            ? unbufferedCursor - last - 1
            : investmentsLength - investments.length
          : unbufferedCursor || 0);

      const bufferedCursor = Buffer.from(cursorIndex.toString())
        .toString('base64')
        .split('=')[0];

      return {
        cursor: bufferedCursor,
        node: investment,
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
      ? await this.prismaService.investment.findFirst({
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
        })
      : [];

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

  private async correctInvestmentAmount(
    investment: Investment,
  ): Promise<CorrectInvestmentAmountReturn> {
    const daysFromInitialDate = differenceInDays(
      new Date(),
      investment.startDate,
    );

    const isInvestmentFinished = daysFromInitialDate >= investment.duration;

    const currentInvestmentDays = isInvestmentFinished
      ? investment.duration
      : daysFromInitialDate;

    const irpfTax = getIrpfTax(currentInvestmentDays);

    const cdiValues = await this.redisCacheService.get(
      'external-ipeadata-cdi-daily',
    );

    if (!cdiValues) {
      return {
        correctedAmount: investment.amount,
        taxedAmount: investment.amount * (1 - irpfTax / 100),
      };
    }

    const cdiValuesLastDate: CdiValuesResponse['value'][number]['VALDATA'] =
      await this.redisCacheService.get('external-ipeadata-cdi-last-date');

    if (investment.startDate > new Date(cdiValuesLastDate)) {
      return {
        correctedAmount: investment.amount,
        taxedAmount: investment.amount * (1 - irpfTax / 100),
      };
    }

    const firstDayIndex = cdiValues.findIndex((cdi) => {
      const cdiDate = new Date(cdi.VALDATA);
      const dateToMatch = new Date(investment.startDate);
      cdiDate.setHours(0, 0, 0, 0);
      dateToMatch.setHours(0, 0, 0, 0);
      return cdiDate.getTime() >= dateToMatch.getTime();
    });

    if (firstDayIndex === -1) {
      throw new NotFoundException('Initial date not found');
    }

    let amount = investment.amount;

    for (
      let i = firstDayIndex;
      i < cdiValues?.length && i < firstDayIndex + investment.duration;
      i++
    ) {
      amount *=
        1 + (cdiValues[i].VALVALOR * (investment.regimePercentage / 100)) / 100;
    }

    const taxedAmount = amount * (1 - irpfTax / 100);

    return {
      correctedAmount: amount,
      taxedAmount,
    };
  }
}
