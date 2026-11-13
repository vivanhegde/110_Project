import type { Recipe, RecipeResult } from "./types";

export class RecipeModel {
  private recipe: Recipe;
  private scoops = 0;
  private incorrectAttempts = 0;

  public constructor(recipe: Recipe) {
    if (
      !Number.isInteger(recipe.numerator) ||
      !Number.isInteger(recipe.denominator) ||
      !Number.isInteger(recipe.multiplier) ||
      recipe.denominator < 2 ||
      recipe.denominator > 12 ||
      recipe.numerator < 1 ||
      recipe.numerator >= recipe.denominator ||
      recipe.multiplier < 2
    ) {
      throw new Error("Invalid recipe");
    }
    this.recipe = recipe;
  }

  public getRecipe(): Recipe {
    return this.recipe;
  }

  public getScoops(): number {
    return this.scoops;
  }

  public addScoop(): void {
    this.scoops++;
  }

  public removeScoop(): void {
    if (this.scoops > 0) {
      this.scoops--;
    }
  }

  //The scaled amount is multiplier × numerator, with the same denominator
  public getAnswerNumerator(): number {
    return this.recipe.multiplier * this.recipe.numerator;
  }

  public getHint(): string {
    const { numerator, denominator, multiplier } = this.recipe;
    return `${multiplier} × ${numerator}/${denominator} means ${multiplier} groups of ${numerator}/${denominator}. ` +
      `Multiply the top number by ${multiplier} and keep ${denominator} on the bottom.`;
  }

  public checkAnswer(): RecipeResult {
    const { ingredient, numerator, denominator, multiplier } = this.recipe;
    const answer = this.getAnswerNumerator();
    const measured = `${this.scoops}/${denominator}`;

    if (this.scoops === answer) {
      return {
        type: "correct",
        title: "Delicious!",
        message: `${multiplier} × ${numerator}/${denominator} = ${answer}/${denominator} cup of ${ingredient}. That's just right!`,
      };
    }

    this.incorrectAttempts++;
    const tooFew = this.scoops < answer;

    return {
      type: tooFew ? "tooFew" : "tooMany",
      title: tooFew ? `Not enough ${ingredient}!` : `Too much ${ingredient}!`,
      message: tooFew
        ? `You measured ${measured} cup. The bigger recipe needs more. Add more scoops.`
        : `You measured ${measured} cup. That's more than the bigger recipe needs. Take some scoops out.`,
      hint: this.getHint(),
    };
  }

  public getIncorrectAttempts(): number {
    return this.incorrectAttempts;
  }
}