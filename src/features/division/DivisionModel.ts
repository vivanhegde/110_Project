import { gcd } from "../../shared/fractions";
import type { DivisionOrder, DivisionResult } from "./types";

export class DivisionModel {
  private order: DivisionOrder;
  private portions = 0;

  public constructor(order: DivisionOrder) {
    const values = [order.totalNumerator, order.totalDenominator,
      order.portionNumerator, order.portionDenominator];
    if (values.some((value) => !Number.isSafeInteger(value) || value < 1 || value > 12)) {
      throw new Error("Invalid division order");
    }
    this.order = { ...order };
    const answer = this.getAnswer();
    if (!Number.isInteger(answer) || answer < 1 || answer > 12) {
      throw new Error("Orders must make 1 to 12 whole portions");
    }
  }

  public getOrder(): DivisionOrder { return { ...this.order }; }
  public getPortions(): number { return this.portions; }

  public addPortion(): void {
    if (this.portions < 12) this.portions++;
  }

  public removePortion(): void {
    if (this.portions > 0) this.portions--;
  }

  // a/b ÷ c/d = (a × d)/(b × c). Use integers for exact comparisons.
  public getAnswer(): number {
    const order = this.order;
    return (order.totalNumerator * order.portionDenominator) /
      (order.totalDenominator * order.portionNumerator);
  }

  public getHint(): string {
    const order = this.order;
    const denominator = order.totalDenominator * order.portionDenominator /
      gcd(order.totalDenominator, order.portionDenominator);
    const totalSlices = order.totalNumerator * denominator / order.totalDenominator;
    const portionSlices = order.portionNumerator * denominator / order.portionDenominator;
    return `Cut each pizza into ${denominator} equal slices. You have ${totalSlices} slices, ` +
      `and each portion needs ${portionSlices}. How many groups of ${portionSlices} fit into ${totalSlices}? ` +
      `Divide ${totalSlices} by ${portionSlices} to count the portions.`;
  }

  public checkAnswer(): DivisionResult {
    if (this.portions === this.getAnswer()) {
      const order = this.order;
      return { type: "correct", message:
        `Great job, chef! ${order.totalNumerator}/${order.totalDenominator} ÷ ` +
        `${order.portionNumerator}/${order.portionDenominator} = ${this.portions} equal portions.` };
    }
    const tooFew = this.portions < this.getAnswer();
    return {
      type: tooFew ? "tooFew" : "tooMany",
      message: tooFew ? "Some food is still unserved. Try making more portions."
        : "Those portions need more food than you have. Try removing a portion.",
      hint: this.getHint(),
    };
  }
}
