export type Operation = "addition" | "subtraction"; //Represents the type of operation for a word problem.

//Represents a word problem with its details, including the question, operation, and fractions involved.
export interface WordProblem {
    id: number;
    title: string;
    question: string;
    operation: Operation;
    numerator1: number;
    numerator2: number;
    denominator: number;
    hint: string;
}

//Represents the result of a user's answer to a word problem.
export interface AnswerResult{
    correct: boolean;
    valid: boolean;
    message: string;
    explanation?: string;
}

//Represents the progress of a game, including the current level and total levels.
export interface GameProgress{
    current: number;
    total: number;
}