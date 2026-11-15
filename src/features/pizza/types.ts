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

// Supported denominators in ascending order.
export const unlikeDenominators = [2, 3, 4, 6, 12] as const;

// Derive the type from the supported values.
export type UnlikeDenominator = (typeof unlikeDenominators)[number];

// Store original fractions and their converted values.
export interface UnlikeDenominatorOrder {
  operation: "addition" | "subtraction"; // Operation type.

  firstNumerator: number; // First original numerator.
  firstDenominator: UnlikeDenominator; // First original denominator.

  secondNumerator: number; // Second original numerator.
  secondDenominator: UnlikeDenominator; // Second original denominator.

  commonDenominator: UnlikeDenominator; // Least common denominator.
  convertedFirstNumerator: number; // First numerator after conversion.
  convertedSecondNumerator: number; // Second numerator after conversion.

  resultNumerator: number; // Answer over the common denominator.
}

export interface CuttingOrder extends PizzaOrder {
  targetDenominator: number;
}