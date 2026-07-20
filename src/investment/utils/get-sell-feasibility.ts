import { InvestmentType } from '@prisma/client';
import { SellFeasibility, SellFeasibilityStatus } from '../investment.model';

export function getSellFeasibility(
  type: string,
  marketValue: number,
  theoreticalValue: number,
): SellFeasibility {
  if (type !== 'TREASURY') {
    return {
      status: SellFeasibilityStatus.NOT_APPLICABLE,
      message: 'Não aplicável para este tipo de investimento.',
    };
  }

  // Allow a small margin (0.5%) to avoid noise
  if (marketValue > theoreticalValue * 1.005) {
    return {
      status: SellFeasibilityStatus.FAVORABLE,
      message:
        'Marcação a mercado favorável: O valor atual está superior à curva teórica. Boa oportunidade de venda.',
    };
  } else if (marketValue < theoreticalValue * 0.995) {
    return {
      status: SellFeasibilityStatus.UNFAVORABLE,
      message:
        'Marcação a mercado desfavorável: O valor atual está inferior à curva teórica. Melhor aguardar.',
    };
  }

  return {
    status: SellFeasibilityStatus.NEUTRAL,
    message:
      'Marcação a mercado neutra: O valor atual acompanha a curva teórica.',
  };
}
