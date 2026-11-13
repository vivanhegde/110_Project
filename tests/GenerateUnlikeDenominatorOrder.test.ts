// Import test utilities.
import { describe, it, expect } from "vitest";

// Import random order generation.
import {
  generateUnlikeDenominatorOrder,
} from "../src/features/pizza/GenerateUnlikeDenominatorOrder";

// Import supported denominators.
import { unlikeDenominators } from "../src/features/pizza/types";

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
    const random = fixedRandom([0, 0.4, 0.6, 0.99, 0.99]);
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
    const random = fixedRandom([0.75, 0.4, 0.6, 0.5, 0.25]);
    const order = generateUnlikeDenominatorOrder(random);

    expect(order.operation).toBe("subtraction");
    expect(order.firstNumerator).toBe(3);
    expect(order.firstDenominator).toBe(4);
    expect(order.secondNumerator).toBe(2);
    expect(order.secondDenominator).toBe(6);
    expect(order.commonDenominator).toBe(12);
    expect(order.resultNumerator).toBe(5);
  });

  // Check both operations across every denominator choice.
  it("keeps all denominator pairs within the supported range", () => {
    for (const operationSample of [0, 0.75]) {
      for (let firstIndex = 0; firstIndex < 5; firstIndex++) {
        for (let secondIndex = 0; secondIndex < 4; secondIndex++) {
          // Select each denominator pair with middle numerator samples.
          const random = fixedRandom([
            operationSample,
            (firstIndex + 0.5) / 5,
            (secondIndex + 0.5) / 4,
            0.5,
            0.5,
          ]);

          const order = generateUnlikeDenominatorOrder(random);

          expect(order.operation).toBe(
            operationSample === 0 ? "addition" : "subtraction",
          );

          expect(order.firstDenominator).toBe(
            unlikeDenominators[firstIndex],
          );
          expect(unlikeDenominators).toContain(order.secondDenominator);
          expect(order.firstDenominator).not.toBe(order.secondDenominator);

          expect(order.firstNumerator).toBeGreaterThan(0);
          expect(order.firstNumerator).toBeLessThanOrEqual(
            order.firstDenominator,
          );
          expect(order.secondNumerator).toBeGreaterThan(0);
          expect(order.secondNumerator).toBeLessThanOrEqual(
            order.secondDenominator,
          );

          expect(unlikeDenominators).toContain(order.commonDenominator);
          expect(order.resultNumerator).toBeGreaterThanOrEqual(0);
          expect(order.resultNumerator).toBeLessThanOrEqual(
            order.commonDenominator,
          );
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
    const random = fixedRandom([0, 0, 0, 0, 1]);

    expect(() => generateUnlikeDenominatorOrder(random))
      .toThrow("Invalid random value");
  });
});