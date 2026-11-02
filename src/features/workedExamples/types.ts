import type { PizzaOrder } from "../pizza/types";

export type Level = "Basics" | "Addition" | "Subtraction" | "Multiplication" | "Division" ;

export interface WorkedExample {
    type: Level;
    steps: ExampleStep[];
}

export interface ExampleStep {
    explanation: string;
    pizzas: PizzaOrder[];
}