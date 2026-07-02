import { BacenCachedValue } from '@/external/bacen/bacen.types';
import { Regime } from '@/lib/graphql/prisma-client';

export function calculateTesouroTheoreticalValue({
  amount,
  fixedRate,
  regimeName,
  businessDays,
  selicValues,
  startDate,
}: {
  amount: number;
  fixedRate: number | null;
  regimeName: string;
  businessDays: number;
  selicValues?: BacenCachedValue[];
  startDate: Date;
}): number {
  if (businessDays <= 0) return amount;

  // Tesouro Prefixado
  if (regimeName === Regime.PREFIXED) {
    const rate = fixedRate ? fixedRate / 100 : 0;
    return amount * Math.pow(1 + rate, businessDays / 252);
  }

  // Tesouro Selic (LFT)
  if (regimeName === Regime.SELIC) {
    if (!selicValues || selicValues.length === 0) return amount;
    
    // Find starting index in the cached daily selic values
    const firstDayIndex = selicValues.findIndex((selic) => {
      const selicDate = new Date(selic.data);
      const dateToMatch = new Date(startDate);
      selicDate.setHours(0, 0, 0, 0);
      dateToMatch.setHours(0, 0, 0, 0);
      return selicDate.getTime() >= dateToMatch.getTime();
    });

    if (firstDayIndex === -1) return amount;

    let currentAmount = amount;
    const endIndex = Math.min(firstDayIndex + businessDays, selicValues.length);

    for (let i = firstDayIndex; i < endIndex; i++) {
      // selicValues[i].valor is daily rate (e.g. 0.0004 for 0.04%)
      currentAmount *= (1 + selicValues[i].valor);
    }
    
    // If there is a fixed spread (e.g., Selic + 0.1%), apply it over the period
    if (fixedRate) {
      const spread = fixedRate / 100;
      currentAmount *= Math.pow(1 + spread, businessDays / 252);
    }
    
    return currentAmount;
  }

  // Tesouro IPCA+ (NTN-B)
  if (regimeName === Regime.IPCA) {
    // For a pure theoretical curve without VNA history, we approximate using the fixed rate.
    // Real IPCA curve requires the daily IPCA projection (VNA). 
    // If we don't have historical VNA, we can at least apply the fixed rate part.
    // In a real scenario, this would multiply by (VNA_current / VNA_start).
    // For now, we apply the fixed rate over the business days.
    const rate = fixedRate ? fixedRate / 100 : 0;
    return amount * Math.pow(1 + rate, businessDays / 252);
  }

  return amount;
}
