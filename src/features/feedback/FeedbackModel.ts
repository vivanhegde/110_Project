import type { PizzaOrder, AnswerResult } from "../pizza/types";
import type { Feedback } from "./types";

export class FeedbackModel {
  private readonly pointsPerCorrect: number;
  private incorrectAttempts = 0;
  private currentFeedback: Feedback | null = null;

  public constructor(pointsPerCorrect = 100) {
    if (!Number.isInteger(pointsPerCorrect) || pointsPerCorrect < 0) {
      throw new Error("Invalid points value");
    }
    this.pointsPerCorrect = pointsPerCorrect;
  }

  public createFeedback(order: PizzaOrder, selectedSlices: number, result: AnswerResult): Feedback {
    const made = `${selectedSlices}/${order.denominator}`;
    const needed = `${order.numerator}/${order.denominator}`;

    if (result.correct) {
      this.currentFeedback = {
        type: "correct",
        title: "Perfect pizza, chef!",
        message: `You made ${needed}. That's just right! +${this.pointsPerCorrect} points`,
        pointsEarned: this.pointsPerCorrect,
        actionLabel: "Next Order",
      };
      return this.currentFeedback;
    }

    this.incorrectAttempts++;
    const difference = Math.abs(order.numerator - selectedSlices);
    const sliceWord = difference === 1 ? "slice" : "slices";
    const tooFew = selectedSlices < order.numerator;

    this.currentFeedback = {
      type: tooFew ? "tooFew" : "tooMany",
      title: tooFew ? "A little more pizza, please!" : "Whoa, that's too much pizza!",
      message: tooFew
        ? `Not quite — you made ${made}. The order needs ${needed}. Add ${difference} more ${sliceWord}. Your score stays the same.`
        : `Not quite — you made ${made}. The order needs ${needed}. Take away ${difference} ${sliceWord}. Your score stays the same.`,
      pointsEarned: 0,
      actionLabel: "Try Again",
    };
    return this.currentFeedback;
  }

  public getCurrentFeedback(): Feedback | null {
    return this.currentFeedback;
  }

  public getIncorrectAttempts(): number {
    return this.incorrectAttempts;
  }

  public clearFeedback(): void {
    this.currentFeedback = null;
  }

  public reset(): void {
    this.currentFeedback = null;
    this.incorrectAttempts = 0;
  }
}