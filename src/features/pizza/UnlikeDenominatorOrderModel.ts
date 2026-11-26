/**
 * Connects US11 orders to the existing game modules.
 * Stores the original question and provides a common-denominator
 * order so shared modules can work with equal-sized slices.
 * Checks that the current slice denominator matches the common
 * denominator, then uses the shared answer checker to validate
 * the actual slice count.
 */

// Import shared answer checking.
import { PizzaOrderModel } from "./PizzaOrderModel";

// Import validated order creation.
import {
  createUnlikeDenominatorOrder,
} from "./CreateUnlikeDenominatorOrder";

// Import order and answer types.
import type {
  UnlikeDenominatorOrder,
  PizzaOrder,
  SubtractionOrder,
  AnswerResult,
} from "./types";

// Connect unlike-denominator orders to shared game logic.
export class UnlikeDenominatorOrderModel {
  private readonly order: UnlikeDenominatorOrder; // Validated order data.

  // Recalculate converted values from the original fractions.
  public constructor(order: UnlikeDenominatorOrder) {
    this.order = createUnlikeDenominatorOrder(
      order.operation,
      order.firstNumerator,
      order.firstDenominator,
      order.secondNumerator,
      order.secondDenominator,
    );
  }

  // Return a copy of the original question and converted values.
  public getOrder(): UnlikeDenominatorOrder {
    return { ...this.order };
  }

  // Provide a common-denominator order for existing modules.
  public getCommonOrder(): PizzaOrder | SubtractionOrder {
    const order = this.order; // Current validated order.

    if (order.operation === "subtraction") {
      // Preserve the starting amount and amount to remove.
      return {
        numerator: order.resultNumerator, // Expected remaining slices.
        denominator: order.commonDenominator, // Common slice denominator.
        initialNumerator: order.convertedFirstNumerator, // Starting slices.
        subtractNumerator: order.convertedSecondNumerator, // Slices to remove.
        unlikeOrder: this.getOrder(), // Original question data.
      };
    }

    // Provide converted addition operands.
    return {
      numerator: order.resultNumerator, // Expected total slices.
      denominator: order.commonDenominator, // Common slice denominator.
      firstNumerator: order.convertedFirstNumerator, // First slice count.
      secondNumerator: order.convertedSecondNumerator, // Second slice count.
      unlikeOrder: this.getOrder(), // Original question data.
    };
  }

  // Check the actual amount after conversion to equal-sized slices.
  public checkAnswer(
    selectedSlices: number, // Placed slices or remaining slices.
    currentDenominator: number, // Current slice denominator.
  ): AnswerResult {
    // Require the planned common denominator before checking.
    if (currentDenominator !== this.order.commonDenominator) {
      throw new Error(
        "Slice denominator must match the common denominator",
      );
    }

    // Reuse validation and checking without storing another slice count.
    const checker = new PizzaOrderModel(this.getCommonOrder());

    checker.selectSlice(selectedSlices);
    return checker.checkAnswer();
  }
}
