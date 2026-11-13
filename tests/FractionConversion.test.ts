// Import test utilities.
import { describe, it, expect } from "vitest";

// Import fraction conversion functions.
import {
  getCommonDenominator,
  convertNumerator,
} from "../src/features/pizza/FractionConversion";

// Import the supported denominator type.
import type { UnlikeDenominator } from "../src/features/pizza/types";

// Test common-denominator calculation.
describe("getCommonDenominator", () => {
  // Cover all distinct supported denominator pairs.
  const cases: [
    UnlikeDenominator,
    UnlikeDenominator,
    UnlikeDenominator,
  ][] = [
    [2, 3, 6],
    [2, 4, 4],
    [2, 6, 6],
    [2, 12, 12],
    [3, 4, 12],
    [3, 6, 6],
    [3, 12, 12],
    [4, 6, 12],
    [4, 12, 12],
    [6, 12, 12],
  ];

  // Check both input orders.
  it.each(cases)(
    "finds %i and %i's least common denominator: %i",
    (first, second, expected) => {
      expect(getCommonDenominator(first, second)).toBe(expected);
      expect(getCommonDenominator(second, first)).toBe(expected);
    },
  );

  // The conversion utility also accepts matching denominators.
  it("keeps matching denominators unchanged", () => {
    expect(getCommonDenominator(6, 6)).toBe(6);
  });

  // Bypass the type check to test runtime validation.
  it("rejects unsupported denominators", () => {
    const invalid = 5 as UnlikeDenominator; // Invalid runtime input.

    expect(() => getCommonDenominator(invalid, 4))
      .toThrow("Unsupported denominator");
    expect(() => getCommonDenominator(4, invalid))
      .toThrow("Unsupported denominator");
  });
});

// Test equivalent-fraction conversion.
describe("convertNumerator", () => {
  // Check conversion to twelfths.
  it("preserves the value of converted fractions", () => {
    expect(convertNumerator(1, 2, 12)).toBe(6);
    expect(convertNumerator(1, 3, 12)).toBe(4);
    expect(convertNumerator(1, 4, 12)).toBe(3);
    expect(convertNumerator(1, 6, 12)).toBe(2);
    expect(convertNumerator(5, 12, 12)).toBe(5);
  });

  // Cover zero and one whole pizza.
  it("supports zero and whole fractions", () => {
    expect(convertNumerator(0, 3, 12)).toBe(0);
    expect(convertNumerator(3, 3, 12)).toBe(12);
  });

  // Preserve an already matching denominator.
  it("keeps the numerator when no conversion is needed", () => {
    expect(convertNumerator(3, 4, 4)).toBe(3);
  });

  // Reject invalid slice counts.
  it.each([-1, 0.5, NaN, Infinity])(
    "rejects an invalid numerator: %s",
    numerator => {
      expect(() => convertNumerator(numerator, 3, 12))
        .toThrow("Invalid numerator");
    },
  );

  // The target must be divisible by the original denominator.
  it("rejects incompatible target denominators", () => {
    expect(() => convertNumerator(1, 4, 6))
      .toThrow("Incompatible common denominator");
    expect(() => convertNumerator(1, 12, 6))
      .toThrow("Incompatible common denominator");
  });

  // Validate both original and target denominators.
  it("rejects unsupported denominators", () => {
    const invalid = 5 as UnlikeDenominator; // Invalid runtime input.

    expect(() => convertNumerator(1, invalid, 12))
      .toThrow("Unsupported denominator");
    expect(() => convertNumerator(1, 3, invalid))
      .toThrow("Unsupported denominator");
  });
});