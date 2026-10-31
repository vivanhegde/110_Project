// Import test utilities.
import { describe, it, expect } from "vitest";

// Import the order creation function.
import { createSubtractionOrder } from "../src/features/pizza/createSubtractionOrder";

// Test subtraction order creation.
describe("createSubtractionOrder", () => {
  // Check the operands and calculated answer.
  it("should create 5/8 - 2/8 with an answer of 3/8", () => {
    const order = createSubtractionOrder(5, 2, 8); // Create a sample order.

    expect(order).toEqual({
      initialNumerator: 5,  // Starting slice count.
      subtractNumerator: 2, // Slices to take away.
      denominator: 8,      // Shared denominator.
      numerator: 3,        // Target slice count.
    });
  });

  // Allow a zero result.
  it("should allow equal operands", () => {
    const order = createSubtractionOrder(5, 5, 8); // Remove all slices.

    expect(order.numerator).toBe(0);
  });

  // Keep the starting amount when subtracting zero.
  it("should allow subtracting zero", () => {
    const order = createSubtractionOrder(5, 0, 8); // Remove no slices.

    expect(order.numerator).toBe(5);
  });

  // Reject negative results.
  it("should reject removing more slices than available", () => {
    expect(() => createSubtractionOrder(2, 5, 8))
      .toThrow("Invalid subtraction amount");
  });

  // Check denominator limits and whole numbers.
  it("should reject invalid denominators", () => {
    expect(() => createSubtractionOrder(1, 0, 1))
      .toThrow("Invalid denominator");

    expect(() => createSubtractionOrder(5, 2, 13))
      .toThrow("Invalid denominator");

    expect(() => createSubtractionOrder(5, 2, 8.5))
      .toThrow("Invalid denominator");
  });

  // Check starting slice limits and whole numbers.
  it("should reject invalid starting amounts", () => {
    expect(() => createSubtractionOrder(-1, 0, 8))
      .toThrow("Invalid starting amount");

    expect(() => createSubtractionOrder(9, 2, 8))
      .toThrow("Invalid starting amount");

    expect(() => createSubtractionOrder(5.5, 2, 8))
      .toThrow("Invalid starting amount");
  });

  // Reject negative and fractional removal amounts.
  it("should reject invalid subtraction amounts", () => {
    expect(() => createSubtractionOrder(5, -1, 8))
      .toThrow("Invalid subtraction amount");

    expect(() => createSubtractionOrder(5, 1.5, 8))
      .toThrow("Invalid subtraction amount");
  });
});