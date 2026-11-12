export interface Recipe {
  ingredient: string;
  numerator: number;
  denominator: number;
  multiplier: number;
}

export type RecipeResultType = "correct" | "tooFew" | "tooMany";

export interface RecipeResult {
  type: RecipeResultType;
  title: string;
  message: string;
  hint?: string;
}