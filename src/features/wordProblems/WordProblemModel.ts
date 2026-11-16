import type { WordProblem, AnswerResult} from "./types";

export class WordProblemModel {
    private problem: WordProblem;

    constructor(problem: WordProblem) {
        if (!Number.isInteger(problem.numerator1) ||
            !Number.isInteger(problem.numerator2) ||
            !Number.isInteger(problem.denominator) ||
            problem.numerator1 < 0 ||
            problem.numerator2 < 0 ||
            problem.denominator <= 0 ||
            !["addition", "subtraction"].includes(problem.operation)
        )
        {
            throw new Error("Invalid word problem data");
        }
        this.problem = problem;
    }

    //Returns the current word problem.
    public getProblem(): WordProblem {
        return this.problem;
    }

    //Calculates the correct answer numerator based on the operation specified in the word problem. For addition, it sums the two numerators; for subtraction, it subtracts the second numerator from the first.
    public getAnswerNumerator(): number {
        const { numerator1, numerator2, operation } = this.problem;
        if (operation === "addition") {
            return numerator1 + numerator2;
        } else if (operation === "subtraction") {
            return numerator1 - numerator2;
        }
        throw new Error("Unsupported operation");
    }

    //Returns the hint associated with the word problem.
    public getHint(): string {
        return this.problem.hint;
    } 
    
    //Generates a detailed explanation of how to solve the word problem, including the operation performed and the final answer.
    public getExplanation(): string {
        const { numerator1, numerator2, denominator, operation } = this.problem;
        
        const symbol = operation === "addition" ? "+" : "-";
        const answer = this.getAnswerNumerator();
        const action = operation === "addition" ? "added" : "subtracted";

        return `The problem involves ${numerator1}/${denominator} and ${numerator2}/${denominator}. ` + `We ${action} the numerators: ${numerator1} ${symbol} ${numerator2} = ${answer}. ` + `The denominator remains the same. ` + `${numerator1}/${denominator} ${symbol} ${numerator2}/${denominator} = ${answer}/${denominator}`;
    }

    //Parses a string input in the form of "numerator/denominator" and returns an object with the numerator and denominator as numbers. Returns null if the input is invalid.
    private parseFraction(input: string): { numerator: number; denominator: number } | null {
        const trimmed = input.trim();

        //Require an integer numerator / integer denominator format
        const match = trimmed.match(/^(\d+)\s*\/\s*(\d+)$/);

        if (!match) {
            return null;
        }

        const numerator = Number(match[1]);
        const denominator = Number(match[2]);

        if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator === 0) {
            return null;
        }
        return { numerator, denominator };
    }

    //Checks the user's answer against the correct answer for the word problem. It validates the input format, compares the user's fraction to the correct answer using cross multiplication to account for equivalent fractions, and returns an AnswerResult indicating whether the answer is correct, valid, and includes a message and explanation.
    public checkAnswer(input: string): AnswerResult {
        const fraction = this.parseFraction(input);

        if (!fraction) {
            return {
                correct: false,
                valid: false,
                message: "Please enter a valid fraction like 3/4."
            };
        }

        const correctNumerator = this.getAnswerNumerator();
        const correctDenominator = this.problem.denominator;

        //Cross multiplication accepts equivalent fractions
        const correct = BigInt(fraction.numerator) * BigInt(correctDenominator) === BigInt(correctNumerator) * BigInt(fraction.denominator);

        if (correct) {
            return {
                correct: true,
                valid: true,
                message: "Correct!",
                explanation: this.getExplanation()
            };
        }

        return {
            correct: false,
            valid: true,
            message: "That's not correct. Try again.",
            explanation: this.getExplanation()
        };
    }
}