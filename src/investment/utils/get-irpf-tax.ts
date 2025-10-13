export function getIrpfTax(investmentDays: number): number {
  if (investmentDays <= 180) {
    return 22.5;
  }

  if (investmentDays <= 360) {
    return 20;
  }

  if (investmentDays <= 720) {
    return 17.5;
  }

  return 15;
}
