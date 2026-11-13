import { RecipeModel } from "./RecipeModel";
import type { Recipe, RecipeResult } from "./types";

export class RecipeController {
  private model: RecipeModel;

  public constructor(model: RecipeModel) {
    this.model = model;
  }

  //Called when the student presses + Add
  public addScoop(): void {
    this.model.addScoop();
  }

  //Called when the student presses − Remove
  public removeScoop(): void {
    this.model.removeScoop();
  }

  //Called when the student presses Check
  public checkAnswer(): RecipeResult {
    return this.model.checkAnswer();
  }

  public getRecipe(): Recipe {
    return this.model.getRecipe();
  }

  public getScoops(): number {
    return this.model.getScoops();
  }

  public getIncorrectAttempts(): number {
    return this.model.getIncorrectAttempts();
  }
}