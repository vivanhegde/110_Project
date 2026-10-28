import { LevelModel } from "./LevelModel";
import type { PizzaOrder } from "../pizza/types";
import type { LevelProgress, LevelResult } from "./types";

export class LevelController {
  private model: LevelModel;

  public constructor(model: LevelModel) {
    this.model = model;
  }

  //Called when a new order starts, so the pizza feature knows what to show
  public getCurrentOrder(): PizzaOrder {
    return this.model.getCurrentOrder();
  }

  //Called when the student presses Next Order after a correct answer
  //incorrectAttempts comes from FeedbackController.getIncorrectAttempts()
  //pointsEarned comes from the correct Feedback's pointsEarned
  public completeOrder(incorrectAttempts: number, pointsEarned: number): void {
    this.model.recordCorrectOrder(incorrectAttempts, pointsEarned);
  }

  //Called to update the header after every order
  public getProgress(): LevelProgress {
    return this.model.getProgress();
  }

  //Called after Next Order to decide whether to show the results screen
  public isLevelComplete(): boolean {
    return this.model.isComplete();
  }

  //Called to fill the results screen
  public getResult(): LevelResult {
    return this.model.getResult();
  }

  //Called when the student presses Play Again or Retry Level
  public restartLevel(): void {
    this.model.restart();
  }
}
