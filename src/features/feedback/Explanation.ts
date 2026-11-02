import type { PizzaOrder, SubtractionOrder } from "../pizza/types";

export interface PizzaDiagram {
  label: string;
  filledSlices: number;
  denominator: number;
  fadedSlices?: number;
}

export interface Explanation {
  steps: string[];
  pizzas: PizzaDiagram[];
  rows?: { label: string; operator: string; pizzas: [PizzaDiagram, PizzaDiagram] }[];
}

/** Build teaching content from the order. */
export function createExplanation(order: PizzaOrder): Explanation {
  const { numerator, denominator } = order;
  const fraction = `${numerator}/${denominator}`;
  const pizza = (label: string, filledSlices: number): PizzaDiagram =>
    ({ label, filledSlices, denominator });

  if ("initialNumerator" in order && "subtractNumerator" in order) {
    const { initialNumerator, subtractNumerator } = order as SubtractionOrder;
    return {
      steps: [
        `The denominator ${denominator} means one whole pizza is cut into ${denominator} equal slices. Each slice is 1/${denominator}.`,
        `Start with ${initialNumerator}/${denominator}: ${initialNumerator} slices of that pizza.`,
        `Take away ${subtractNumerator}/${denominator}: remove ${subtractNumerator} slices.`,
        `Subtract the slice counts: ${initialNumerator} − ${subtractNumerator} = ${numerator}. Keep the denominator ${denominator} because the slices stay the same size.`,
        `So ${initialNumerator}/${denominator} − ${subtractNumerator}/${denominator} = ${fraction}. Leave ${numerator} slices in the tray.`,
      ],
      rows: [
        { label: `1. Start: take away ${subtractNumerator}/${denominator}`, operator: "", pizzas: [
          pizza("Slice tray", initialNumerator), pizza("Return plate", 0),
        ] },
        { label: "2. Move the faded slices to the return plate", operator: "→", pizzas: [
          { ...pizza("Slice tray", numerator), fadedSlices: subtractNumerator },
          { ...pizza("Return plate", 0), fadedSlices: subtractNumerator },
        ] },
        { label: `3. Solution: ${initialNumerator}/${denominator} − ${subtractNumerator}/${denominator} = ${fraction}`, operator: "", pizzas: [
          pizza("Slice tray", numerator), pizza("Return plate", subtractNumerator),
        ] },
      ],
      pizzas: [pizza("Start", initialNumerator), pizza("Take away", subtractNumerator), pizza("Left in the tray", numerator)],
    };
  }

  return {
    steps: [
      `The denominator ${denominator} means one whole pizza is cut into ${denominator} equal slices. Each slice is 1/${denominator}.`,
      `The numerator ${numerator} tells you how many slices the customer wants.`,
      `Count out ${numerator} slices. ${numerator} pieces of size 1/${denominator} make ${fraction} of a pizza.`,
      `Place ${numerator} slices on the plate to make ${fraction}.`,
    ],
    pizzas: [pizza("One whole pizza", denominator), pizza("Customer's order", numerator)],
  };
}
