// Import test utilities and random order generation.
import { describe, it, expect, vi } from "vitest";
import { generateSubtractionOrder } from "../src/features/pizza/GenerateSubtractionOrder";

// Verify random bounds and subtraction invariants deterministically.
describe("generateSubtractionOrder", () => {
  // Include the smallest denominator and a zero result.
  it("supports the minimum random values", () => {
    const order = generateSubtractionOrder(() => 0); // Choose every lower bound.
    expect(order).toEqual({
      denominator: 2, // Smallest denominator.
      initialNumerator: 1, // At least one starting slice.
      subtractNumerator: 1, // At least one slice to remove.
      numerator: 0, // All starting slices removed.
    });
  });

  // Include the largest denominator without exceeding a whole pizza.
  it("supports the maximum random values", () => {
    const order = generateSubtractionOrder(() => 0.999999); // Choose every upper bound.
    expect(order).toEqual({
      denominator: 12, // Largest denominator.
      initialNumerator: 12, // One whole pizza.
      subtractNumerator: 12, // Remove the whole pizza.
      numerator: 0, // Valid zero result.
    });
  });

  // Use independent random draws for both operands and the denominator.
  it("calculates the target from the generated operands", () => {
    const random = vi.fn() // Predictable random draws.
      .mockReturnValueOnce(0.6)
      .mockReturnValueOnce(0.6)
      .mockReturnValueOnce(0.3);
    expect(generateSubtractionOrder(random)).toEqual({
      denominator: 8, // Shared denominator.
      initialNumerator: 5, // Starting amount.
      subtractNumerator: 2, // Removed amount.
      numerator: 3, // Correct remainder.
    });
    expect(random).toHaveBeenCalledTimes(3);
  });

  // Cover every denominator allowed by US4.
  it.each([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])(
    "generates valid operands for denominator %i",
    (denominator) => {
      const random = vi.fn() // Pick the middle of the denominator's random interval.
        .mockReturnValueOnce((denominator - 2 + 0.5) / 11)
        .mockReturnValueOnce(0.75)
        .mockReturnValueOnce(0.5);
      const order = generateSubtractionOrder(random); // Generated practice order.
      expect(order.denominator).toBe(denominator);
      expect(Number.isInteger(order.initialNumerator)).toBe(true);
      expect(Number.isInteger(order.subtractNumerator)).toBe(true);
      expect(order.initialNumerator).toBeGreaterThanOrEqual(1);
      expect(order.initialNumerator).toBeLessThanOrEqual(denominator);
      expect(order.subtractNumerator).toBeGreaterThanOrEqual(1);
      expect(order.subtractNumerator).toBeLessThanOrEqual(order.initialNumerator);
      expect(order.numerator).toBe(order.initialNumerator - order.subtractNumerator);
    },
  );

  // Reject invalid custom random sources instead of creating invalid questions.
  it.each([-0.1, 1, NaN, Infinity])("rejects invalid random value %s", (sample) => {
    expect(() => generateSubtractionOrder(() => sample)).toThrow("Invalid random value");
  });
});
