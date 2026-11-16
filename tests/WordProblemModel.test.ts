import { describe, it, expect } from "vitest";
import { WordProblemModel } from "../src/features/wordProblems/WordProblemModel";
import type { WordProblem } from "../src/features/wordProblems/types";

const additionProblem: WordProblem = {
  id: 1,
  title: "Pizza",
  question: "How much pizza?",
  operation: "addition",
  numerator1: 2,
  numerator2: 3,
  denominator: 8,
  hint: "Add the numerators."
};

const subtractionProblem: WordProblem = {
  id: 2,
  title: "Cake",
  question: "How much cake is left?",
  operation: "subtraction",
  numerator1: 5,
  numerator2: 2,
  denominator: 6,
  hint: "Subtract the numerators."
};

describe("WordProblemModel", () => {
  it("calculates addition correctly", () => {
    const model = new WordProblemModel(additionProblem);

    expect(model.getAnswerNumerator()).toBe(5);
  });

  it("calculates subtraction correctly", () => {
    const model = new WordProblemModel(subtractionProblem);

    expect(model.getAnswerNumerator()).toBe(3);
  });

  it("accepts correct answers", () => {
    const model = new WordProblemModel(additionProblem);

    expect(model.checkAnswer("5/8").correct).toBe(true);
  });

  it("rejects incorrect answers", () => {
    const model = new WordProblemModel(additionProblem);

    expect(model.checkAnswer("4/8").correct).toBe(false);
  });

  it("accepts equivalent fractions", () => {
    const model = new WordProblemModel(subtractionProblem);

    // 3/6 = 1/2
    expect(model.checkAnswer("1/2").correct).toBe(true);
  });

  it("rejects zero denominators", () => {
    const model = new WordProblemModel(additionProblem);

    const result = model.checkAnswer("5/0");

    expect(result.valid).toBe(false);
  });

  it("rejects invalid text", () => {
    const model = new WordProblemModel(additionProblem);

    expect(model.checkAnswer("hello").valid).toBe(false);
  });

  it("rejects missing numerators", () => {
    const model = new WordProblemModel(additionProblem);

    expect(model.checkAnswer("/8").valid).toBe(false);
  });

  it("accepts whitespace around input", () => {
    const model = new WordProblemModel(additionProblem);

    expect(model.checkAnswer(" 5 / 8 ").correct).toBe(true);
  });

  it("provides the correct hint", () => {
    const model = new WordProblemModel(additionProblem);

    expect(model.getHint()).toBe("Add the numerators.");
  });

  it("generates the correct equation", () => {
    const model = new WordProblemModel(additionProblem);

    expect(model.getExplanation()).toContain(
      "2/8 + 3/8 = 5/8"
    );
  });
});
