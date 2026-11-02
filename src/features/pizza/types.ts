export interface PizzaOrder {
  numerator: number; //Total slices needed
  denominator: number; //Total slices in one pizza

  //Additional fields for fraction addition orders
  firstNumerator?: number;
  secondNumerator?: number;
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