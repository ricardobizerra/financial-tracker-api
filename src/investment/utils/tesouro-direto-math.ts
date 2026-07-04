import { BacenCachedValue } from '@/external/bacen/bacen.types';
import { Regime } from '@/lib/graphql/prisma-client';
import { TesouroDiretoDataPoint } from '@/external/tesouro-transparente/tesouro-transparente.service';
import Holidays from 'date-holidays';
import {
  eachDayOfInterval,
  isWeekend,
  startOfMonth,
  endOfMonth,
  format,
} from 'date-fns';

function getBusinessDaysInMonth(date: Date, hd: any): number {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = eachDayOfInterval({ start, end });
  let count = 0;
  for (const day of days) {
    if (!isWeekend(day) && !hd.isHoliday(day)) {
      count++;
    }
  }
  return count;
}

export function calculateTesouroTheoreticalValue({
  amount,
  fixedRate,
  regimeName,
  businessDays,
  selicValues,
  ipcaValues,
  startDate,
  maturityDate,
  historicalData,
  targetDate,
}: {
  amount: number;
  fixedRate: number | null;
  regimeName: string;
  businessDays: number;
  selicValues?: BacenCachedValue[];
  ipcaValues?: BacenCachedValue[];
  startDate: Date;
  maturityDate?: Date | null;
  historicalData?: TesouroDiretoDataPoint[];
  targetDate?: Date;
}): {
  marketValue: number;
  theoreticalValue: number;
  currentMarketRate?: number;
} {
  const result: {
    marketValue: number;
    theoreticalValue: number;
    currentMarketRate?: number;
  } = {
    marketValue: amount,
    theoreticalValue: amount,
  };

  if (businessDays <= 0) return result;

  if (historicalData && historicalData.length > 0) {
    const startStr = format(startDate, 'dd/MM/yyyy');
    const endStr = format(targetDate || new Date(), 'dd/MM/yyyy');

    const startPoint =
      historicalData.find((d) => d.dataBase === startStr) || historicalData[0];
    const endPoint =
      historicalData.find((d) => d.dataBase === endStr) ||
      historicalData[historicalData.length - 1];

    if (startPoint && endPoint && startPoint.puBaseManha > 0) {
      const puStart = startPoint.puBaseManha;
      const puEnd = endPoint.puBaseManha;
      result.marketValue = amount * (puEnd / puStart);
      result.currentMarketRate = endPoint.taxaVendaManha;
    }
  }

  // Calculate theoretical curve
  // Tesouro Prefixado
  if (regimeName === Regime.PREFIXED) {
    const rate = fixedRate ? fixedRate / 100 : 0;
    result.theoreticalValue = amount * Math.pow(1 + rate, businessDays / 252);
  }

  // Tesouro Selic (LFT)
  if (regimeName === Regime.SELIC) {
    if (!selicValues || selicValues.length === 0) return result;

    // Find starting index in the cached daily selic values
    const firstDayIndex = selicValues.findIndex((selic) => {
      const selicDate = new Date(selic.data);
      const dateToMatch = new Date(startDate);
      selicDate.setHours(0, 0, 0, 0);
      dateToMatch.setHours(0, 0, 0, 0);
      return selicDate.getTime() >= dateToMatch.getTime();
    });

    if (firstDayIndex !== -1) {
      let currentAmount = amount;
      const endIndex = Math.min(
        firstDayIndex + businessDays,
        selicValues.length,
      );

      for (let i = firstDayIndex; i < endIndex; i++) {
        // selicValues[i].valor is daily rate (e.g. 0.0004 for 0.04%)
        currentAmount *= 1 + selicValues[i].valor;
      }

      // If there is a fixed spread (e.g., Selic + 0.1%), apply it over the period
      if (fixedRate) {
        const spread = fixedRate / 100;
        currentAmount *= Math.pow(1 + spread, businessDays / 252);
      }

      result.theoreticalValue = currentAmount;
    }
  }

  // Tesouro IPCA+ (NTN-B)
  if (regimeName === Regime.IPCA) {
    const rate = fixedRate ? fixedRate / 100 : 0;

    if (!ipcaValues || ipcaValues.length === 0) {
      // Fallback: only apply fixed rate if no IPCA data is available
      result.theoreticalValue = amount * Math.pow(1 + rate, businessDays / 252);
    } else {
      const hd = new Holidays('BR');
      let currentAmount = amount;
      const endDate = targetDate || new Date();

      const days =
        startDate < endDate
          ? eachDayOfInterval({ start: startDate, end: endDate })
          : [];
      const bdaysMap = new Map<string, number>();
      const ipcaMap = new Map<string, number>();

      for (const ipca of ipcaValues) {
        const key = ipca.data.substring(0, 7); // 'YYYY-MM'
        ipcaMap.set(key, ipca.valor);
      }

      let lastKnownIpca = ipcaValues[ipcaValues.length - 1]?.valor || 0;

      for (let i = 1; i < days.length; i++) {
        const day = days[i];
        if (!isWeekend(day) && !hd.isHoliday(day)) {
          const monthKey = format(day, 'yyyy-MM');

          let bdaysInMonth = bdaysMap.get(monthKey);
          if (bdaysInMonth === undefined) {
            bdaysInMonth = getBusinessDaysInMonth(day, hd);
            bdaysMap.set(monthKey, bdaysInMonth);
          }

          let ipcaForMonth = ipcaMap.get(monthKey);
          if (ipcaForMonth === undefined) {
            ipcaForMonth = lastKnownIpca;
          } else {
            lastKnownIpca = ipcaForMonth;
          }

          currentAmount *= Math.pow(1 + ipcaForMonth, 1 / bdaysInMonth);
          currentAmount *= Math.pow(1 + rate, 1 / 252);
        }
      }

      result.theoreticalValue = currentAmount;
    }
  }

  // If market value was not calculated from historical data, fallback to theoretical
  if (result.marketValue === amount && result.theoreticalValue !== amount) {
    result.marketValue = result.theoreticalValue;
  }

  return result;
}
