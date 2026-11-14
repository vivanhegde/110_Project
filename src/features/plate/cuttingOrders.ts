import type { CuttingOrder } from "../pizza/types";

// Test level for cutting: show each fraction using the target denominator.
export const CUTTING_ORDERS: CuttingOrder[] = [
    { numerator: 3, denominator: 4, targetDenominator: 8 },
    { numerator: 1, denominator: 2, targetDenominator: 6 },
    { numerator: 2, denominator: 3, targetDenominator: 12 },
];