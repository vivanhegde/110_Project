
import type {
  PizzaOrder,
  SubtractionOrder
} from "../pizza/types";

//Three addition orders and two subtraction orders.
export const LEVEL_ORDERS: PizzaOrder[] = [
  {
    customerName: "Kayla",
    denominator: 8,
    firstNumerator: 2,
    secondNumerator: 3,
    numerator: 5
  },
  {
    customerName: "Leo",
    denominator: 8,
    initialNumerator: 6,
    subtractNumerator: 2,
    numerator: 4
  } as SubtractionOrder,
  {
    customerName: "Mia",
    denominator: 8,
    firstNumerator: 1,
    secondNumerator: 2,
    numerator: 3
  },
  {
    customerName: "Sam",
    denominator: 8,
    initialNumerator: 7,
    subtractNumerator: 3,
    numerator: 4
  } as SubtractionOrder,
  {
    customerName: "Ava",
    denominator: 8,
    firstNumerator: 2,
    secondNumerator: 4,
    numerator: 6
  }
];
