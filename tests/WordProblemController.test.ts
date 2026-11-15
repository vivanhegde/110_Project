import { describe, it, expect } from "vitest";
import { WordProblemController } from "../src/features/wordProblems/WordProblemController";
import { WORD_PROBLEMS } from "../src/features/wordProblems/problems";

describe("WordProblemController", () => {
  it("starts with the first problem", () => {
    const controller = new WordProblemController(
      WORD_PROBLEMS
    );

    expect(controller.getCurrentProgress().current).toBe(1);
    expect(controller.isSolved()).toBe(false);
  });

  it("does not advance before a correct answer", () => {
    const controller = new WordProblemController(
      WORD_PROBLEMS
    );

    expect(controller.nextProblem()).toBe(false);
    expect(controller.getCurrentProgress().current).toBe(1);
  });

  it("advances after a correct answer", () => {
    const controller = new WordProblemController(
      WORD_PROBLEMS
    );

    controller.checkAnswer("5/8");
    controller.nextProblem();

    expect(controller.getCurrentProgress().current).toBe(2);
    expect(controller.isSolved()).toBe(false);
  });

  it("keeps the same problem after an incorrect answer", () => {
    const controller = new WordProblemController(
      WORD_PROBLEMS
    );

    controller.checkAnswer("1/8");

    expect(controller.getCurrentProgress().current).toBe(1);
    expect(controller.isSolved()).toBe(false);
  });

  it("shows an explanation after two incorrect attempts", () => {
    const controller = new WordProblemController(
      WORD_PROBLEMS
    );

    controller.checkAnswer("1/8");
    const second = controller.checkAnswer("2/8");

    expect(second.explanation).toBeDefined();
  });

  it("does not count invalid input as a wrong attempt", () => {
    const controller = new WordProblemController(
      WORD_PROBLEMS
    );

    controller.checkAnswer("abc");
    const result = controller.checkAnswer("1/8");

    expect(result.explanation).toBeUndefined();
  });

  it("reports completion after the last problem", () => {
    const controller = new WordProblemController(
      WORD_PROBLEMS
    );

    const answers = ["5/8", "3/6", "3/4", "4/8", "5/6"];

    answers.forEach((answer, index) => {
      const result = controller.checkAnswer(answer);

      expect(result.correct).toBe(true);

      const finished = controller.nextProblem();

      expect(finished).toBe(index === answers.length - 1);
    });
  });

  it("rejects an empty problem list", () => {
    expect(() => {
      new WordProblemController([]);
    }).toThrow();
  });
});
