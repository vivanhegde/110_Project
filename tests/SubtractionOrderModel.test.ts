// Import test utilities.
import { describe, it, expect } from "vitest";

// Import the subtraction model.
import { SubtractionOrderModel } from "../src/features/pizza/SubtractionOrderModel";

// Import order creation.
import { createSubtractionOrder } from "../src/features/pizza/CreateSubtractionOrder";

// Create a fresh model for 5/8 - 2/8.
function createModel(): SubtractionOrderModel {
  return new SubtractionOrderModel(createSubtractionOrder(5, 2, 8));
}

// Test subtraction slice state and answer checking.
describe("SubtractionOrderModel", () => {
  // Start with the first operand's slice count.
  it("should start with 5 slices", () => {
    const model = createModel(); // Fresh subtraction model.

    expect(model.getSelectedSlices()).toBe(5);
    expect(model.checkAnswer().correct).toBe(false);
  });

  // Check answers after each removal.
  it("should accept only the correct remaining amount", () => {
    const model = createModel(); // Target is 3 slices.

    // Leave too many slices.
    model.removeSlice();
    expect(model.getSelectedSlices()).toBe(4);
    expect(model.checkAnswer().correct).toBe(false);

    // Reach the correct amount.
    model.removeSlice();
    expect(model.getSelectedSlices()).toBe(3);
    expect(model.checkAnswer().correct).toBe(true);

    // Leave too few slices.
    model.removeSlice();
    expect(model.getSelectedSlices()).toBe(2);
    expect(model.checkAnswer().correct).toBe(false);
  });

  // Restore one previously removed slice.
  it("should restore a removed slice", () => {
    const model = createModel(); // Fresh subtraction model.

    model.removeSlice();
    model.restoreSlice();

    expect(model.getSelectedSlices()).toBe(5);
  });

  // Allow a zero answer and reject further removal.
  it("should stop removing slices at zero", () => {
    const order = createSubtractionOrder(5, 5, 8); // Target is zero.
    const model = new SubtractionOrderModel(order); // Fresh model.

    // Remove all five slices.
    for (let count = 0; count < 5; count++) {
      model.removeSlice();
    }

    expect(model.getSelectedSlices()).toBe(0);
    expect(model.checkAnswer().correct).toBe(true);
    expect(() => model.removeSlice())
      .toThrow("No slices left to remove");
    expect(model.getSelectedSlices()).toBe(0);
  });

  // Reject restoration beyond the starting amount.
  it("should not restore more than the starting slices", () => {
    const model = createModel(); // No slices have been removed.

    expect(() => model.restoreSlice())
      .toThrow("No returned slices to restore");
    expect(model.getSelectedSlices()).toBe(5);
  });

  // Handle an initially empty pizza.
  it("should handle zero minus zero", () => {
    const order = createSubtractionOrder(0, 0, 8); // Empty order.
    const model = new SubtractionOrderModel(order); // Empty model.

    expect(model.getSelectedSlices()).toBe(0);
    expect(model.checkAnswer().correct).toBe(true);
    expect(() => model.removeSlice())
      .toThrow("No slices left to remove");
    expect(() => model.restoreSlice())
      .toThrow("No returned slices to restore");
  });

  // Protect internal data from external changes.
  it("should protect its order data", () => {
    const order = createSubtractionOrder(5, 2, 8); // Original input.
    const model = new SubtractionOrderModel(order); // Protected model.

    // Change the original input.
    order.initialNumerator = 8;
    order.numerator = 7;

    // Change a returned copy.
    const copy = model.getOrder(); // External order copy.
    copy.initialNumerator = 8;
    copy.numerator = 7;

    // Verify that internal data remains unchanged.
    expect(model.getOrder()).toEqual(createSubtractionOrder(5, 2, 8));

    model.removeSlice();
    model.removeSlice();
    expect(model.checkAnswer().correct).toBe(true);
  });
});
