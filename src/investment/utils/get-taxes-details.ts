import { differenceInDays } from 'date-fns';
import { Regime } from '@/lib/graphql/prisma-client';
import { getIofTax } from './get-iof-tax';

export function getTaxesAndFeesDetails(
  investment: any,
  amounts: {
    irpfAmount: number;
    iofAmount: number;
    b3CustodyFeeAmount: number;
    brokerageFeeAmount: number;
  },
  profit: number,
) {
  const details = [];
  const daysHeld = differenceInDays(new Date(), new Date(investment.startDate));
  const exemptRegimes = [Regime.POUPANCA];

  // IRPF
  if (!exemptRegimes.includes(investment.regimeName as Regime)) {
    if (profit > 0) {
      let irpfReason = '';
      if (daysHeld <= 180) {
        irpfReason = `Alíquota de 22,50% sobre o lucro (Até 180 dias. Atual: ${daysHeld} dias)`;
      } else if (daysHeld <= 360) {
        irpfReason = `Alíquota de 20,00% sobre o lucro (De 181 a 360 dias. Atual: ${daysHeld} dias)`;
      } else if (daysHeld <= 720) {
        irpfReason = `Alíquota de 17,50% sobre o lucro (De 361 a 720 dias. Atual: ${daysHeld} dias)`;
      } else {
        irpfReason = `Alíquota de 15,00% sobre o lucro (Mais de 720 dias. Atual: ${daysHeld} dias)`;
      }

      details.push({
        label: 'IRPF',
        amount: amounts.irpfAmount,
        reason: irpfReason,
      });
    } else {
      details.push({
        label: 'IRPF',
        amount: 0,
        reason: 'Isento (Sem rentabilidade no período)',
      });
    }
  }

  // IOF
  const iofRate = getIofTax(daysHeld) * 100;
  details.push({
    label: 'IOF',
    amount: amounts.iofAmount,
    reason:
      iofRate > 0
        ? `Tabela Regressiva: ${iofRate.toFixed(2).replace('.', ',')}% (Atual: ${daysHeld} dias)`
        : 'Isento (Mais de 29 dias)',
  });

  // B3 Custody
  if (investment.type === 'TREASURY') {
    details.push({
      label: 'Taxa B3',
      amount: amounts.b3CustodyFeeAmount,
      reason: 'Cobrança de 0,20% a.a. sobre o montante',
    });
  }

  // Brokerage
  const brokerageFee = Number(investment.brokerageFee || 0);
  if (brokerageFee > 0) {
    details.push({
      label: 'Corretagem',
      amount: amounts.brokerageFeeAmount,
      reason: `Taxa da corretora (${brokerageFee.toFixed(2).replace('.', ',')}% a.a.)`,
    });
  }

  const totalTaxesAndFees =
    amounts.irpfAmount +
    amounts.iofAmount +
    amounts.b3CustodyFeeAmount +
    amounts.brokerageFeeAmount;

  return {
    details,
    totalTaxesAndFees,
  };
}
