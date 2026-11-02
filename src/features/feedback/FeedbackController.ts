import type { FeedbackDisplay } from "./FeedbackView";
import { FeedbackModel } from "./FeedbackModel";
import type { PizzaOrder, AnswerResult } from "../pizza/types";
import type { Feedback } from "./types";

export class FeedbackController {
  private model: FeedbackModel;

  public constructor(model: FeedbackModel, private readonly view?: FeedbackDisplay) {
    this.model = model;
  }

  //Called after the pizza controller checks the answer
  public showFeedback(order: PizzaOrder, selectedSlices: number, result: AnswerResult): Feedback {
    const feedback = this.model.createFeedback(order, selectedSlices, result);
    this.view?.show(feedback, order);
    return feedback;
  }

  //Called when the student presses Try Again
  public closeFeedback(): void {
    this.model.clearFeedback();
    this.view?.clear();
  }

  //Called when a new order begins
  public startNewOrder(): void {
    this.model.reset();
    this.view?.clear();
  }

  public getCurrentFeedback(): Feedback | null {
    return this.model.getCurrentFeedback();
  }

  public getIncorrectAttempts(): number {
    return this.model.getIncorrectAttempts();
  }
}