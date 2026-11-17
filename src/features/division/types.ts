export interface DivisionOrder {
  food: string;
  totalNumerator: number;
  totalDenominator: number;
  portionNumerator: number;
  portionDenominator: number;
}

export interface DivisionResult {
  type: "correct" | "tooFew" | "tooMany";
  message: string;
  hint?: string;
}
