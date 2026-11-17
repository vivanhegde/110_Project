import type { DivisionOrder } from "./types";

export function generateDivisionOrders(): DivisionOrder[] {
  const denominators = [2, 3, 4, 6];
  return denominators.map((denominator) => ({
    food: "pizza",
    totalNumerator: 1 + Math.floor(Math.random() * 2),
    totalDenominator: 1,
    portionNumerator: 1,
    portionDenominator: denominator,
  })).concat([
    { food: "pizza", totalNumerator: 3, totalDenominator: 4, portionNumerator: 1, portionDenominator: 4 },
    { food: "pizza", totalNumerator: 2, totalDenominator: 3, portionNumerator: 1, portionDenominator: 6 },
  ]);
}
