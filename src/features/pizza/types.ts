export interface PizzaOrder {
  numerator: number;
  denominator: number;
}

export interface AnswerResult {
  correct: boolean;
  message: string;
}

// Subtraction order with two operands.
export interface SubtractionOrder extends PizzaOrder {
  initialNumerator: number;  // Starting slice count.
  subtractNumerator: number; // Slices to take away.
}