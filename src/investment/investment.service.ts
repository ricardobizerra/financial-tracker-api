import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { OrdenationUserArgs } from '@/user/models/user.model';
import { OrderDirection } from '@/utils/args/ordenation.args';
import { Investment } from '@prisma/client';
import { selectObject } from '@/utils/select-object';
import {
  InvestmentConnection,
  InvestmentModel,
  TotalInvestmentsModel,
} from './investment.model';
import { formatDate } from '@/utils/date-formatter';
import { addDays, differenceInDays } from 'date-fns';
import { formatCurrency } from '@/utils/currency-formatter';
import { getIrpfTax } from './utils/get-irpf-tax';
import {
  InvestmentCreateWithoutUserInput,
  Regime,
} from '@/lib/graphql/prisma-client';
import { RedisCacheService } from '@/lib/redis/redis-cache.service';
import { IpeadataService } from '@/external/ipeadata/ipeadata.service';
import { Cron, CronExpression } from '@nestjs/schedule';

type CorrectInvestmentAmountReturn = {
  correctedAmount: number;
  correctedVariation: number;
  taxPercentage: number;
  taxedAmount: number;
  taxedVariation: number;
};

export type InvestmentCachedAmounts = {
  correctedAmount: number;
  taxedAmount: number;
  cdiLastDate: string;
};

@Injectable()
export class InvestmentService {
  private readonly CACHE_TTL = 1000 * 60 * 60 * 24;
  private readonly CACHE_PREFIX = 'investment-amounts';

  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisCacheService: RedisCacheService,
    private readonly ipeadataService: IpeadataService,
  ) {}

  async findMany({
    queriedFields,
    paginationArgs,
    ordenationArgs,
    userId,
  }: {
    queriedFields: (keyof InvestmentModel)[];
    paginationArgs: PaginationArgs;
    ordenationArgs: OrdenationUserArgs;
    userId: string;
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
        currentVariation: ['amount'],
        taxPercentage: ['amount'],
        taxedAmount: ['amount'],
        taxedVariation: ['amount'],
        period: ['startDate', 'duration'],
        ...((queriedFields.includes('currentAmount') ||
          queriedFields.includes('taxedAmount') ||
          queriedFields.includes('currentVariation') ||
          queriedFields.includes('taxedVariation') ||
          queriedFields.includes('taxPercentage')) && {
          DEFAULT: [
            'id',
            'amount',
            'startDate',
            'duration',
            'regimeName',
            'regimePercentage',
          ] satisfies (keyof Investment)[],
        }),
      }),
      where: {
        userId,
      },
    });

    const cdiLastDate = await this.redisCacheService.get(
      'external-ipeadata-cdi-last-date',
      async () => {
        const cdiValues = await this.ipeadataService.getCdiValues();

        await this.redisCacheService.set(
          'external-ipeadata-cdi-daily',
          cdiValues,
        );

        return cdiValues?.[cdiValues?.length - 1]?.VALDATA;
      },
    );

    const investments = await Promise.all(
      investmentsQuery.map(async (investment) => {
        const { correctedAmount, taxedAmount } =
          queriedFields.includes('currentAmount') ||
          queriedFields.includes('taxedAmount') ||
          queriedFields.includes('currentVariation') ||
          queriedFields.includes('taxedVariation') ||
          queriedFields.includes('taxPercentage')
            ? await this.correctInvestmentAmount(investment, cdiLastDate)
            : {};

        const correctedVariation = correctedAmount
          ? 100 * ((correctedAmount - investment.amount) / investment.amount)
          : 0;

        const taxedVariation = taxedAmount
          ? 100 * ((taxedAmount - investment.amount) / investment.amount)
          : 0;

        const daysFromInitialDate = differenceInDays(
          new Date(),
          investment.startDate,
        );
        const isInvestmentFinished = daysFromInitialDate >= investment.duration;
        const currentInvestmentDays = isInvestmentFinished
          ? investment.duration
          : daysFromInitialDate;
        const taxPercentage = getIrpfTax(currentInvestmentDays);

        return {
          ...(queriedFields.includes('id') && { id: investment.id }),
          ...(queriedFields.includes('initialAmount') && {
            initialAmount: formatCurrency(investment.amount),
          }),
          ...(queriedFields.includes('currentAmount') &&
            correctedAmount && {
              currentAmount: formatCurrency(correctedAmount),
            }),
          ...(queriedFields.includes('currentVariation') && {
            currentVariation:
              correctedVariation.toFixed(2).replace('.', ',') + '%',
          }),
          ...(queriedFields.includes('taxPercentage') && {
            taxPercentage: taxPercentage.toFixed(2).replace('.', ',') + '%',
          }),
          ...(queriedFields.includes('taxedAmount') &&
            taxedAmount && {
              taxedAmount: formatCurrency(taxedAmount),
            }),
          ...(queriedFields.includes('taxedVariation') && {
            taxedVariation: taxedVariation.toFixed(2).replace('.', ',') + '%',
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
        };
      }),
    );

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
          where: {
            userId,
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

  async create(data: InvestmentCreateWithoutUserInput, userId: string) {
    const investment = await this.prismaService.investment.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return investment;
  }

  async totalInvestments({
    userId,
    queriedFields,
  }: {
    userId: string;
    queriedFields: (keyof TotalInvestmentsModel)[];
  }): Promise<TotalInvestmentsModel> {
    const investments = await this.prismaService.investment.findMany({
      select: {
        id: true,
        amount: true,
        startDate: true,
        duration: true,
        regimePercentage: true,
      },
      where: { userId },
    });

    let totalInitialAmount = 0;
    let totalCurrentAmount = 0;
    let totalTaxedAmount = 0;

    const cdiLastDate = await this.redisCacheService.get(
      'external-ipeadata-cdi-last-date',
      async () => {
        const cdiValues = await this.ipeadataService.getCdiValues();

        await this.redisCacheService.set(
          'external-ipeadata-cdi-daily',
          cdiValues,
        );

        return cdiValues?.[cdiValues?.length - 1]?.VALDATA;
      },
    );

    const processedInvestments = await Promise.all(
      investments.map((investment, index) =>
        this.correctInvestmentAmount(investment, cdiLastDate).then(
          (result) => ({
            ...result,
            originalIndex: index,
          }),
        ),
      ),
    );

    for (const {
      originalIndex,
      correctedAmount,
      taxedAmount,
    } of processedInvestments) {
      totalInitialAmount += investments[originalIndex].amount;
      totalCurrentAmount += correctedAmount;
      totalTaxedAmount += taxedAmount;
    }

    const currentVariation =
      queriedFields.includes('currentVariation') && totalInitialAmount > 0
        ? 100 * ((totalCurrentAmount - totalInitialAmount) / totalInitialAmount)
        : 0;

    const taxedVariation =
      queriedFields.includes('taxedVariation') && totalInitialAmount > 0
        ? 100 * ((totalTaxedAmount - totalInitialAmount) / totalInitialAmount)
        : 0;

    return {
      ...(queriedFields.includes('initialAmount') && {
        initialAmount: formatCurrency(totalInitialAmount),
      }),
      ...(queriedFields.includes('currentAmount') && {
        currentAmount: formatCurrency(totalCurrentAmount),
      }),
      ...(queriedFields.includes('currentVariation') && {
        currentVariation: currentVariation.toFixed(2).replace('.', ',') + '%',
      }),
      ...(queriedFields.includes('taxedAmount') && {
        taxedAmount: formatCurrency(totalTaxedAmount),
      }),
      ...(queriedFields.includes('taxedVariation') && {
        taxedVariation: taxedVariation.toFixed(2).replace('.', ',') + '%',
      }),
    };
  }

  private async correctInvestmentAmount(
    investment: Pick<
      Investment,
      'id' | 'startDate' | 'amount' | 'duration' | 'regimePercentage'
    >,
    cdiLastDate: string,
  ): Promise<CorrectInvestmentAmountReturn> {
    const cachedData = await this.redisCacheService.get(
      `${this.CACHE_PREFIX}:${investment.id}`,
    );

    if (cachedData && cachedData.cdiLastDate === cdiLastDate) {
      const { correctedAmount, taxedAmount } = cachedData;
      const daysFromInitialDate = differenceInDays(
        new Date(),
        investment.startDate,
      );
      const isInvestmentFinished = daysFromInitialDate >= investment.duration;
      const currentInvestmentDays = isInvestmentFinished
        ? investment.duration
        : daysFromInitialDate;
      const irpfTax = getIrpfTax(currentInvestmentDays);

      return {
        correctedAmount,
        correctedVariation:
          100 * ((correctedAmount - investment.amount) / investment.amount),
        taxPercentage: irpfTax,
        taxedAmount,
        taxedVariation:
          100 * ((taxedAmount - investment.amount) / investment.amount),
      };
    }

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
      async () => {
        return await this.ipeadataService.getCdiValues();
      },
    );

    if (!cdiValues || cdiValues.length === 0) {
      const result = {
        correctedAmount: investment.amount,
        correctedVariation: 0,
        taxPercentage: irpfTax,
        taxedAmount: investment.amount * (1 - irpfTax / 100),
        taxedVariation:
          100 *
          ((investment.amount * (irpfTax / 100) * -1) / investment.amount),
        cdiLastDate: cdiLastDate || '',
      };

      await this.redisCacheService.set(
        `${this.CACHE_PREFIX}:${investment.id}`,
        {
          correctedAmount: result.correctedAmount,
          taxedAmount: result.taxedAmount,
          cdiLastDate: cdiLastDate || '',
        },
        this.CACHE_TTL,
      );

      return result;
    }

    if (
      investment.startDate > new Date(cdiValues[cdiValues.length - 1].VALDATA)
    ) {
      const result = {
        correctedAmount: investment.amount,
        correctedVariation: 0,
        taxedAmount: investment.amount * (1 - irpfTax / 100),
        taxPercentage: irpfTax,
        taxedVariation:
          100 *
          ((investment.amount * (irpfTax / 100) * -1) / investment.amount),
        cdiLastDate: cdiLastDate || '',
      };

      await this.redisCacheService.set(
        `${this.CACHE_PREFIX}:${investment.id}`,
        {
          correctedAmount: result.correctedAmount,
          taxedAmount: result.taxedAmount,
          cdiLastDate: cdiLastDate || '',
        },
        this.CACHE_TTL,
      );

      return result;
    }

    const firstDayIndex = cdiValues.findIndex((cdi) => {
      const cdiDate = new Date(cdi.VALDATA);
      const dateToMatch = new Date(investment.startDate);
      cdiDate.setHours(0, 0, 0, 0);
      dateToMatch.setHours(0, 0, 0, 0);
      return cdiDate.getTime() >= dateToMatch.getTime();
    });

    if (firstDayIndex === -1) {
      throw new NotFoundException('Initial date not found in CDI data');
    }

    let amount = investment.amount;
    const endIndex = Math.min(
      firstDayIndex + investment.duration,
      cdiValues.length,
    );

    for (let i = firstDayIndex; i < endIndex; i++) {
      amount *=
        1 + (cdiValues[i].VALVALOR * (investment.regimePercentage / 100)) / 100;
    }

    const taxedAmount = amount * (1 - irpfTax / 100);

    const result = {
      correctedAmount: amount,
      correctedVariation:
        100 * ((amount - investment.amount) / investment.amount),
      taxPercentage: irpfTax,
      taxedAmount,
      taxedVariation:
        100 * ((taxedAmount - investment.amount) / investment.amount),
      cdiLastDate: cdiLastDate || '',
    };

    await this.redisCacheService.set(
      `${this.CACHE_PREFIX}:${investment.id}`,
      {
        correctedAmount: result.correctedAmount,
        taxedAmount: result.taxedAmount,
        cdiLastDate: cdiLastDate || '',
      },
      this.CACHE_TTL,
    );

    return result;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async updateInvestments() {
    const lastKnownCdiDate = await this.redisCacheService.get(
      'external-ipeadata-cdi-last-date',
    );

    const cdiValues = await this.ipeadataService.getCdiValues();

    if (!cdiValues || cdiValues.length === 0) {
      return;
    }

    const latestCdiDate = cdiValues[cdiValues.length - 1]?.VALDATA;

    if (
      lastKnownCdiDate &&
      latestCdiDate &&
      new Date(lastKnownCdiDate) >= new Date(latestCdiDate)
    ) {
      return;
    }

    await this.redisCacheService.set('external-ipeadata-cdi-daily', cdiValues);
    await this.redisCacheService.set(
      'external-ipeadata-cdi-last-date',
      latestCdiDate,
    );

    const investments = await this.prismaService.investment.findMany({
      select: {
        id: true,
        amount: true,
        startDate: true,
        duration: true,
        regimePercentage: true,
      },
    });

    await Promise.all(
      investments.map((investment) =>
        this.correctInvestmentAmount(investment, latestCdiDate),
      ),
    );
  }
}
