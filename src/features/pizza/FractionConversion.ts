/**
 * Provides fraction conversion for US11 orders.
 * Finds the least common denominator among the supported values and scales
 * numerators without changing the fractions' values. Validates denominators,
 * numerators, and conversion targets before performing the calculation.
 */

// Import supported values and their type.
import { unlikeDenominators as denominators } from "./types";
import type { UnlikeDenominator } from "./types";

// Validate a denominator at runtime.
function validateDenominator(value: UnlikeDenominator): void {
  if (!denominators.includes(value)) {
    throw new Error("Unsupported denominator");
  }
}

// Find the smallest supported common denominator.
export function getCommonDenominator(
  firstDenominator: UnlikeDenominator,
  secondDenominator: UnlikeDenominator,
): UnlikeDenominator {
  validateDenominator(firstDenominator);
  validateDenominator(secondDenominator);

  // Find the first value divisible by both denominators.
  const common = denominators.find(
    value =>
      value % firstDenominator === 0 &&
      value % secondDenominator === 0,
  );

  if (common === undefined) {
    throw new Error("No supported common denominator");
  }

  return common;
}

// Convert a numerator without changing the fraction's value.
export function convertNumerator(
  numerator: number,
  denominator: UnlikeDenominator,
  commonDenominator: UnlikeDenominator,
): number {
  validateDenominator(denominator);
  validateDenominator(commonDenominator);

  // Require a nonnegative whole-number numerator.
  if (!Number.isInteger(numerator) || numerator < 0) {
    throw new Error("Invalid numerator");
  }

  // Require the target denominator to be a multiple.
  if (commonDenominator % denominator !== 0) {
    throw new Error("Incompatible common denominator");
  }

  return numerator * (commonDenominator / denominator);
}
