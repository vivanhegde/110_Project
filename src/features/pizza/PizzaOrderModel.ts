import type { PizzaOrder, AnswerResult } from "./types";

export class PizzaOrderModel {
  private order: PizzaOrder;
  private selectedSlices = 0;

  public constructor(order: PizzaOrder) {
    //Invalid order, throw an error
    if (
        !Number.isInteger(order.numerator) ||
        !Number.isInteger(order.denominator) ||
        order.denominator <= 0 ||
        order.numerator < 0 ||
        order.numerator > order.denominator
    ) {
      throw new Error("Invalid pizza order");
    }

    //If fraction addition is provided, validate that both fractions are provided
    const hasFirstNumerator = order.firstNumerator !== undefined;
    const hasSecondNumerator = order.secondNumerator !== undefined;

    if (hasFirstNumerator !== hasSecondNumerator) {
      throw new Error("Both fractions must be provided");
    }

    if (hasFirstNumerator && hasSecondNumerator) {
      const first = order.firstNumerator!;
      const second = order.secondNumerator!;

      if (
        !Number.isInteger(first) ||
        !Number.isInteger(second) ||
        first < 0 ||
        second < 0 ||
        first + second !== order.numerator
      ) {
        throw new Error("Invalid fraction addition");
      }
    }

    //If order is valid, set the order
    this.order = { ...order };
    
  }

  public getOrder(): PizzaOrder {
    return { ...this.order };
  }
  
  public selectSlice(count: number): void {
    //Invalid slice selection, throw an error
    if (
        !Number.isInteger(count) ||
        count < 0 ||
        count > this.order.denominator ||
        !Number.isInteger(count)
    ){
        throw new Error("Invalid slice selection");
    }
    //If slice selection is valid, set the selected slices to count
    this.selectedSlices = count;
  }

  getSelectedSlices(): number {
    return this.selectedSlices;
  }

  public checkAnswer(): AnswerResult {
    //If the selected slices is equal to the numerator, make correct true
    const correct = this.selectedSlices === this.order.numerator;
    //If correct is true, set message to "Correct!", else set message to "Try again!"
    const message = correct ? "Correct!" : "Try again!";

    //Return an object with correct and message
    return { correct, message };
  }
}