/**
 * Coordinates US11 orders with the shared cutting and plate features.
 * Lets students choose the common denominator before answering.
 * Preserves the first fraction's amount while changing its slice size.
 * Checks cut choices and distinguishes invalid and nonminimal denominators.
 * Allows cutting again when all moved slices have been returned.
 * Reads the actual plate state for answer checking and resets the
 * current question without generating a new order.
 */

// Import shared interaction types.
import type { PlateController } from "../plate/PlateController";
import type { PlateView } from "../plate/PlateView";

// Import the unlike-denominator model.
import {
  UnlikeDenominatorOrderModel,
} from "./UnlikeDenominatorOrderModel";

// Import order and answer types.
import type {
  UnlikeDenominatorOrder,
  PizzaOrder,
  SubtractionOrder,
  AnswerResult,
} from "./types";

// Coordinate cutting, dragging, and answer checking.
export class UnlikeDenominatorOrderController {
  private orderModel: UnlikeDenominatorOrderModel | null = null; // Active order.
  private stage: "cutting" | "answering" | null = null; // Current stage.
  private onStateChanged: (() => void) | null = null; // UI update callback.

  // Connect the existing plate controller and view.
  public constructor(
    private readonly plateController: PlateController,
    private readonly view: PlateView,
  ) {
    // Refresh controls after dragging or changing the denominator.
    this.plateController.setOnSliceCountChanged(() => {
      if (this.stage === "cutting") this.drawCuttingFraction();
      this.view.setInteractionEnabled(this.stage === "answering");
      this.onStateChanged?.();
    });
  }

  // Validate a new question and begin choosing cuts.
  public startOrder(order: UnlikeDenominatorOrder): void {
    this.orderModel = new UnlikeDenominatorOrderModel(order);
    this.beginCutting();
  }

  // Return the original question and conversion data.
  public getOrder(): UnlikeDenominatorOrder {
    return this.getModel().getOrder();
  }

  // Provide converted data for shared feedback modules.
  public getCommonOrder(): PizzaOrder | SubtractionOrder {
    return this.getModel().getCommonOrder();
  }

  // Report the current interaction stage.
  public getStage(): "cutting" | "answering" | null {
    return this.stage;
  }

  // Read the denominator currently displayed by the plate.
  public getDenominator(): number {
    return this.plateController.getDenominator();
  }

  // Allow new cuts only when the right plate is empty.
  public canStartCutting(): boolean {
    return this.orderModel !== null &&
      this.plateController.getSlicesOnPlate() === 0;
  }

  // Reopen cutting after all moved slices have been returned.
  public startCutting(): void {
    if (!this.canStartCutting()) {
      throw new Error("Return all slices before changing cuts");
    }

    this.beginCutting();
  }

  // Check whether a smaller or larger denominator is available.
  public canStepDenominator(direction: 1 | -1): boolean {
    return this.stage === "cutting" &&
      this.plateController.canStepDenominator(direction);
  }

  // Reuse US10 to change the slice denominator.
  public stepDenominator(direction: 1 | -1): void {
    if (!this.canStepDenominator(direction)) return;

    this.plateController.stepDenominator(direction);
  }

  // Explain whether the selected cuts use the least common denominator.
  public checkCutting(): AnswerResult {
    const order = this.getOrder(); // Original question and target denominator.
    if (this.stage !== "cutting") {
      throw new Error("Choose cuts before confirming");
    }

    const denominator = this.getDenominator(); // Student's current choice.
    if (denominator % order.firstDenominator !== 0 ||
      denominator % order.secondDenominator !== 0) {
      return {
        correct: false,
        message: `${denominator} is not a common denominator of ${order.firstDenominator} and ${order.secondDenominator}. Choose a multiple of both denominators.`,
      };
    }

    if (denominator !== order.commonDenominator) {
      return {
        correct: false,
        message: `${denominator} is a common denominator, but it is not the smallest. Try fewer slices.`,
      };
    }

    return { correct: true, message: "You found the least common denominator!" };
  }

  // Require the least common denominator before entering the answer stage.
  public canConfirmCutting(): boolean {
    if (this.stage !== "cutting" || !this.orderModel) {
      return false;
    }

    return this.checkCutting().correct;
  }

  // Initialize equal-sized slices for addition or subtraction.
  public confirmCutting(): void {
    if (!this.canConfirmCutting()) {
      throw new Error("Choose the common denominator before answering");
    }

    const order = this.getCommonOrder(); // Converted shared order.

    if ("initialNumerator" in order) {
      this.plateController.startSubtractionOrder(order);
    } else {
      this.plateController.startOrder(order.denominator);
    }

    this.stage = "answering";
    this.view.setInteractionEnabled(true);
    this.onStateChanged?.();
  }

  // Read placed slices for addition or remaining slices for subtraction.
  public getSelectedSlices(): number {
    if (this.stage !== "answering") {
      throw new Error("Confirm cutting before answering");
    }

    return this.getOrder().operation === "subtraction"
      ? this.plateController.getRemainingSlices()
      : this.plateController.getSlicesOnPlate();
  }

  // Check the actual amount using the current slice denominator.
  public checkAnswer(): AnswerResult {
    return this.getModel().checkAnswer(
      this.getSelectedSlices(),
      this.getDenominator(),
    );
  }

  // Restore the same question and allow cutting again.
  public resetOrder(): void {
    this.startOrder(this.getOrder());
  }

  // Register updates for buttons and fraction displays.
  public setOnStateChanged(callback: () => void): void {
    this.onStateChanged = callback;
  }

  // Initialize the shared cutting feature from the original fraction.
  private beginCutting(): void {
    const order = this.getOrder(); // Current original question.

    this.stage = "cutting";

    this.plateController.startCuttingOrder({
      numerator: order.firstNumerator, // Original starting amount.
      denominator: order.firstDenominator, // Original slice denominator.
      targetDenominator: order.commonDenominator, // Required common denominator.
    });

    this.drawCuttingFraction();
    this.view.setInteractionEnabled(false);
    this.onStateChanged?.();
  }

  // Preserve the starting amount using the currently selected slice size.
  private drawCuttingFraction(): void {
    const order = this.getOrder(); // Original starting fraction.
    const denominator = this.getDenominator(); // US10's valid slice denominator.
    const slices = order.firstNumerator * denominator / order.firstDenominator; // Equivalent slice count.
    this.view.drawOrder(denominator, slices);
  }

  // Require an active order before accessing its model.
  private getModel(): UnlikeDenominatorOrderModel {
    if (!this.orderModel) {
      throw new Error("No unlike-denominator order is active");
    }

    return this.orderModel;
  }
}
