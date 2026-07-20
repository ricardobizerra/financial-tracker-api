import { PrismaService } from '@/lib/prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { OrderDirection } from '@/utils/args/ordenation.args';
import {
  Investment,
  InvestmentTransactionRole,
  Prisma,
  Regime as RegimePrisma,
  TransactionStatus,
  TransactionType,
  InvestmentStatus,
} from '@prisma/client';
import { selectObject } from '@/utils/select-object';
import {
  InvestmentConnection,
  InvestmentModel,
  InvestmentRegimeSummary,
  InvestmentRegimeSummaryConnection,
  OrdenationInvestmentArgs,
  TotalInvestmentsModel,
  InvestmentChartDataPoint,
} from './investment.model';
import {
  RegimeTaxesHistoryModel,
  InvestmentTaxesHistoryModel,
} from './investment-taxes.model';
import { differenceInDays, format, parse } from 'date-fns';
import { getIrpfTax } from './utils/get-irpf-tax';
import {
  Regime,
  Transaction,
  InvestmentType,
} from '@/lib/graphql/prisma-client';
import { RedisCacheService } from '@/lib/redis/redis-cache.service';
import { IpeadataService } from '@/external/ipeadata/ipeadata.service';
import { Cron } from '@nestjs/schedule';
import { BacenService } from '@/external/bacen/bacen.service';
import { BacenCachedValue } from '@/external/bacen/bacen.types';
import { IpeadataCachedValue } from '@/external/ipeadata/types/ipeadata-response';
import { CreateInvestmentInput } from './input/create-investment.input';
import { UpdateInvestmentInput } from './input/update-investment.input';
import { TesouroTransparenteService } from '@/external/tesouro-transparente/tesouro-transparente.service';
import { getBusinessDays } from './utils/get-business-days';
import { getIofTax } from './utils/get-iof-tax';
import {
  InvestmentTaxesAndFees,
  ApplicableTaxEnum,
  SellFeasibility,
  SellFeasibilityStatus,
} from './investment.model';
import { getSellFeasibility } from './utils/get-sell-feasibility';

type CorrectInvestmentAmountReturn = {
  correctedAmount: number;
  correctedVariation: number;
  taxPercentage: number;
  taxedAmount: number;
  taxedVariation: number;
  taxesAndFees: InvestmentTaxesAndFees;
  sellFeasibility: SellFeasibility;
};

export type InvestmentCachedAmounts = {
  correctedAmount: number;
  taxedAmount: number;
  lastDate: string;
};

import { getTaxesAndFeesDetails } from './utils/get-taxes-details';

@Injectable()
export class InvestmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisCacheService: RedisCacheService,
    private readonly ipeadataService: IpeadataService,
    private readonly bacenService: BacenService,
    private readonly tesouroTransparenteService: TesouroTransparenteService,
  ) {}

  async enrichInvestment(
    investment: any,
    queriedFields: string[],
    cdiLastDate?: string,
    poupancaLastDate?: string,
  ): Promise<any> {
    const { correctedAmount, taxedAmount, taxesAndFees, sellFeasibility } =
      queriedFields.includes('correctedAmount') ||
      queriedFields.includes('taxedAmount') ||
      queriedFields.includes('currentVariation') ||
      queriedFields.includes('taxedVariation') ||
      queriedFields.includes('taxPercentage') ||
      queriedFields.includes('sellFeasibility') ||
      queriedFields.some((f) => f.startsWith('taxesAndFees'))
        ? await this.correctInvestmentAmount(
            investment,
            investment.regimeName === Regime.CDI
              ? cdiLastDate
              : poupancaLastDate,
          )
        : ({} as any);

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

    let currentMarketRate: number | null = null;
    if (
      queriedFields.includes('currentMarketRate') &&
      investment.type === InvestmentType.TREASURY &&
      investment.maturityDate
    ) {
      let tipoTituloPrefix = '';
      if (investment.regimeName === Regime.PREFIXED)
        tipoTituloPrefix = 'Tesouro Prefixado';
      else if (investment.regimeName === Regime.SELIC)
        tipoTituloPrefix = 'Tesouro Selic';
      else if (investment.regimeName === Regime.IPCA)
        tipoTituloPrefix = 'Tesouro IPCA+';

      if (tipoTituloPrefix) {
        const maturityStr = format(investment.maturityDate, 'dd/MM/yyyy');
        const bondHistory =
          await this.tesouroTransparenteService.getHistoricalDataForBond(
            tipoTituloPrefix,
            maturityStr,
          );
        if (bondHistory && bondHistory.length > 0) {
          const lastPoint = bondHistory[bondHistory.length - 1];
          currentMarketRate = lastPoint.taxaVendaManha;
        }
      }
    }

    return {
      ...investment,
      currentMarketRate,
      ...(correctedAmount && {
        correctedAmount: correctedAmount,
      }),
      currentVariation: correctedVariation.toFixed(2).replace('.', ',') + '%',
      taxPercentage: taxPercentage.toFixed(2).replace('.', ',') + '%',
      ...(taxedAmount && {
        taxedAmount: taxedAmount,
      }),
      taxedVariation: taxedVariation.toFixed(2).replace('.', ',') + '%',
      regimeName: investment.regimeName as Regime,
      taxesAndFees:
        taxesAndFees ||
        getTaxesAndFeesDetails(
          investment,
          {
            irpfAmount:
              (correctedAmount || investment.amount) -
              (taxedAmount || investment.amount),
            iofAmount: 0,
            b3CustodyFeeAmount: 0,
            brokerageFeeAmount: 0,
          },
          correctedAmount ? correctedAmount - investment.amount : 0,
        ),
      sellFeasibility:
        sellFeasibility ||
        getSellFeasibility(
          investment.type,
          correctedAmount || investment.amount,
          investment.amount,
        ),
    };
  }

  async findOne(
    id: string,
    queriedFields: (keyof InvestmentModel)[],
    userId: string,
  ): Promise<InvestmentModel> {
    const investment = await this.prismaService.investment.findFirst({
      where: {
        id,
        institutionLink: { userId },
      },
      select: selectObject<Investment, InvestmentModel>(
        queriedFields.filter(
          (f) =>
            !f.startsWith('taxesAndFees') &&
            !f.startsWith('sellFeasibility') &&
            f !== 'currentMarketRate',
        ) as (keyof InvestmentModel)[],
        {
          currentVariation: ['amount'],
          taxPercentage: ['amount'],
          taxedVariation: ['amount'],
          currentMarketRate: ['type', 'maturityDate', 'regimeName'],
          institutionLink: [],
          transactions: [],
          taxesAndFees: [],
          sellFeasibility: [],
          ...((queriedFields.includes('correctedAmount') ||
            queriedFields.includes('taxedAmount') ||
            queriedFields.includes('currentVariation') ||
            queriedFields.includes('taxedVariation') ||
            queriedFields.includes('taxPercentage') ||
            queriedFields.includes('sellFeasibility')) && {
            DEFAULT: [
              'id',
              'amount',
              'startDate',
              'finishedAt',
              'duration',
              'regimeName',
              'regimePercentage',
              'type',
              'fixedRate',
              'brokerageFee',
              'maturityDate',
              'lastCorrectedAt',
              'correctedAmount',
              'taxedAmount',
            ] satisfies (keyof Investment)[],
          }),
        },
      ),
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    let cdiLastDate: string | undefined;
    let poupancaLastDate: string | undefined;

    if (investment.regimeName === Regime.CDI) {
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

    if (investment.regimeName === Regime.POUPANCA) {
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

    return this.enrichInvestment(
      investment,
      queriedFields,
      cdiLastDate,
      poupancaLastDate,
    );
  }

  async findMany({
    queriedFields,
    paginationArgs,
    ordenationArgs,
    userId,
    regime,
    status,
    institutionLinkIds,
  }: {
    queriedFields: (keyof InvestmentModel)[];
    paginationArgs: PaginationArgs;
    ordenationArgs: OrdenationInvestmentArgs;
    userId: string;
    regime: Regime | null;
    status?: InvestmentStatus | null;
    institutionLinkIds?: string[] | null;
  }): Promise<InvestmentConnection> {
    const { after, before, first, last } = paginationArgs;
    const { orderBy, orderDirection = OrderDirection.Asc } = ordenationArgs;

    const userInstitutionLinks =
      await this.prismaService.institutionLink.findMany({
        where: {
          userId,
        },
        select: { id: true },
      });

    const userInstitutionLinkIds = userInstitutionLinks.map((link) => link.id);

    const whereClause: Prisma.InvestmentWhereInput = {
      institutionLinkId: {
        in: userInstitutionLinkIds,
      },
      regimeName: regime ?? undefined,
      status: status ?? undefined,
      ...(institutionLinkIds?.length && {
        institutionLinkId: { in: institutionLinkIds },
      }),
    };

    const unbufferedCursor = after
      ? Number(Buffer.from(after, 'base64').toString('utf-8'))
      : before
        ? Number(Buffer.from(before, 'base64').toString('utf-8'))
        : 0;

    const investmentsLengthQuery = last
      ? await this.prismaService.investment.count({
          where: whereClause,
        })
      : undefined;

    const investmentsLength = !!investmentsLengthQuery
      ? Number(investmentsLengthQuery)
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
      select: selectObject<Investment, InvestmentModel>(
        queriedFields.filter(
          (f) =>
            !f.startsWith('taxesAndFees') &&
            !f.startsWith('sellFeasibility') &&
            f !== 'currentMarketRate',
        ) as (keyof InvestmentModel)[],
        {
          currentVariation: ['amount'],
          taxPercentage: ['amount'],
          taxedVariation: ['amount'],
          currentMarketRate: ['type', 'maturityDate', 'regimeName'],
          institutionLink: [],
          transactions: [],
          taxesAndFees: [],
          sellFeasibility: [],
          ...((queriedFields.includes('correctedAmount') ||
            queriedFields.includes('taxedAmount') ||
            queriedFields.includes('currentVariation') ||
            queriedFields.includes('taxedVariation') ||
            queriedFields.includes('taxPercentage') ||
            queriedFields.includes('sellFeasibility')) && {
            DEFAULT: [
              'id',
              'amount',
              'startDate',
              'finishedAt',
              'duration',
              'regimeName',
              'regimePercentage',
              'type',
              'fixedRate',
              'brokerageFee',
              'maturityDate',
              'lastCorrectedAt',
              'correctedAmount',
              'taxedAmount',
            ] satisfies (keyof Investment)[],
          }),
        },
      ),
      where: whereClause,
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
      investmentsQuery.map((investment) =>
        this.enrichInvestment(
          investment,
          queriedFields,
          cdiLastDate,
          poupancaLastDate,
        ),
      ),
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
            institutionLink: {
              userId,
            },
            regimeName: regime,
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

  async create(data: CreateInvestmentInput, userId: string) {
    const isPoupanca = data.regimeName === Regime.POUPANCA;

    const investment = await this.prismaService.investment.create({
      data: {
        amount: data.amount,
        startDate: data.startDate,
        duration: isPoupanca ? undefined : data.duration,
        regimeName: data.regimeName,
        regimePercentage: isPoupanca ? data.regimePercentage : 100,
        type: data.type,
        fixedRate: data.fixedRate,
        brokerageFee: data.brokerageFee,
        maturityDate: data.maturityDate,
        institutionLink: {
          connect: {
            id: data.institutionLinkId,
          },
        },
      },
    });

    if (!investment) {
      return null;
    }

    const investmentTransaction =
      await this.prismaService.investmentTransaction.create({
        data: {
          amount: data.amount,
          role: InvestmentTransactionRole.FUNDING,
          investment: {
            connect: {
              id: investment.id,
            },
          },
        },
      });

    if (!investmentTransaction) {
      await this.delete(investment.id, userId);
      return null;
    }

    return { investment, investmentTransaction };
  }
  async update(data: UpdateInvestmentInput, userId: string) {
    const isPoupanca = data.regimeName === Regime.POUPANCA;

    const existingInvestment = await this.prismaService.investment.findFirst({
      where: {
        id: data.id,
        institutionLink: {
          userId,
        },
      },
      include: {
        transactions: {
          where: { role: InvestmentTransactionRole.FUNDING },
          take: 1,
        },
      },
    });

    if (!existingInvestment) {
      throw new NotFoundException('Investment not found');
    }

    const investment = await this.prismaService.investment.update({
      where: { id: data.id },
      data: {
        amount: data.amount,
        startDate: data.startDate,
        duration: isPoupanca ? undefined : data.duration,
        regimeName: data.regimeName,
        regimePercentage: isPoupanca ? data.regimePercentage : 100,
        type: data.type,
        fixedRate: data.fixedRate,
        brokerageFee: data.brokerageFee,
        maturityDate: data.maturityDate,
        ...(data.institutionLinkId
          ? {
              institutionLink: {
                connect: { id: data.institutionLinkId },
              },
            }
          : {}),
      },
    });

    let investmentTransaction = existingInvestment.transactions[0];

    if (data.amount && Number(investmentTransaction?.amount) !== data.amount) {
      investmentTransaction =
        await this.prismaService.investmentTransaction.update({
          where: { id: investmentTransaction.id },
          data: { amount: data.amount },
        });
    }

    return { investment, investmentTransaction };
  }
  async delete(id: string, userId: string) {
    const investmentFoundAndFromUser =
      await this.prismaService.investment.findFirst({
        where: {
          id,
          institutionLink: {
            userId,
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

  async redeem(investmentId: string, userId: string, finishedAt?: Date) {
    const investment = await this.prismaService.investment.findFirst({
      where: {
        id: investmentId,
        institutionLink: {
          userId,
        },
      },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    if (investment.status === 'CLOSED') {
      throw new BadRequestException('Investment is already redeemed');
    }

    const redeemDate = finishedAt || new Date();

    // Get the latest corrected amounts
    let lastDate: string;
    if (investment.regimeName === Regime.CDI) {
      lastDate = await this.redisCacheService.get(
        'external-ipeadata-cdi-last-date',
        async () => {
          const cdiValues = await this.ipeadataService.getCdiValues();
          return cdiValues?.[cdiValues?.length - 1]?.date;
        },
      );
    } else {
      lastDate = await this.redisCacheService.get(
        'external-bacen-poupanca-last-date',
        async () => {
          const poupancaValues = await this.bacenService.getPoupancaValues();
          return poupancaValues?.[poupancaValues?.length - 1]?.data;
        },
      );
    }

    const correctionResult = await this.correctInvestmentAmount(
      investment,
      lastDate,
    );

    const taxedAmount = correctionResult.taxedAmount;

    const [updatedInvestment, redemptionTransaction] =
      await this.prismaService.$transaction(async (tx) => {
        const inv = await tx.investment.update({
          where: { id: investmentId },
          data: {
            status: 'CLOSED',
            finishedAt: redeemDate,
            correctedAmount: correctionResult.correctedAmount,
            taxedAmount: correctionResult.taxedAmount,
          },
        });

        // 1. Transaction: REDEMPTION (Gross Amount = marketValue)
        const redemption = await tx.investmentTransaction.create({
          data: {
            amount: correctionResult.correctedAmount,
            role: InvestmentTransactionRole.REDEMPTION,
            investment: { connect: { id: investmentId } },
          },
        });

        const taxes = correctionResult.taxesAndFees;
        if (taxes && taxes.details) {
          for (const tax of taxes.details) {
            if (tax.amount > 0) {
              await tx.investmentTransaction.create({
                data: {
                  amount: tax.amount,
                  role: InvestmentTransactionRole.FEE,
                  investment: { connect: { id: investmentId } },
                },
              });
            }
          }
        }

        return [inv, redemption];
      });

    return { investment: updatedInvestment, redemptionTransaction };
  }

  async getInvestmentRegimes({
    userId,
    institutionLinkId,
    queriedFields,
  }: {
    userId: string;
    institutionLinkId?: string | null;
    queriedFields: (keyof InvestmentRegimeSummary)[];
  }): Promise<InvestmentRegimeSummaryConnection> {
    const institutionLinks = await this.prismaService.institutionLink.findMany({
      where: {
        userId,
        ...(institutionLinkId && { id: institutionLinkId }),
      },
      select: { id: true },
    });

    const institutionLinkIds = institutionLinks.map((link) => link.id);

    const whereClause: Prisma.InvestmentWhereInput = {
      institutionLinkId: {
        in: institutionLinkIds,
      },
    };

    // Get all investments with their corrected and taxed amounts
    const allInvestments = await this.prismaService.investment.findMany({
      where: whereClause,
      select: {
        id: true,
        amount: true,
        correctedAmount: true,
        taxedAmount: true,
        regimeName: true,
      },
    });

    // Calculate totals for percentage calculations
    const totalInvested = allInvestments.reduce(
      (sum, inv) => sum + Number(inv.amount),
      0,
    );

    const allRegimesNames = Object.values(RegimePrisma);

    // Process each regime
    const regimeSummariesUnsorted = allRegimesNames.map((regimeName) => {
      const regimeInvestments = allInvestments.filter(
        (inv) => inv.regimeName === regimeName,
      );

      const quantity = regimeInvestments.length;

      const currentInvested = regimeInvestments.reduce(
        (sum, inv) => sum + (Number(inv.correctedAmount) || Number(inv.amount)),
        0,
      );

      const taxedInvested = regimeInvestments.reduce(
        (sum, inv) => sum + (Number(inv.taxedAmount) || Number(inv.amount)),
        0,
      );

      const regimeTotalInvested = regimeInvestments.reduce(
        (sum, inv) => sum + Number(inv.amount),
        0,
      );

      const summary: InvestmentRegimeSummary = {
        ...(queriedFields.includes('name') && {
          name: regimeName,
        }),
        ...(queriedFields.includes('quantity') && {
          quantity,
        }),
        ...(queriedFields.includes('totalInvested') && {
          totalInvested: regimeTotalInvested,
        }),
        ...(queriedFields.includes('currentInvested') && {
          currentInvested,
        }),
        ...(queriedFields.includes('currentInvestedPercentage') && {
          currentInvestedPercentage:
            totalInvested > 0 && regimeTotalInvested > 0
              ? ((currentInvested / regimeTotalInvested) * 100 - 100)
                  .toFixed(2)
                  .replace('.', ',') + '%'
              : '0%',
        }),
        ...(queriedFields.includes('taxedInvested') && {
          taxedInvested,
        }),
        ...(queriedFields.includes('taxedInvestedPercentage') && {
          taxedInvestedPercentage:
            totalInvested > 0 && regimeTotalInvested > 0
              ? ((taxedInvested / regimeTotalInvested) * 100 - 100)
                  .toFixed(2)
                  .replace('.', ',') + '%'
              : '0%',
        }),
      };

      return summary;
    });

    regimeSummariesUnsorted.sort((a, b) => {
      const aTaxed = Number(a.taxedInvested || 0);
      const bTaxed = Number(b.taxedInvested || 0);
      if (aTaxed !== bTaxed) {
        return bTaxed - aTaxed;
      }
      const aQty = Number(a.quantity || 0);
      const bQty = Number(b.quantity || 0);
      return bQty - aQty;
    });

    const regimeSummaries = regimeSummariesUnsorted.map((summary, index) => {
      return {
        cursor: Buffer.from(index.toString()).toString('base64').split('=')[0],
        node: summary,
      };
    });

    const startCursor = regimeSummaries?.length
      ? regimeSummaries[0].cursor
      : null;
    const endCursor = regimeSummaries?.length
      ? regimeSummaries[regimeSummaries.length - 1].cursor
      : null;

    return {
      edges: regimeSummaries,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor,
        endCursor,
      },
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
        amount: rawTotalInitialAmount,
        correctedAmount: rawTotalCurrentAmount,
        taxedAmount: rawTotalTaxedAmount,
      },
    } = await this.prismaService.investment.aggregate({
      _sum: {
        amount: true,
        correctedAmount: true,
        taxedAmount: true,
      },
      where: {
        institutionLinkId: {
          in: (
            await this.prismaService.institutionLink.findMany({
              where: { userId },
              select: { id: true },
            })
          ).map((link) => link.id),
        },
      },
    });

    // Default to 0 when there are no investments
    const totalInitialAmount = rawTotalInitialAmount ?? 0;
    const totalCurrentAmount = rawTotalCurrentAmount ?? 0;
    const totalTaxedAmount = rawTotalTaxedAmount ?? 0;

    let totalRealAmount = totalInitialAmount;

    if (queriedFields.includes('realVariation') && totalInitialAmount > 0) {
      const allInvestments = await this.prismaService.investment.findMany({
        where: {
          institutionLinkId: {
            in: (
              await this.prismaService.institutionLink.findMany({
                where: { userId },
                select: { id: true },
              })
            ).map((link) => link.id),
          },
        },
        select: { amount: true, startDate: true },
      });

      const ipcaValues = await this.redisCacheService.get(
        'external-bacen-ipca-monthly',
        async () => await this.bacenService.getIpcaValues(),
      );

      if (ipcaValues && ipcaValues.length > 0) {
        const ipcaMap = new Map<string, number>();
        for (const ipca of ipcaValues) {
          ipcaMap.set(ipca.data.substring(0, 7), ipca.valor);
        }

        let calculatedRealAmount = 0;
        const endDate = new Date();
        const { eachMonthOfInterval } = await import('date-fns');

        for (const inv of allInvestments) {
          const startDate = inv.startDate;
          let currentPrincipal = inv.amount;

          if (startDate < endDate) {
            const months = eachMonthOfInterval({
              start: startDate,
              end: endDate,
            });
            for (const month of months) {
              const monthKey = format(month, 'yyyy-MM');
              const ipca = ipcaMap.get(monthKey) || 0;
              currentPrincipal *= 1 + ipca;
            }
          }
          calculatedRealAmount += currentPrincipal;
        }
        totalRealAmount = calculatedRealAmount;
      }
    }

    const currentVariation =
      queriedFields.includes('currentVariation') && totalInitialAmount > 0
        ? 100 * ((totalCurrentAmount - totalInitialAmount) / totalInitialAmount)
        : 0;

    const taxedVariation =
      queriedFields.includes('taxedVariation') && totalInitialAmount > 0
        ? 100 * ((totalTaxedAmount - totalInitialAmount) / totalInitialAmount)
        : 0;

    const realVariation =
      queriedFields.includes('realVariation') && totalRealAmount > 0
        ? 100 * (totalTaxedAmount / totalRealAmount - 1)
        : 0;

    return {
      ...(queriedFields.includes('initialAmount') && {
        initialAmount: totalInitialAmount ?? 0,
      }),
      ...(queriedFields.includes('currentAmount') && {
        currentAmount: totalCurrentAmount ?? 0,
      }),
      ...(queriedFields.includes('currentVariation') && {
        currentVariation: currentVariation.toFixed(2).replace('.', ',') + '%',
      }),
      ...(queriedFields.includes('taxedAmount') && {
        taxedAmount: totalTaxedAmount ?? 0,
      }),
      ...(queriedFields.includes('taxedVariation') && {
        taxedVariation: taxedVariation.toFixed(2).replace('.', ',') + '%',
      }),
      ...(queriedFields.includes('realVariation') && {
        realVariation:
          (realVariation > 0 ? '+' : '') +
          realVariation.toFixed(2).replace('.', ',') +
          '%',
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
      | 'type'
      | 'fixedRate'
      | 'brokerageFee'
      | 'maturityDate'
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

      let theoreticalAmount = investment.amount;
      if (
        investment.type === 'TREASURY' &&
        investment.regimeName !== Regime.SELIC
      ) {
        const rate = investment.fixedRate ? investment.fixedRate / 100 : 0;
        const businessDays = getBusinessDays(investment.startDate, new Date());
        theoreticalAmount =
          investment.amount * Math.pow(1 + rate, businessDays / 252);
      } else if (
        investment.type === 'TREASURY' &&
        investment.regimeName === Regime.SELIC
      ) {
        // Fallback for SELIC cache
        theoreticalAmount = investment.correctedAmount;
      }

      const irpfTax =
        investment.regimeName === Regime.CDI
          ? getIrpfTax(currentInvestmentDays)
          : 0;

      const profit = Math.max(
        0,
        investment.correctedAmount - investment.amount,
      );
      const daysHeld = differenceInDays(new Date(), investment.startDate);

      let iofAmount = 0;
      let b3CustodyFeeAmount = 0;
      let brokerageFeeAmount = 0;

      if (investment.type === 'TREASURY') {
        const iofRate = getIofTax(daysHeld);
        iofAmount = profit * iofRate;
        const businessDays = getBusinessDays(investment.startDate, new Date());
        const b3ExemptionThreshold = 10000;
        let b3Basis = investment.correctedAmount;
        if (
          investment.regimeName === Regime.SELIC &&
          investment.correctedAmount <= b3ExemptionThreshold
        ) {
          b3Basis = 0;
        } else if (
          investment.regimeName === Regime.SELIC &&
          investment.correctedAmount > b3ExemptionThreshold
        ) {
          b3Basis = investment.correctedAmount - b3ExemptionThreshold;
        }
        b3CustodyFeeAmount = 0.002 * (businessDays / 252) * b3Basis;

        if (investment.brokerageFee) {
          brokerageFeeAmount =
            (investment.brokerageFee / 100) *
            (businessDays / 252) *
            investment.correctedAmount;
        }
      } else {
        const iofRate = getIofTax(daysHeld);
        iofAmount = profit * iofRate;
      }

      const remainingProfit = Math.max(0, profit - iofAmount);
      const irpfAmount = remainingProfit * (irpfTax / 100);

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
        taxesAndFees: getTaxesAndFeesDetails(
          investment,
          {
            irpfAmount,
            iofAmount,
            b3CustodyFeeAmount,
            brokerageFeeAmount,
          },
          profit,
        ),
        sellFeasibility: getSellFeasibility(
          investment.type,
          investment.correctedAmount,
          theoreticalAmount,
        ),
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

    let amount = investment.amount;
    let theoreticalAmount = investment.amount;

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
          taxPercentage: 0,
          taxedAmount: investment.amount,
          taxedVariation: 0,
          lastDate: lastDate || '',
          taxesAndFees: getTaxesAndFeesDetails(
            investment,
            {
              irpfAmount: 0,
              iofAmount: 0,
              b3CustodyFeeAmount: 0,
              brokerageFeeAmount: 0,
            },
            0,
          ),
          sellFeasibility: {
            status: SellFeasibilityStatus.NOT_APPLICABLE,
            message: 'Não aplicável para este tipo de investimento.',
          },
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
          taxedAmount: investment.amount,
          taxPercentage: 0,
          taxedVariation: 0,
          lastDate: lastDate || '',
          taxesAndFees: getTaxesAndFeesDetails(
            investment,
            {
              irpfAmount: 0,
              iofAmount: 0,
              b3CustodyFeeAmount: 0,
              brokerageFeeAmount: 0,
            },
            0,
          ),
          sellFeasibility: {
            status: SellFeasibilityStatus.NOT_APPLICABLE,
            message: 'Não aplicável para este tipo de investimento.',
          },
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

    if (investment.type === InvestmentType.TREASURY) {
      const businessDays = getBusinessDays(investment.startDate, new Date());
      let selicValues;
      if (investment.regimeName === Regime.SELIC) {
        selicValues = await this.redisCacheService.get(
          'external-bacen-selic-daily',
          async () => await this.bacenService.getSelicValues(),
        );
      }

      let ipcaValues;
      if (investment.regimeName === Regime.IPCA) {
        ipcaValues = await this.redisCacheService.get(
          'external-bacen-ipca-monthly',
          async () => await this.bacenService.getIpcaValues(),
        );
      }

      let historicalData: any[] = [];
      if (investment.maturityDate) {
        let tipoTituloPrefix = '';
        if (investment.regimeName === Regime.PREFIXED)
          tipoTituloPrefix = 'Tesouro Prefixado';
        else if (investment.regimeName === Regime.SELIC)
          tipoTituloPrefix = 'Tesouro Selic';
        else if (investment.regimeName === Regime.IPCA)
          tipoTituloPrefix = 'Tesouro IPCA+';

        if (tipoTituloPrefix) {
          const maturityStr = format(investment.maturityDate, 'dd/MM/yyyy');
          historicalData =
            await this.tesouroTransparenteService.getHistoricalDataForBond(
              tipoTituloPrefix,
              maturityStr,
            );
        }
      }

      const importedCalculate = await import('./utils/tesouro-direto-math');
      const calcResult = importedCalculate.calculateTesouroTheoreticalValue({
        amount: investment.amount,
        fixedRate: investment.fixedRate,
        regimeName: investment.regimeName,
        businessDays,
        selicValues,
        ipcaValues,
        startDate: investment.startDate,
        maturityDate: investment.maturityDate,
        historicalData,
      });
      amount = calcResult.marketValue;
      theoreticalAmount = calcResult.theoreticalValue;
    }

    const isTreasury = investment.type === InvestmentType.TREASURY;

    let iofAmount = 0;
    let b3CustodyFeeAmount = 0;
    let brokerageFeeAmount = 0;
    let irpfTax = 0;
    let irpfAmount = 0;

    if (isTreasury) {
      const businessDays = getBusinessDays(investment.startDate, new Date());
      const daysHeld = differenceInDays(new Date(), investment.startDate);
      const profit = Math.max(0, amount - investment.amount);

      const iofRate = getIofTax(daysHeld);
      iofAmount = profit * iofRate;

      const remainingProfit = Math.max(0, profit - iofAmount);
      irpfTax = getIrpfTax(daysHeld);
      irpfAmount = remainingProfit * (irpfTax / 100);

      const b3ExemptionThreshold = 10000;
      let b3Basis = amount;
      if (
        investment.regimeName === Regime.SELIC &&
        amount <= b3ExemptionThreshold
      ) {
        b3Basis = 0;
      } else if (
        investment.regimeName === Regime.SELIC &&
        amount > b3ExemptionThreshold
      ) {
        b3Basis = amount - b3ExemptionThreshold;
      }

      b3CustodyFeeAmount = 0.002 * (businessDays / 252) * b3Basis;

      if (investment.brokerageFee) {
        brokerageFeeAmount =
          (investment.brokerageFee / 100) * (businessDays / 252) * amount;
      }
    } else {
      irpfTax =
        investment.regimeName === Regime.CDI
          ? getIrpfTax(currentInvestmentDays)
          : 0;
      const profit = Math.max(0, amount - investment.amount);
      irpfAmount = profit * (irpfTax / 100);
    }

    const totalTaxesAndFees =
      iofAmount + irpfAmount + b3CustodyFeeAmount + brokerageFeeAmount;
    const taxedAmount = amount - totalTaxesAndFees;

    const result = {
      correctedAmount: amount,
      correctedVariation:
        100 * ((amount - investment.amount) / investment.amount),
      taxPercentage: irpfTax,
      taxedAmount,
      taxedVariation:
        100 * ((taxedAmount - investment.amount) / investment.amount),
      taxesAndFees: getTaxesAndFeesDetails(
        investment,
        {
          irpfAmount,
          iofAmount,
          b3CustodyFeeAmount,
          brokerageFeeAmount,
        },
        amount - investment.amount,
      ),
      sellFeasibility: getSellFeasibility(
        investment.type,
        amount,
        theoreticalAmount,
      ),
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
        type: true,
        fixedRate: true,
        brokerageFee: true,
        maturityDate: true,
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

  async getInvestmentEvolution({
    userId,
    accountId,
    period,
    regime,
  }: {
    userId: string;
    accountId?: string;
    period: string;
    regime?: string;
  }) {
    // Calcular data de início baseado no período
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'MONTH':
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate(),
        );
        break;
      case 'THREE_MONTHS':
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          now.getDate(),
        );
        break;
      case 'SIX_MONTHS':
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 6,
          now.getDate(),
        );
        break;
      case 'YEAR':
        startDate = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate(),
        );
        break;
      case 'ALL':
      default:
        startDate = new Date(2000, 0, 1);
        break;
    }

    // Buscar investimentos do usuário
    const investments = await this.prismaService.investment.findMany({
      where: {
        institutionLink: {
          userId,
        },
        ...(accountId && { accountId }),
        ...(regime && { regimeName: regime as any }),
      },
      select: {
        id: true,
        amount: true,
        correctedAmount: true,
        taxedAmount: true,
        startDate: true,
        finishedAt: true,
        regimeName: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    if (investments.length === 0) {
      return {
        dataPoints: [],
        totalInvested: 0,
        totalCurrentAmount: 0,
        totalTaxedAmount: 0,
        totalProfit: '0',
        totalProfitPercentage: '0%',
      };
    }

    // Encontrar a data mais antiga relevante
    const oldestInvestmentDate = investments.reduce((oldest, inv) => {
      const invDate = new Date(inv.startDate);
      return invDate < oldest ? invDate : oldest;
    }, new Date());

    const effectiveStartDate =
      oldestInvestmentDate > startDate ? oldestInvestmentDate : startDate;

    // Gerar pontos de dados mensais
    const dataPoints: {
      date: Date;
      invested: number;
      currentAmount: number;
      taxedAmount: number;
      profit: number;
    }[] = [];

    const currentDate = new Date(effectiveStartDate);
    currentDate.setDate(1); // Primeiro dia do mês

    while (currentDate <= now) {
      const pointDate = new Date(currentDate);

      // Calcular investimentos ativos naquela data
      let invested = 0;
      let currentAmount = 0;
      let taxedAmount = 0;

      investments.forEach((inv) => {
        const invStartDate = new Date(inv.startDate);
        const invEndDate = inv.finishedAt ? new Date(inv.finishedAt) : null;

        // Se o investimento já existia naquela data
        if (invStartDate <= pointDate) {
          // Se ainda está ativo ou encerrou depois dessa data
          if (!invEndDate || invEndDate >= pointDate) {
            invested += Number(inv.amount);

            // Para valores correntes, usar proporcional ao tempo
            const daysFromStart = Math.floor(
              (pointDate.getTime() - invStartDate.getTime()) /
                (1000 * 60 * 60 * 24),
            );
            const totalDays = Math.floor(
              (now.getTime() - invStartDate.getTime()) / (1000 * 60 * 60 * 24),
            );

            if (totalDays > 0) {
              const progressRatio = Math.min(daysFromStart / totalDays, 1);
              const profit =
                Number(inv.correctedAmount || inv.amount) - Number(inv.amount);
              const taxedProfit =
                Number(inv.taxedAmount || inv.amount) - Number(inv.amount);

              currentAmount += Number(inv.amount) + profit * progressRatio;
              taxedAmount += Number(inv.amount) + taxedProfit * progressRatio;
            } else {
              currentAmount += Number(inv.amount);
              taxedAmount += Number(inv.amount);
            }
          }
        }
      });

      if (invested > 0) {
        dataPoints.push({
          date: pointDate,
          invested,
          currentAmount,
          taxedAmount,
          profit: currentAmount - invested,
        });
      }

      // Avançar para o próximo mês
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Calcular totais atuais
    const totalInvested = investments.reduce(
      (sum, inv) => sum + Number(inv.amount),
      0,
    );
    const totalCurrentAmount = investments.reduce(
      (sum, inv) => sum + Number(inv.correctedAmount || inv.amount),
      0,
    );
    const totalTaxedAmount = investments.reduce(
      (sum, inv) => sum + Number(inv.taxedAmount || inv.amount),
      0,
    );
    const totalProfit = totalCurrentAmount - totalInvested;
    const totalProfitPercentage =
      totalInvested > 0
        ? ((totalProfit / totalInvested) * 100).toFixed(2) + '%'
        : '0%';

    return {
      dataPoints,
      totalInvested,
      totalCurrentAmount,
      totalTaxedAmount,
      totalProfit: totalProfit.toFixed(2),
      totalProfitPercentage,
    };
  }

  async getAccountsWithInvestmentCount({
    userId,
    regime,
  }: {
    userId: string;
    regime: RegimePrisma;
  }) {
    const accounts = await this.prismaService.institutionLink.findMany({
      where: {
        userId,
      },
      include: {
        institution: true,
        _count: {
          select: {
            investments: {
              where: {
                regimeName: regime,
              },
            },
          },
        },
      },
      orderBy: {
        institution: {
          name: 'asc',
        },
      },
    });

    return accounts.map((account) => ({
      id: account.id,
      name: account.institution?.name,
      institutionLogoUrl: account.institution?.logoUrl,
      investmentCount: account._count.investments,
    }));
  }

  async getAvailableTreasuryBonds(regime: Regime): Promise<string[]> {
    let tipoTituloPrefix = '';
    if (regime === Regime.PREFIXED) tipoTituloPrefix = 'Tesouro Prefixado';
    else if (regime === Regime.SELIC) tipoTituloPrefix = 'Tesouro Selic';
    else if (regime === Regime.IPCA) tipoTituloPrefix = 'Tesouro IPCA+';

    if (!tipoTituloPrefix) return [];

    return await this.tesouroTransparenteService.getAvailableBonds(
      tipoTituloPrefix,
    );
  }

  async getInvestmentChartData(
    investmentId: string,
    userId: string,
  ): Promise<InvestmentChartDataPoint[]> {
    const investment = await this.prismaService.investment.findFirst({
      where: {
        id: investmentId,
        institutionLink: { userId },
      },
      select: {
        amount: true,
        startDate: true,
        type: true,
        fixedRate: true,
        regimeName: true,
        maturityDate: true,
        regimePercentage: true,
      },
    });

    if (!investment) throw new NotFoundException('Investment not found');

    const points: InvestmentChartDataPoint[] = [];

    // Simplification for other types
    if (
      investment.type !== InvestmentType.TREASURY &&
      investment.regimeName !== Regime.CDI
    ) {
      return points;
    }

    let selicValues;
    if (investment.regimeName === Regime.SELIC) {
      selicValues = await this.redisCacheService.get(
        'external-bacen-selic-daily',
        async () => await this.bacenService.getSelicValues(),
      );
    }

    const { calculateTesouroTheoreticalValue } = await import(
      './utils/tesouro-direto-math'
    );
    const { eachDayOfInterval, isWeekend } = await import('date-fns');
    const Holidays = (await import('date-holidays')).default;
    const hd = new Holidays('BR');

    const days = eachDayOfInterval({
      start: investment.startDate,
      end: new Date(),
    });
    let historicalData: any[] = [];
    if (investment.maturityDate) {
      let tipoTituloPrefix = '';
      if (investment.regimeName === Regime.PREFIXED)
        tipoTituloPrefix = 'Tesouro Prefixado';
      else if (investment.regimeName === Regime.SELIC)
        tipoTituloPrefix = 'Tesouro Selic';
      else if (investment.regimeName === Regime.IPCA)
        tipoTituloPrefix = 'Tesouro IPCA+';

      if (tipoTituloPrefix) {
        const maturityStr = format(investment.maturityDate, 'dd/MM/yyyy');
        historicalData =
          await this.tesouroTransparenteService.getHistoricalDataForBond(
            tipoTituloPrefix,
            maturityStr,
          );
      }
    }

    if (investment.regimeName === Regime.CDI) {
      const cdiValues = await this.redisCacheService.get(
        'external-ipeadata-cdi-daily',
        async () => {
          return await this.ipeadataService.getCdiValues();
        },
      );

      const cdiDateMap = new Map<string, number>();
      if (cdiValues) {
        cdiValues.forEach((val: any) => cdiDateMap.set(val.date, val.value));
      }

      let amount = investment.amount;
      for (let i = 0; i < days.length; i++) {
        const day = days[i];
        const dayStr = day.toISOString().split('T')[0];

        if (i > 0 && !isWeekend(day) && !hd.isHoliday(day)) {
          const rate = cdiDateMap.get(dayStr);
          if (rate !== undefined && investment.regimePercentage) {
            amount *= 1 + (rate * (investment.regimePercentage / 100)) / 100;
          }
        }

        points.push({
          date: dayStr,
          theoreticalValue: amount,
          marketValue: null,
        });
      }
      return points;
    }

    let businessDays = 0;
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      const dayStr = day.toISOString().split('T')[0];
      if (i > 0 && !isWeekend(day) && !hd.isHoliday(day)) {
        businessDays++;
      }

      // Compute value at this point in time
      const value = calculateTesouroTheoreticalValue({
        amount: investment.amount,
        fixedRate: investment.fixedRate,
        regimeName: investment.regimeName,
        businessDays,
        selicValues,
        startDate: investment.startDate,
        maturityDate: investment.maturityDate,
        historicalData,
        targetDate: day,
      });

      points.push({
        date: dayStr,
        theoreticalValue: value.theoreticalValue,
        marketValue: value.marketValue,
      });
    }

    return points;
  }

  async getRegimeTaxesHistory(regime: Regime): Promise<RegimeTaxesHistoryModel> {
    if (regime === Regime.CDI) {
      let cdiData = await this.redisCacheService.get('external-ipeadata-cdi-daily');
      if (!cdiData || cdiData.length === 0) {
        await this.ipeadataService.cacheCdiValues();
        cdiData = await this.redisCacheService.get('external-ipeadata-cdi-daily');
      }
      return {
        dataPoints: (cdiData || []).map((item) => ({
          date: item.date,
          value: item.value,
        })),
      };
    }

    if (regime === Regime.POUPANCA) {
      let poupancaData = await this.redisCacheService.get('external-bacen-poupanca-daily');
      if (!poupancaData || poupancaData.length === 0) {
        await this.bacenService.cachePoupancaValues();
        poupancaData = await this.redisCacheService.get('external-bacen-poupanca-daily');
      }
      return {
        dataPoints: (poupancaData || []).map((item) => {
          return {
            date: item.data, // Already in yyyy-MM-dd format
            value: item.valor,
          };
        }),
      };
    }

    const isTreasuryRegime = [Regime.SELIC, Regime.IPCA, Regime.PREFIXED].includes(regime);
    if (isTreasuryRegime) {
      let selicData = await this.redisCacheService.get('external-bacen-selic-daily');
      if (!selicData || selicData.length === 0) {
        await this.bacenService.cacheSelicValues();
        selicData = await this.redisCacheService.get('external-bacen-selic-daily');
      }

      let ipcaData = await this.redisCacheService.get('external-bacen-ipca-monthly');
      if (!ipcaData || ipcaData.length === 0) {
        await this.bacenService.cacheIpcaValues();
        ipcaData = await this.redisCacheService.get('external-bacen-ipca-monthly');
      }

      const pointsMap = new Map<string, any>();
      
      if (selicData) {
        selicData.forEach(s => {
          const [y, m, d] = s.data.split('-');
          const date = `${y}-${m}-${d}`;
          // Multiply by 100 to convert from decimal (0.0004) to percentage (0.04)
          pointsMap.set(date, { date, component1: s.valor * 100, component2: null });
        });
      }
      
      if (ipcaData) {
        ipcaData.forEach(i => {
          const [y, m] = i.data.split('-');
          const date = `${y}-${m}-01`;
          if (pointsMap.has(date)) {
            pointsMap.get(date)!.component2 = i.valor * 100;
          } else {
            pointsMap.set(date, { date, component1: null, component2: i.valor * 100 });
          }
        });
      }

      // To make the graph continuous, we will forward-fill IPCA for all daily points
      const dataPoints = Array.from(pointsMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      let lastIpca = null;
      for (const pt of dataPoints) {
        if (pt.component2 !== null) {
          lastIpca = pt.component2;
        } else if (lastIpca !== null) {
          pt.component2 = lastIpca;
        }
        
        pt.total = (pt.component1 || 0) + (pt.component2 || 0);
        pt.value = pt.total;
      }

      return { dataPoints };
    }

    return { dataPoints: [] };
  }

  async getInvestmentTaxesHistory(investmentId: string, userId: string): Promise<InvestmentTaxesHistoryModel> {
    const investment = await this.prismaService.investment.findUnique({
      where: { id: investmentId },
      include: { institutionLink: true },
    });

    const isTreasury = investment?.regimeName === RegimePrisma.SELIC || investment?.regimeName === RegimePrisma.IPCA || investment?.regimeName === RegimePrisma.PREFIXED;
    if (!investment || investment.institutionLink?.userId !== userId || !isTreasury) {
      return { dataPoints: [] };
    }

    // Example investment.type: "Tesouro IPCA+ 2035" -> "Tesouro IPCA+", "2035"
    // Also we need to get the exact maturity date. Fortunately, investment.maturityDate holds the maturity date for Treasury bonds.
    const dueDate = investment.maturityDate;
    if (!dueDate) return { dataPoints: [] };

    // Format dueDate to DD/MM/YYYY safely ignoring local timezone shifts
    const [year, month, day] = dueDate.toISOString().substring(0, 10).split('-');
    const dueDateStr = `${day}/${month}/${year}`;
    
    let prefix = 'Tesouro Selic';
    if (investment.regimeName === RegimePrisma.IPCA) {
      prefix = 'Tesouro IPCA+';
      if (investment.type.includes('Semestral')) prefix = 'Tesouro IPCA+ com Juros Semestrais';
    } else if (investment.regimeName === RegimePrisma.PREFIXED) {
      prefix = 'Tesouro Prefixado';
      if (investment.type.includes('Semestral')) prefix = 'Tesouro Prefixado com Juros Semestrais';
    } else {
      const match = investment.type.match(/(.*?)\s+\d{4}$/);
      if (match) prefix = match[1];
    }

    const history = await this.tesouroTransparenteService.getHistoricalDataForBond(prefix, dueDateStr);
    
    // IPCA or Selic data
    let benchmarkData: BacenCachedValue[] = [];
    if (investment.regimeName === RegimePrisma.IPCA) {
      benchmarkData = (await this.redisCacheService.get('external-bacen-ipca-monthly')) || [];
      if (benchmarkData.length === 0) {
        await this.bacenService.cacheIpcaValues();
        benchmarkData = (await this.redisCacheService.get('external-bacen-ipca-monthly')) || [];
      }
    } else if (investment.regimeName === RegimePrisma.SELIC) {
      benchmarkData = (await this.redisCacheService.get('external-bacen-selic-daily')) || [];
      if (benchmarkData.length === 0) {
        await this.bacenService.cacheSelicValues();
        benchmarkData = (await this.redisCacheService.get('external-bacen-selic-daily')) || [];
      }
    }

    const benchmarkMap = new Map<string, number>();
    if (benchmarkData) {
      benchmarkData.forEach(b => {
      const [y, m, d] = b.data.split('-');
      let key = `${y}-${m}-${d}`;
      if (investment.regimeName === RegimePrisma.IPCA) {
        key = `${y}-${m}`; // month level for IPCA
      }
      // Multiply by 100 to match the percentage scale of Tesouro Transparente (e.g. 6.0)
      benchmarkMap.set(key, b.valor * 100);
      });
    }

    let lastIpca: number | null = null;
    
    if (investment.regimeName === RegimePrisma.IPCA && benchmarkData.length > 0) {
      const startYearMonth = `${investment.startDate.getFullYear()}-${String(investment.startDate.getMonth() + 1).padStart(2, '0')}`;
      let closestIpca = benchmarkData[0].valor * 100;
      for (const b of benchmarkData) {
        const [y, m] = b.data.split('-');
        if (`${y}-${m}` <= startYearMonth) {
          closestIpca = b.valor * 100;
        } else {
          break;
        }
      }
      lastIpca = closestIpca;
    }
    
    const dataPoints = history
      .filter(h => {
        // Only return data points after or on the investment start date
        const [d, m, y] = h.dataBase.split('/');
        return new Date(`${y}-${m}-${d}`) >= investment.startDate;
      })
      .map(h => {
        const [d, m, y] = h.dataBase.split('/');
        const dateStr = `${y}-${m}-${d}`;
        let component1 = h.taxaCompraManha;
        let component2 = null;
        let total = component1;

        if (investment.regimeName === RegimePrisma.IPCA) {
          const monthKey = `${y}-${m}`;
          if (benchmarkMap.has(monthKey)) lastIpca = benchmarkMap.get(monthKey)!;
          component2 = lastIpca;
          total = component1 + component2;
        } else if (investment.regimeName === RegimePrisma.SELIC) {
          component2 = benchmarkMap.get(dateStr) || 0;
          total = component1 + component2;
        }

        return {
          date: dateStr,
          component1,
          component2,
          total
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { dataPoints };
  }
}
