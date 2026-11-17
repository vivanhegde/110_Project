/**
 * Creates and validates unlike-denominator addition and subtraction orders.
 * Checks the operation, original fractions, and supported denominators.
 * Converts both fractions to their least common denominator and calculates
 * an answer between zero and one whole pizza. Returns the original question,
 * converted values, and correct answer for other game modules.
 */

// Import order and denominator types.
import type {
  UnlikeDenominator,
  UnlikeDenominatorOrder,
} from "./types";

// Import shared conversion functions.
import {
  getCommonDenominator,
  convertNumerator,
} from "./FractionConversion";

// Create and validate an unlike-denominator order.
export function createUnlikeDenominatorOrder(
  operation: UnlikeDenominatorOrder["operation"], // Addition or subtraction.
  firstNumerator: number, // First original numerator.
  firstDenominator: UnlikeDenominator, // First original denominator.
  secondNumerator: number, // Second original numerator.
  secondDenominator: UnlikeDenominator, // Second original denominator.
): UnlikeDenominatorOrder {
  // Validate the operation at runtime.
  if (operation !== "addition" && operation !== "subtraction") {
    throw new Error("Invalid operation");
  }

  // Validate denominators and find their least common multiple.
  const commonDenominator = getCommonDenominator(
    firstDenominator,
    secondDenominator,
  );

  // Require different original denominators.
  if (firstDenominator === secondDenominator) {
    throw new Error("Denominators must be different");
  }

  // Keep the first fraction within one whole pizza.
  if (
    !Number.isInteger(firstNumerator) ||
    firstNumerator < 0 ||
    firstNumerator > firstDenominator
  ) {
    throw new Error("Invalid first fraction");
  }

  // Keep the second fraction within one whole pizza.
  if (
    !Number.isInteger(secondNumerator) ||
    secondNumerator < 0 ||
    secondNumerator > secondDenominator
  ) {
    throw new Error("Invalid second fraction");
  }

  // Convert both fractions to the common denominator.
  const convertedFirstNumerator = convertNumerator(
    firstNumerator,
    firstDenominator,
    commonDenominator,
  );
  const convertedSecondNumerator = convertNumerator(
    secondNumerator,
    secondDenominator,
    commonDenominator,
  );

  // Calculate the answer using equal-sized slices.
  const resultNumerator = operation === "addition"
    ? convertedFirstNumerator + convertedSecondNumerator
    : convertedFirstNumerator - convertedSecondNumerator;

  // Prevent negative results and amounts above one whole pizza.
  if (resultNumerator < 0 || resultNumerator > commonDenominator) {
    throw new Error("Result must be between zero and one");
  }

  // Return the original question, converted values, and answer.
  return {
    operation,
    firstNumerator,
    firstDenominator,
    secondNumerator,
    secondDenominator,
    commonDenominator,
    convertedFirstNumerator,
    convertedSecondNumerator,
    resultNumerator,
  };
}
