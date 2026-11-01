// Import the subtraction order type.
import type { SubtractionOrder } from "./types";

// Create and validate a subtraction order.
export function createSubtractionOrder(
  initialNumerator: number,  // Starting slice count.
  subtractNumerator: number, // Slices to take away.
  denominator: number,      // Shared denominator.
): SubtractionOrder {
  // Allow whole-number denominators from 2 to 12.
  if (
    !Number.isInteger(denominator) ||
    denominator < 2 ||
    denominator > 12
  ) {
    throw new Error("Invalid denominator");
  }

  // Keep the starting amount within one whole pizza.
  if (
    !Number.isInteger(initialNumerator) ||
    initialNumerator < 0 ||
    initialNumerator > denominator
  ) {
    throw new Error("Invalid starting amount");
  }

  // Prevent fractional slices and negative results.
  if (
    !Number.isInteger(subtractNumerator) ||
    subtractNumerator < 0 ||
    subtractNumerator > initialNumerator
  ) {
    throw new Error("Invalid subtraction amount");
  }

  // Return the operands and calculated answer.
  return {
    initialNumerator, // Starting slice count.
    subtractNumerator, // Slices to take away.
    denominator, // Shared denominator.
    numerator: initialNumerator - subtractNumerator // Target slice count.
  };
}