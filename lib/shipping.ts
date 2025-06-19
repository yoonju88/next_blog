export function calculateShippingFee(totalWeight: number): number {
    if (totalWeight <= 500) return 5;
    if (totalWeight <= 1000) return 8;
    if (totalWeight <= 2000) return 12;
    return 15 + Math.ceil((totalWeight - 2000) / 1000) * 3;
  }