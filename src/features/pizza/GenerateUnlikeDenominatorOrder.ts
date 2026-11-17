/**
 * Generates random unlike-denominator addition and subtraction orders.
 * Selects different denominators from two to twelve, using only pairs whose
 * least common denominator is at most twelve. Chooses positive numerators
 * while keeping the result between zero and one whole pizza. Uses shared order
 * creation to convert and validate the question, and accepts an injected
 * random source for predictable tests.
 */

// Import supported denominators and the order type.
import { unlikeDenominators } from "./types";
import type { UnlikeDenominatorOrder } from "./types";

// Import validated order creation.
import {
  createUnlikeDenominatorOrder,
} from "./CreateUnlikeDenominatorOrder";

// Prepare every ordered pair that fits within twelve equal slices.
const denominatorPairs = unlikeDenominators.flatMap(first =>
  unlikeDenominators
    .filter(second => second !== first && unlikeDenominators.some(
      common => common % first === 0 && common % second === 0,
    ))
    .map(second => [first, second] as const),
);

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

  // Select a valid pair directly without retrying rejected combinations.
  const [firstDenominator, secondDenominator] = denominatorPairs[
    randomInteger(0, denominatorPairs.length - 1)
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
