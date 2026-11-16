// Import test utilities.
import { describe, it, expect } from "vitest";

// Import random order generation.
import {
  generateUnlikeDenominatorOrder,
} from "../src/features/pizza/GenerateUnlikeDenominatorOrder";

// Import supported denominators.
import { unlikeDenominators } from "../src/features/pizza/types";

// List every valid distinct pair and its least common denominator.
const pairs = [
  [2, 3, 6], [2, 4, 4], [2, 5, 10], [2, 6, 6],
  [2, 8, 8], [2, 10, 10], [2, 12, 12],
  [3, 4, 12], [3, 6, 6], [3, 9, 9], [3, 12, 12],
  [4, 6, 12], [4, 8, 8], [4, 12, 12],
  [5, 10, 10], [6, 12, 12],
].flatMap(([first, second, common]) => [
  [first, second, common], [second, first, common],
]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); // Both operand orders.

// Select an expected pair through the injected random source.
function pairSample(first: number, second: number): number {
  const index = pairs.findIndex(([a, b]) => a === first && b === second); // Pair position.
  if (index < 0) throw new Error("Missing expected pair");
  return (index + 0.5) / pairs.length;
}

// Supply predictable random values.
function fixedRandom(values: number[]): () => number {
  let index = 0; // Next sample position.

  return () => {
    const value = values[index++]; // Current random sample.

    if (value === undefined) {
      throw new Error("Missing test random value");
    }

    return value;
  };
}

// Test random unlike-denominator orders.
describe("generateUnlikeDenominatorOrder", () => {
  // Cover the lowest random values.
  it("generates 1/2 + 1/3 with minimum samples", () => {
    const order = generateUnlikeDenominatorOrder(() => 0);

    expect(order).toEqual({
      operation: "addition",
      firstNumerator: 1,
      firstDenominator: 2,
      secondNumerator: 1,
      secondDenominator: 3,
      commonDenominator: 6,
      convertedFirstNumerator: 3,
      convertedSecondNumerator: 2,
      resultNumerator: 5,
    });
  });

  // Cover values close to the upper random limit.
  it("allows a zero subtraction result with maximum samples", () => {
    const order = generateUnlikeDenominatorOrder(() => 0.999999);

    expect(order.operation).toBe("subtraction");
    expect(order.firstDenominator).toBe(12);
    expect(order.secondDenominator).toBe(6);
    expect(order.firstNumerator).toBe(12);
    expect(order.secondNumerator).toBe(6);
    expect(order.commonDenominator).toBe(12);
    expect(order.resultNumerator).toBe(0);
  });

  // Check addition near the one-pizza limit.
  it("generates 3/4 + 1/6 with an answer of 11/12", () => {
    const random = fixedRandom([0, pairSample(4, 6), 0.99, 0.99]);
    const order = generateUnlikeDenominatorOrder(random);

    expect(order.operation).toBe("addition");
    expect(order.firstNumerator).toBe(3);
    expect(order.firstDenominator).toBe(4);
    expect(order.secondNumerator).toBe(1);
    expect(order.secondDenominator).toBe(6);
    expect(order.commonDenominator).toBe(12);
    expect(order.resultNumerator).toBe(11);
  });

  // Check subtraction with mixed random samples.
  it("generates 3/4 - 2/6 with an answer of 5/12", () => {
    const random = fixedRandom([0.75, pairSample(4, 6), 0.5, 0.25]);
    const order = generateUnlikeDenominatorOrder(random);

    expect(order.operation).toBe("subtraction");
    expect(order.firstNumerator).toBe(3);
    expect(order.firstDenominator).toBe(4);
    expect(order.secondNumerator).toBe(2);
    expect(order.secondDenominator).toBe(6);
    expect(order.commonDenominator).toBe(12);
    expect(order.resultNumerator).toBe(5);
  });

  // Cover every valid pair and numerator-selection boundaries in both operations.
  it("generates all 32 ordered pairs without exceeding twelve slices or one pizza", () => {
    expect(pairs).toHaveLength(32);
    for (const operationSample of [0, 0.75]) {
      for (const [first, second, common] of pairs) {
        for (const firstSample of [0, 0.5, 0.999999]) {
          for (const secondSample of [0, 0.5, 0.999999]) {
            const random = fixedRandom([
              operationSample, pairSample(first, second), firstSample, secondSample,
            ]); // Deterministic pair and numerator choices.
            const order = generateUnlikeDenominatorOrder(random); // Valid generated question.

            expect(order.operation).toBe(operationSample === 0 ? "addition" : "subtraction");
            expect(order.firstDenominator).toBe(first);
            expect(order.secondDenominator).toBe(second);
            expect(order.commonDenominator).toBe(common);
            expect(unlikeDenominators).toContain(order.firstDenominator);
            expect(unlikeDenominators).toContain(order.secondDenominator);
            expect(order.commonDenominator).toBeLessThanOrEqual(12);
            expect(order.firstNumerator).toBeGreaterThan(0);
            expect(order.firstNumerator).toBeLessThanOrEqual(first);
            expect(order.secondNumerator).toBeGreaterThan(0);
            expect(order.secondNumerator).toBeLessThanOrEqual(second);
            expect(Number.isInteger(order.convertedFirstNumerator)).toBe(true);
            expect(Number.isInteger(order.convertedSecondNumerator)).toBe(true);
            expect(order.convertedFirstNumerator * first).toBe(order.firstNumerator * common);
            expect(order.convertedSecondNumerator * second).toBe(order.secondNumerator * common);
            expect(order.resultNumerator).toBe(operationSample === 0
              ? order.convertedFirstNumerator + order.convertedSecondNumerator
              : order.convertedFirstNumerator - order.convertedSecondNumerator);
            expect(order.resultNumerator).toBeGreaterThanOrEqual(0);
            expect(order.resultNumerator).toBeLessThanOrEqual(common);
          }
        }
      }
    }
  });

  // Reject samples outside the random source contract.
  it.each([-0.1, 1, NaN, Infinity])(
    "rejects an invalid random value: %s",
    value => {
      expect(() => generateUnlikeDenominatorOrder(() => value))
        .toThrow("Invalid random value");
    },
  );

  // Validate later samples as well as the first one.
  it("rejects an invalid sample during numerator selection", () => {
    const random = fixedRandom([0, 0, 0, 1]);

    expect(() => generateUnlikeDenominatorOrder(random))
      .toThrow("Invalid random value");
  });
});
