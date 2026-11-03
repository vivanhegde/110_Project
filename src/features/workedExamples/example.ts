import type { Level, WorkedExample } from "./types";

// Shown before addition levels
export const additionExample: WorkedExample = {
    type: "Addition",
    steps: [
        { explanation: "The customer wants 2/10 plus 3/10.", pizzas: [{ numerator: 2, denominator: 10 }, { numerator: 3, denominator: 10 }] },
        { explanation: "Drag the number of slices in the numerator of the first fraction onto the pizza.", pizzas: [{numerator: 2, denominator: 10}] },
        { explanation: "Drag the number of slices in the numerator of the second fraction onto the same pizza.", pizzas: [{numerator: 5, denominator: 10}] },
        { explanation: "Count the number of slices, and keep the same denominator.", pizzas: [{numerator: 5, denominator: 10}] }
    ],
};

// Shown before subtraction levels
export const subtractionExample: WorkedExample = {
    type: "Subtraction",
    steps: [
        { explanation: "The customer has 7/8 and they want to take away 3/8.", pizzas: [{ numerator: 7, denominator: 8 }, { numerator: 3, denominator: 8 }] },
        { explanation: "Drag the number of slices in the second fraction's numerator off.", pizzas: [{numerator: 4, denominator: 8}] },
        { explanation: "Count the number of slices, and use the same denominator.", pizzas: [{numerator: 4, denominator: 8}] }
    ],
};

// Finds the example for a level (undefined if that level has no example yet)
export function getExampleFor(level: Level): WorkedExample | undefined {
    if( level = "Subtraction" ){
        return subtractionExample;
    }
    else if( level = "Addition" ){
        return additionExample;;
    }
}
