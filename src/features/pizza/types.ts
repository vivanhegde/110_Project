export interface PizzaOrder {
  numerator: number;
  denominator: number;

  // Addition operands with a common denominator.
  firstNumerator?: number;
  secondNumerator?: number;

  // Information displayed by the view.
  customerName?: string;
  request?: string;
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

export interface CuttingOrder extends PizzaOrder {
  targetDenominator: number;
}