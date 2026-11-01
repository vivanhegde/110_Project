// Import validated order creation and its return type.
import { createSubtractionOrder } from "./CreateSubtractionOrder";
import type { SubtractionOrder } from "./types";

// Generate a valid same-denominator subtraction order.
export function generateSubtractionOrder(
  random: () => number = Math.random, // Injectable source for predictable tests.
): SubtractionOrder {
  // Choose a whole number within the inclusive limits.
  function randomInteger(min: number, max: number): number {
    const sample = random(); // Random value from zero up to, but not including, one.
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
      throw new Error("Invalid random value");
    }
    return min + Math.floor(sample * (max - min + 1));
  }

  const denominator = randomInteger(2, 12); // Shared denominator.
  const initialNumerator = randomInteger(1, denominator); // Available starting slices.
  const subtractNumerator = randomInteger(1, initialNumerator); // Nonzero amount to remove.

  // Reuse existing validation and target calculation.
  return createSubtractionOrder(initialNumerator, subtractNumerator, denominator);
}
