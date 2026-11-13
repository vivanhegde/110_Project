// Import test utilities.
import { describe, it, expect } from "vitest";

// Import order creation.
import {
  createUnlikeDenominatorOrder,
} from "../src/features/pizza/CreateUnlikeDenominatorOrder";

// Import order and denominator types.
import type {
  UnlikeDenominator,
  UnlikeDenominatorOrder,
} from "../src/features/pizza/types";

// Test unlike-denominator order creation.
describe("createUnlikeDenominatorOrder", () => {
  // Preserve the original question and converted values.
  it("creates 1/3 + 1/4 with an answer of 7/12", () => {
    const order = createUnlikeDenominatorOrder(
      "addition", 1, 3, 1, 4,
    );

    expect(order).toEqual({
      operation: "addition",
      firstNumerator: 1,
      firstDenominator: 3,
      secondNumerator: 1,
      secondDenominator: 4,
      commonDenominator: 12,
      convertedFirstNumerator: 4,
      convertedSecondNumerator: 3,
      resultNumerator: 7,
    });
  });

  // Subtract converted numerators.
  it("creates 3/4 - 1/6 with an answer of 7/12", () => {
    const order = createUnlikeDenominatorOrder(
      "subtraction", 3, 4, 1, 6,
    );

    expect(order.commonDenominator).toBe(12);
    expect(order.convertedFirstNumerator).toBe(9);
    expect(order.convertedSecondNumerator).toBe(2);
    expect(order.resultNumerator).toBe(7);
  });

  // Use the least common denominator instead of always using 12.
  it("uses sixths for 1/2 + 1/6", () => {
    const order = createUnlikeDenominatorOrder(
      "addition", 1, 2, 1, 6,
    );

    expect(order.commonDenominator).toBe(6);
    expect(order.convertedFirstNumerator).toBe(3);
    expect(order.convertedSecondNumerator).toBe(1);
    expect(order.resultNumerator).toBe(4);
  });

  // Equal fraction values can produce zero.
  it("allows a zero result", () => {
    const order = createUnlikeDenominatorOrder(
      "subtraction", 1, 2, 2, 4,
    );

    expect(order.resultNumerator).toBe(0);
  });

  // Zero is a valid starting amount.
  it("allows a zero numerator", () => {
    const order = createUnlikeDenominatorOrder(
      "addition", 0, 3, 1, 4,
    );

    expect(order.convertedFirstNumerator).toBe(0);
    expect(order.resultNumerator).toBe(3);
    expect(order.commonDenominator).toBe(12);
  });

  // Accept exactly one whole pizza.
  it("allows a result of one whole pizza", () => {
    const order = createUnlikeDenominatorOrder(
      "addition", 1, 2, 2, 4,
    );

    expect(order.resultNumerator).toBe(order.commonDenominator);
  });

  // Unlike-denominator orders require different denominators.
  it("rejects matching denominators", () => {
    expect(() =>
      createUnlikeDenominatorOrder("addition", 1, 4, 2, 4),
    ).toThrow("Denominators must be different");
  });

  // Validate both original denominators at runtime.
  it("rejects unsupported denominators", () => {
    const invalid = 5 as UnlikeDenominator; // Invalid runtime input.

    expect(() =>
      createUnlikeDenominatorOrder("addition", 1, invalid, 1, 4),
    ).toThrow("Unsupported denominator");

    expect(() =>
      createUnlikeDenominatorOrder("addition", 1, 3, 1, invalid),
    ).toThrow("Unsupported denominator");
  });

  // Reject invalid first fractions.
  it.each([-1, 0.5, 4, NaN, Infinity])(
    "rejects an invalid first numerator: %s",
    numerator => {
      expect(() =>
        createUnlikeDenominatorOrder("addition", numerator, 3, 1, 4),
      ).toThrow("Invalid first fraction");
    },
  );

  // Reject invalid second fractions.
  it.each([-1, 0.5, 5, NaN, Infinity])(
    "rejects an invalid second numerator: %s",
    numerator => {
      expect(() =>
        createUnlikeDenominatorOrder("addition", 1, 3, numerator, 4),
      ).toThrow("Invalid second fraction");
    },
  );

  // Prevent negative subtraction results.
  it("rejects a negative result", () => {
    expect(() =>
      createUnlikeDenominatorOrder("subtraction", 1, 3, 1, 2),
    ).toThrow("Result must be between zero and one");
  });

  // Keep the answer within one pizza.
  it("rejects a result above one whole pizza", () => {
    expect(() =>
      createUnlikeDenominatorOrder("addition", 3, 4, 1, 2),
    ).toThrow("Result must be between zero and one");
  });

  // Bypass the type check to verify runtime validation.
  it("rejects unsupported operations", () => {
    const invalid = "multiplication" as
      UnlikeDenominatorOrder["operation"]; // Invalid runtime input.

    expect(() =>
      createUnlikeDenominatorOrder(invalid, 1, 3, 1, 4),
    ).toThrow("Invalid operation");
  });
});