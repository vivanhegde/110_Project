// Import supported denominators and the order type.
import { unlikeDenominators } from "./types";
import type { UnlikeDenominatorOrder } from "./types";

// Import validated order creation.
import {
  createUnlikeDenominatorOrder,
} from "./CreateUnlikeDenominatorOrder";

// Generate a random unlike-denominator order.
export function generateUnlikeDenominatorOrder(
  random: () => number = Math.random, // Injectable random source.
): UnlikeDenominatorOrder {
  // Choose an integer within inclusive limits.
  function randomInteger(min: number, max: number): number {
    const sample = random(); // Random value from zero up to one.

    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
      throw new Error("Invalid random value");
    }

    return min + Math.floor(sample * (max - min + 1));
  }

  // Choose addition or subtraction.
  const operation = randomInteger(0, 1) === 0
    ? "addition"
    : "subtraction";

  // Choose the first denominator.
  const firstDenominator = unlikeDenominators[
    randomInteger(0, unlikeDenominators.length - 1)
  ]!;

  // Exclude the first denominator from the second choice.
  const remainingDenominators = unlikeDenominators.filter(
    value => value !== firstDenominator,
  );

  // Choose a different second denominator.
  const secondDenominator = remainingDenominators[
    randomInteger(0, remainingDenominators.length - 1)
  ]!;

  let firstNumerator: number; // First original numerator.
  let secondNumerator: number; // Second original numerator.

  if (operation === "addition") {
    // Leave room for at least one slice of the second fraction.
    const firstLimit = Math.floor(
      firstDenominator * (secondDenominator - 1) /
      secondDenominator,
    );

    firstNumerator = randomInteger(1, firstLimit);

    // Keep the sum within one whole pizza.
    const secondLimit = Math.floor(
      (firstDenominator - firstNumerator) * secondDenominator /
      firstDenominator,
    );

    secondNumerator = randomInteger(1, secondLimit);
  } else {
    // Start with enough pizza to remove one second-fraction slice.
    const firstMinimum = Math.ceil(
      firstDenominator / secondDenominator,
    );

    firstNumerator = randomInteger(
      firstMinimum,
      firstDenominator,
    );

    // Prevent subtracting more pizza than is available.
    const secondLimit = Math.floor(
      firstNumerator * secondDenominator / firstDenominator,
    );

    secondNumerator = randomInteger(1, secondLimit);
  }

  // Reuse conversion, validation, and answer calculation.
  return createUnlikeDenominatorOrder(
    operation,
    firstNumerator,
    firstDenominator,
    secondNumerator,
    secondDenominator,
  );
}