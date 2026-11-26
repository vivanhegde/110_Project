import { WORD_PROBLEMS } from "./problems";

import type {
  PizzaOrder,
  SubtractionOrder
} from "../pizza/types";

export function buildWordProblemOrders(): PizzaOrder[] {
  return WORD_PROBLEMS.map((problem): PizzaOrder => {

    if (problem.operation === "subtraction") {
      const order: SubtractionOrder = {
        customerName: problem.title,
        request: problem.question,
        denominator: problem.denominator,
        initialNumerator: problem.numerator1,
        subtractNumerator: problem.numerator2,
        numerator: problem.numerator1 - problem.numerator2
      };

      return order;
    }

    return {
      customerName: problem.title,
      request: problem.question,
      denominator: problem.denominator,
      firstNumerator: problem.numerator1,
      secondNumerator: problem.numerator2,
      numerator: problem.numerator1 + problem.numerator2
    };
  });
}
