import { BacenCachedValue } from '@/external/bacen/bacen.types';
import { Regime } from '@/lib/graphql/prisma-client';
import { TesouroDiretoDataPoint } from '@/external/tesouro-transparente/tesouro-transparente.service';
import { format } from 'date-fns';

export function calculateTesouroTheoreticalValue({
  amount,
  fixedRate,
  regimeName,
  businessDays,
  selicValues,
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
    // For a pure theoretical curve without VNA history, we approximate using the fixed rate.
    // Real IPCA curve requires the daily IPCA projection (VNA).
    // If we don't have historical VNA, we can at least apply the fixed rate part.
    // In a real scenario, this would multiply by (VNA_current / VNA_start).
    // For now, we apply the fixed rate over the business days.
    const rate = fixedRate ? fixedRate / 100 : 0;
    result.theoreticalValue = amount * Math.pow(1 + rate, businessDays / 252);
  }

  // If market value was not calculated from historical data, fallback to theoretical
  if (result.marketValue === amount && result.theoreticalValue !== amount) {
    result.marketValue = result.theoreticalValue;
  }

  return result;
}
