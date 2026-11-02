// Import the shared pizza model.
import { PizzaOrderModel } from "./PizzaOrderModel";

// Import the shared plate state.
import { PlateModel } from "../plate/PlateModel";

// Import order creation and validation.
import { createSubtractionOrder } from "./CreateSubtractionOrder";

// Import the required types.
import type { SubtractionOrder, AnswerResult } from "./types";

// Manage slice state for a subtraction order.
export class SubtractionOrderModel {
  private readonly order: SubtractionOrder; // Validated order data.
  private readonly plateModel: PlateModel; // Single source of slice state.

  // Create the order and initialize its slices.
  public constructor(order: SubtractionOrder, plateModel?: PlateModel) {
    // Validate the operands and calculate the target.
    this.order = createSubtractionOrder(
      order.initialNumerator,
      order.subtractNumerator,
      order.denominator,
    );

    // Share the same plate used by the drag controller.
    this.plateModel = plateModel ?? new PlateModel(this.order.denominator);
    // Starting slices stay in the left tray; the right plate begins empty.
    this.plateModel.reset(this.order.denominator);
  }

  // Return a copy to protect internal order data.
  public getOrder(): SubtractionOrder {
    return { ...this.order };
  }

  // Return the number of slices remaining.
  public getSelectedSlices(): number {
    // Moving a slice onto the right plate takes it away from the tray.
    return this.order.initialNumerator - this.plateModel.getSlicesOnPlate();
  }

  // Take one slice from the tray and place it on the order plate.
  public removeSlice(sliceId?: number): void {
    // Validate explicit IDs before looking for an available slice.
    if (sliceId !== undefined) this.validateSlice(sliceId);
    const target = sliceId ?? this.findSlice(false); // Selected or first tray slice.

    // Reject removal from an empty pizza.
    if (target === -1) {
      throw new Error("No slices left to remove");
    }

    // Reuse the original first-empty-slot placement rule.
    this.plateModel.placeSlice(target);
  }

  // Move one taken-away slice back into the tray.
  public restoreSlice(sliceId?: number): void {
    // Validate explicit IDs before looking for a returned slice.
    if (sliceId !== undefined) this.validateSlice(sliceId);
    const target = sliceId ?? this.findSlice(true); // Selected or first order-plate slice.

    // Only allow slices that were previously removed.
    if (target === -1) {
      throw new Error("No returned slices to restore");
    }

    // Restore exactly one slice to the tray.
    this.plateModel.removeSlice(target);
  }

  // Compare the remaining slices with the target.
  public checkAnswer(): AnswerResult {
    // Check a snapshot of the actual plate using existing answer logic.
    const checker = new PizzaOrderModel(this.getOrder()); // Shared answer checker.
    checker.selectSlice(this.getSelectedSlices());
    return checker.checkAnswer();
  }

  // Find a plated or returned slice for count-based callers.
  private findSlice(onPlate: boolean): number {
    for (let sliceId = 0; sliceId < this.order.initialNumerator; sliceId++) {
      if (this.plateModel.isOnPlate(sliceId) === onPlate) return sliceId;
    }
    return -1;
  }

  // Reject slices that were not part of the starting pizza.
  private validateSlice(sliceId: number): void {
    if (!Number.isInteger(sliceId) || sliceId < 0 || sliceId >= this.order.initialNumerator) {
      throw new Error("Invalid subtraction slice");
    }
  }
}
