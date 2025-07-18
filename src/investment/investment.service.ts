import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { OrderDirection } from '@/utils/args/ordenation.args';
import { Investment, Regime as RegimePrisma } from '@prisma/client';
import { selectObject } from '@/utils/select-object';
import {
  InvestmentConnection,
  InvestmentModel,
  OrdenationInvestmentArgs,
  TotalInvestmentsModel,
} from './investment.model';
import { differenceInDays } from 'date-fns';
import { getIrpfTax } from './utils/get-irpf-tax';
import {
  InvestmentCreateWithoutUserInput,
  Regime,
} from '@/lib/graphql/prisma-client';
import { RedisCacheService } from '@/lib/redis/redis-cache.service';
import { IpeadataService } from '@/external/ipeadata/ipeadata.service';
import { Cron } from '@nestjs/schedule';
import { BacenService } from '@/external/bacen/bacen.service';
import { BacenCachedValue } from '@/external/bacen/bacen.types';
import { IpeadataCachedValue } from '@/external/ipeadata/types/ipeadata-response';

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
  lastDate: string;
};

@Injectable()
export class InvestmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisCacheService: RedisCacheService,
    private readonly ipeadataService: IpeadataService,
    private readonly bacenService: BacenService,
  ) {}

  async findMany({
    queriedFields,
    paginationArgs,
    ordenationArgs,
    userId,
  }: {
    queriedFields: (keyof InvestmentModel)[];
    paginationArgs: PaginationArgs;
    ordenationArgs: OrdenationInvestmentArgs;
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
        currentVariation: ['amount'],
        taxPercentage: ['amount'],
        taxedVariation: ['amount'],
        ...((queriedFields.includes('correctedAmount') ||
          queriedFields.includes('taxedAmount') ||
          queriedFields.includes('currentVariation') ||
          queriedFields.includes('taxedVariation') ||
          queriedFields.includes('taxPercentage')) && {
          DEFAULT: [
            'id',
            'amount',
            'startDate',
            'finishedAt',
            'duration',
            'regimeName',
            'regimePercentage',
            'lastCorrectedAt',
            'correctedAmount',
            'taxedAmount',
          ] satisfies (keyof Investment)[],
        }),
      }),
      where: {
        userId,
      },
    });

    let cdiLastDate: string;
    let poupancaLastDate: string;

    if (
      investmentsQuery.some(
        (investment) => investment.regimeName === Regime.CDI,
      )
    ) {
      cdiLastDate = await this.redisCacheService.get(
        'external-ipeadata-cdi-last-date',
        async () => {
          const cdiValues = await this.ipeadataService.getCdiValues();

          await this.redisCacheService.set(
            'external-ipeadata-cdi-daily',
            cdiValues,
          );

          return cdiValues?.[cdiValues?.length - 1]?.date;
        },
      );
    }

    if (
      investmentsQuery.some(
        (investment) => investment.regimeName === Regime.POUPANCA,
      )
    ) {
      poupancaLastDate = await this.redisCacheService.get(
        'external-bacen-poupanca-last-date',
        async () => {
          const poupancaValues = await this.bacenService.getPoupancaValues();

          await this.redisCacheService.set(
            'external-bacen-poupanca-daily',
            poupancaValues,
          );

          return poupancaValues?.[poupancaValues?.length - 1]?.data;
        },
      );
    }

    const investments = await Promise.all(
      investmentsQuery.map(async (investment) => {
        const { correctedAmount, taxedAmount } =
          queriedFields.includes('correctedAmount') ||
          queriedFields.includes('taxedAmount') ||
          queriedFields.includes('currentVariation') ||
          queriedFields.includes('taxedVariation') ||
          queriedFields.includes('taxPercentage')
            ? await this.correctInvestmentAmount(
                investment,
                investment.regimeName === Regime.CDI
                  ? cdiLastDate
                  : poupancaLastDate,
              )
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
          ...(queriedFields.includes('amount') && {
            amount: investment.amount,
          }),
          ...(queriedFields.includes('correctedAmount') &&
            correctedAmount && {
              correctedAmount: correctedAmount,
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
              taxedAmount: taxedAmount,
            }),
          ...(queriedFields.includes('taxedVariation') && {
            taxedVariation: taxedVariation.toFixed(2).replace('.', ',') + '%',
          }),
          ...(queriedFields.includes('startDate') && {
            startDate: investment.startDate,
          }),
          ...(queriedFields.includes('finishedAt') && {
            finishedAt: investment.finishedAt,
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

  async delete(id: string, userId: string) {
    const investmentFoundAndFromUser =
      await this.prismaService.investment.findUnique({
        where: {
          id,
          user: {
            id: userId,
          },
        },
      });

    if (!investmentFoundAndFromUser) {
      throw new NotFoundException('Investment not found');
    }

    const investment = await this.prismaService.investment.delete({
      where: {
        id,
      },
    });

    return {
      id: investment.id,
    };
  }

  async totalInvestments({
    userId,
    queriedFields,
  }: {
    userId: string;
    queriedFields: (keyof TotalInvestmentsModel)[];
  }): Promise<TotalInvestmentsModel> {
    const {
      _sum: {
        amount: totalInitialAmount,
        correctedAmount: totalCurrentAmount,
        taxedAmount: totalTaxedAmount,
      },
    } = await this.prismaService.investment.aggregate({
      _sum: {
        amount: true,
        correctedAmount: true,
        taxedAmount: true,
      },
      where: { userId },
    });

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
        initialAmount: totalInitialAmount,
      }),
      ...(queriedFields.includes('currentAmount') && {
        currentAmount: totalCurrentAmount,
      }),
      ...(queriedFields.includes('currentVariation') && {
        currentVariation: currentVariation.toFixed(2).replace('.', ',') + '%',
      }),
      ...(queriedFields.includes('taxedAmount') && {
        taxedAmount: totalTaxedAmount,
      }),
      ...(queriedFields.includes('taxedVariation') && {
        taxedVariation: taxedVariation.toFixed(2).replace('.', ',') + '%',
      }),
    };
  }

  private async correctInvestmentAmount(
    investment: Pick<
      Investment,
      | 'id'
      | 'startDate'
      | 'finishedAt'
      | 'amount'
      | 'duration'
      | 'regimeName'
      | 'regimePercentage'
      | 'lastCorrectedAt'
      | 'correctedAmount'
      | 'taxedAmount'
    >,
    lastDate: string,
  ): Promise<CorrectInvestmentAmountReturn> {
    if (
      investment.lastCorrectedAt &&
      new Date(investment.lastCorrectedAt?.toISOString().split('T')[0]) >=
        new Date(lastDate)
    ) {
      const daysFromInitialDate = differenceInDays(
        new Date(),
        investment.startDate,
      );

      const isInvestmentFinished = daysFromInitialDate >= investment.duration;

      const currentInvestmentDays = isInvestmentFinished
        ? investment.duration
        : daysFromInitialDate;

      const irpfTax =
        investment.regimeName === Regime.CDI
          ? getIrpfTax(currentInvestmentDays)
          : 0;

      return {
        correctedAmount: investment.correctedAmount,
        correctedVariation:
          100 *
          ((investment.correctedAmount - investment.amount) /
            investment.amount),
        taxPercentage: irpfTax,
        taxedAmount: investment.taxedAmount,
        taxedVariation:
          100 *
          ((investment.taxedAmount - investment.amount) / investment.amount),
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

    const irpfTax =
      investment.regimeName === Regime.CDI
        ? getIrpfTax(currentInvestmentDays)
        : 0;

    let amount = investment.amount;

    if (investment.regimeName === Regime.CDI) {
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
          lastDate: lastDate || '',
        };

        await this.prismaService.investment.update({
          where: {
            id: investment.id,
          },
          data: {
            correctedAmount: result.correctedAmount,
            taxedAmount: result.taxedAmount,
            lastCorrectedAt: new Date(),
          },
        });

        return result;
      }

      if (
        investment.startDate > new Date(cdiValues[cdiValues.length - 1].date)
      ) {
        const result = {
          correctedAmount: investment.amount,
          correctedVariation: 0,
          taxedAmount: investment.amount * (1 - irpfTax / 100),
          taxPercentage: irpfTax,
          taxedVariation:
            100 *
            ((investment.amount * (irpfTax / 100) * -1) / investment.amount),
          lastDate: lastDate || '',
        };

        await this.prismaService.investment.update({
          where: {
            id: investment.id,
          },
          data: {
            correctedAmount: result.correctedAmount,
            taxedAmount: result.taxedAmount,
            lastCorrectedAt: new Date(),
          },
        });

        return result;
      }

      const firstDayIndex = cdiValues.findIndex((cdi) => {
        const cdiDate = new Date(cdi.date);
        const dateToMatch = new Date(investment.startDate);
        cdiDate.setHours(0, 0, 0, 0);
        dateToMatch.setHours(0, 0, 0, 0);
        return cdiDate.getTime() >= dateToMatch.getTime();
      });

      if (firstDayIndex === -1) {
        throw new NotFoundException('Initial date not found in CDI data');
      }

      const endIndex = Math.min(
        firstDayIndex + investment.duration,
        cdiValues.length,
      );

      for (let i = firstDayIndex; i < endIndex; i++) {
        amount *=
          1 + (cdiValues[i].value * (investment.regimePercentage / 100)) / 100;
      }
    }

    if (investment.regimeName === Regime.POUPANCA) {
      const poupancaValues = await this.redisCacheService.get(
        'external-bacen-poupanca-daily',
        async () => {
          return await this.bacenService.getPoupancaValues();
        },
      );

      if (!poupancaValues || poupancaValues.length === 0) {
        throw new NotFoundException('Poupança data not available');
      }

      const firstDayIndex = poupancaValues.findIndex((poupanca) => {
        const poupancaDate = new Date(poupanca.data);
        const dateToMatch = new Date(investment.startDate);
        poupancaDate.setHours(0, 0, 0, 0);
        dateToMatch.setHours(0, 0, 0, 0);
        return poupancaDate.getTime() >= dateToMatch.getTime();
      });

      if (firstDayIndex === -1) {
        throw new NotFoundException('Initial date not found in Poupança data');
      }

      const effectiveEndDate = investment.finishedAt || new Date();

      let currentDate = new Date(investment.startDate);

      const rateMap = new Map<string, number>();
      for (const item of poupancaValues) {
        const date = new Date(item.data.split('/').reverse().join('/'));
        rateMap.set(date?.toISOString().split('T')[0], item.valor);
      }

      while (true) {
        const startDay = currentDate.getDate();
        const isSpecialCase = startDay >= 29;

        let nextBirthday = new Date(currentDate);
        nextBirthday.setMonth(nextBirthday.getMonth() + 1);

        if (isSpecialCase) {
          nextBirthday.setDate(1);
        }

        const newDate = new Date(nextBirthday);

        if (isSpecialCase) {
          nextBirthday = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
        } else {
          nextBirthday = new Date(
            newDate.getFullYear(),
            newDate.getMonth(),
            Math.min(
              startDay,
              new Date(
                newDate.getFullYear(),
                newDate.getMonth() + 1,
                0,
              ).getDate(),
            ),
          );
        }

        if (nextBirthday > effectiveEndDate) {
          break;
        }

        const rateDate = new Date(nextBirthday);

        const rateKey = rateDate?.toISOString().split('T')[0];
        const dailyRate = rateMap.get(rateKey);

        currentDate = new Date(nextBirthday);

        amount *= 1 + dailyRate / 100;
      }
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
      lastDate: lastDate || '',
    };

    await this.prismaService.investment.update({
      where: {
        id: investment.id,
      },
      data: {
        correctedAmount: result.correctedAmount,
        taxedAmount: result.taxedAmount,
        lastCorrectedAt: new Date(),
      },
    });

    return result;
  }

  // Monday to Friday, 8:00 to 12:00
  @Cron('0 0 8-12 * * 1-5')
  async updateInvestments() {
    const investments = await this.prismaService.investment.findMany({
      select: {
        id: true,
        amount: true,
        startDate: true,
        finishedAt: true,
        duration: true,
        regimeName: true,
        regimePercentage: true,
        lastCorrectedAt: true,
        correctedAmount: true,
        taxedAmount: true,
      },
    });

    let latestCdiDate: string | null = null;
    let cdiValues: IpeadataCachedValue[] | null = null;

    let latestPoupancaDate: string | null = null;
    let poupancaValues: BacenCachedValue[] | null = null;

    const nonUpdatableRegimes: RegimePrisma[] = [];

    if (
      investments.some((investment) => investment.regimeName === Regime.CDI)
    ) {
      const lastKnownCdiDate = await this.redisCacheService.get(
        'external-ipeadata-cdi-last-date',
      );

      cdiValues = await this.ipeadataService.getCdiValues();

      if (!cdiValues || cdiValues.length === 0) {
        nonUpdatableRegimes.push(Regime.CDI);
      } else {
        latestCdiDate = cdiValues[cdiValues.length - 1]?.date;

        if (
          lastKnownCdiDate &&
          latestCdiDate &&
          new Date(lastKnownCdiDate) >= new Date(latestCdiDate)
        ) {
          nonUpdatableRegimes.push(Regime.CDI);
        }
      }
    }

    if (
      investments.some(
        (investment) => investment.regimeName === Regime.POUPANCA,
      )
    ) {
      const lastKnownPoupancaDate = await this.redisCacheService.get(
        'external-bacen-poupanca-last-date',
      );

      poupancaValues = await this.bacenService.getPoupancaValues();

      if (!poupancaValues || poupancaValues.length === 0) {
        nonUpdatableRegimes.push(Regime.POUPANCA);
      } else {
        latestPoupancaDate = poupancaValues[poupancaValues.length - 1]?.data;

        if (
          lastKnownPoupancaDate &&
          latestPoupancaDate &&
          new Date(lastKnownPoupancaDate) >= new Date(latestPoupancaDate)
        ) {
          nonUpdatableRegimes.push(Regime.POUPANCA);
        }
      }
    }

    await Promise.all([
      this.redisCacheService.set('external-ipeadata-cdi-daily', cdiValues),
      this.redisCacheService.set(
        'external-ipeadata-cdi-last-date',
        latestCdiDate,
      ),
      this.redisCacheService.set(
        'external-bacen-poupanca-daily',
        poupancaValues,
      ),
      this.redisCacheService.set(
        'external-bacen-poupanca-last-date',
        latestPoupancaDate,
      ),
    ]);

    await Promise.all(
      investments
        .filter(
          (investment) => !nonUpdatableRegimes.includes(investment.regimeName),
        )
        .map((investment) =>
          this.correctInvestmentAmount(
            investment,
            investment.regimeName === Regime.CDI
              ? latestCdiDate
              : latestPoupancaDate,
          ),
        ),
    );
  }
}
