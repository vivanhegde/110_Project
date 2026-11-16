import type { WordProblem } from "./types";

export const WORD_PROBLEMS: WordProblem[] = [
    {
        id: 1,
        title: "Pizza Party",
        question: "Maya used 2/8 of a pizza for one order and 3/8 for another order. How much pizza did she use altogether?",
        operation: "addition",
        numerator1: 2,
        numerator2: 3,
        denominator: 8,
        hint: "Both amounts are measured in eighths. Try adding the numerators together while keeping the denominator the same."
    },
    {
        id: 2,
        title: "Cake Shop",
        question: "A baker made 5/6 of a cake and sold 2/6 of it. How much cake is left?",
        operation: "subtraction",
        numerator1: 5,
        numerator2: 2,
        denominator: 6,
        hint: "Start with 5/6 and subtract 2/6. Remember to keep the denominator the same."
    },
    {
        id: 3,
        title: "Juice Stand",
        question: "Leo poured 1/4 of a liter of orange juice and 2/4 of a liter of apple juice into a pitcher. How much juice is in the pitcher?",
        operation: "addition",
        numerator1: 1,
        numerator2: 2,
        denominator: 4,
        hint: "Add the amounts of orange and apple juice. They both use fourths"
    },
    {
        id: 4,
        title: "Chocolate Bar",
        question:
        "Emma had 7/8 of a chocolate bar. She ate 3/8 of the bar. How much chocolate does she have left?",
        operation: "subtraction",
        numerator1: 7,
        numerator2: 3,
        denominator: 8,
        hint:
        "Think about how many eighths Emma had before and after eating."
    },
    {
        id: 5,
        title: "Sandwich Shop",
        question:
        "A chef used 2/6 of a loaf of bread for lunch and 3/6 for dinner. How much of the loaf did the chef use?",
        operation: "addition",
        numerator1: 2,
        numerator2: 3,
        denominator: 6,
        hint:
        "Add the parts used for lunch and dinner. Keep the denominator 6"
    }
];
