// Import the shared pizza model.
import { PizzaOrderModel } from "./PizzaOrderModel";

// Import order creation and validation.
import { createSubtractionOrder } from "./CreateSubtractionOrder";

// Import the required types.
import type { SubtractionOrder, AnswerResult } from "./types";

// Manage slice state for a subtraction order.
export class SubtractionOrderModel {
  private readonly order: SubtractionOrder; // Validated order data.
  private readonly pizzaModel: PizzaOrderModel; // Shared slice state.

  // Create the order and initialize its slices.
  public constructor(order: SubtractionOrder) {
    // Validate the operands and calculate the target.
    this.order = createSubtractionOrder(
      order.initialNumerator,
      order.subtractNumerator,
      order.denominator,
    );

    // Reuse the shared model for state and checking.
    this.pizzaModel = new PizzaOrderModel(this.order);

    // Start with the first operand's slice count.
    this.pizzaModel.selectSlice(this.order.initialNumerator);
  }

  // Return a copy to protect internal order data.
  public getOrder(): SubtractionOrder {
    return { ...this.order };
  }

  // Return the number of slices remaining.
  public getSelectedSlices(): number {
    return this.pizzaModel.getSelectedSlices();
  }

  // Move one slice off the pizza.
  public removeSlice(): void {
    const remaining = this.getSelectedSlices(); // Current slice count.

    // Reject removal from an empty pizza.
    if (remaining === 0) {
      throw new Error("No slices left to remove");
    }

    // Remove exactly one slice.
    this.pizzaModel.selectSlice(remaining - 1);
  }

  // Put one returned slice back onto the pizza.
  public restoreSlice(): void {
    const remaining = this.getSelectedSlices(); // Current slice count.

    // Only allow slices that were previously removed.
    if (remaining >= this.order.initialNumerator) {
      throw new Error("No returned slices to restore");
    }

    // Restore exactly one slice.
    this.pizzaModel.selectSlice(remaining + 1);
  }

  // Compare the remaining slices with the target.
  public checkAnswer(): AnswerResult {
    return this.pizzaModel.checkAnswer();
  }
}
