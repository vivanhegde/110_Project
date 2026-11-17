import { WordProblemModel } from "./WordProblemModel";
import type { WordProblem, AnswerResult, GameProgress } from "./types";

export class WordProblemController {
    private problems: WordProblemModel[];
    private currentIndex = 0;
    private model: WordProblemModel;
    private incorrectAttempts: number = 0;
    private solved = false;

    constructor(problems: WordProblem[]) {
        if (problems.length === 0) {
            throw new Error("No word problems provided");
        }

        // Validate and initialize all problems
        this.problems = problems.map(
            problem => new WordProblemModel(problem)
        );

        this.model = this.problems[0];
    }

    // Returns the current word problem
    public getCurrentProblem(): WordProblem {
        return this.model.getProblem();
    }

    // Returns the current game progress
    public getCurrentProgress(): GameProgress {
        return {
            current: this.currentIndex + 1,
            total: this.problems.length
        };
    }

    public getHint(): string {
        return this.model.getHint();
    }

    public isSolved(): boolean {
        return this.solved;
    }

    public checkAnswer(input: string): AnswerResult {
        if (this.solved) {
            return {
                correct: true,
                valid: true,
                message: "Problem already solved.",
                explanation: this.model.getExplanation()
            };
        }

        const result = this.model.checkAnswer(input);

        if (result.correct) {
            this.solved = true;
            return result;
        }

        // Invalid inputs do not count as incorrect attempts
        if (result.valid) {
            this.incorrectAttempts++;
        }

        // Show the explanation after two incorrect attempts
        if (this.incorrectAttempts >= 2) {
            return {
                ...result,
                explanation: this.model.getExplanation()
            };
        }

        // Hide explanation before two incorrect attempts
        const { explanation, ...feedback } = result;
        return feedback;
    }

    // Returns true if all problems have been completed
    // Returns false if current problem is unsolved or next problem is loaded
    public nextProblem(): boolean {
        if (!this.solved) {
            return false;
        }

        // All problems have been completed
        if (this.currentIndex + 1 >= this.problems.length) {
            return true;
        }

        // Move to the next problem
        this.currentIndex++;
        this.model = this.problems[this.currentIndex];

        // Reset state for the new problem
        this.incorrectAttempts = 0;
        this.solved = false;

        return false;
    }
}