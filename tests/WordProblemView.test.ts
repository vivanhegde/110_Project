//@vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { WordProblemView } from "../src/features/wordProblems/WordProblemView";
import { WORD_PROBLEMS } from "../src/features/wordProblems/problems";

describe("WordProblemView", () => {
  it("displays the problem and progress", () => {
    const root = document.createElement("div");

    const view = new WordProblemView(root, {
      onCheck: vi.fn(),
      onHint: vi.fn(),
      onNext: vi.fn()
    });

    view.render(
      WORD_PROBLEMS[0],
      { current: 1, total: 5 },
      null,
      null,
      false,
      ""
    );

    expect(root.textContent).toContain("Problem 1 of 5");
    expect(root.textContent).toContain("Pizza Party");
  });

  it("submits the entered answer", () => {
    const root = document.createElement("div");
    const onCheck = vi.fn();

    const view = new WordProblemView(root, {
      onCheck,
      onHint: vi.fn(),
      onNext: vi.fn()
    });

    view.render(
      WORD_PROBLEMS[0],
      { current: 1, total: 5 },
      null,
      null,
      false,
      ""
    );

    const input = root.querySelector<HTMLInputElement>(
      "#word-answer"
    )!;

    input.value = "5/8";

    const button = Array.from(
      root.querySelectorAll("button")
    ).find(b => b.textContent === "Check Answer")!;

    button.click();

    expect(onCheck).toHaveBeenCalledWith("5/8");
  });

  it("displays hints when provided", () => {
    const root = document.createElement("div");

    const view = new WordProblemView(root, {
      onCheck: vi.fn(),
      onHint: vi.fn(),
      onNext: vi.fn()
    });

    view.render(
      WORD_PROBLEMS[0],
      { current: 1, total: 5 },
      null,
      "Add the numerators.",
      false,
      ""
    );

    expect(root.textContent).toContain(
      "Hint: Add the numerators."
    );
  });

  it("shows Next Problem after solving", () => {
    const root = document.createElement("div");

    const view = new WordProblemView(root, {
      onCheck: vi.fn(),
      onHint: vi.fn(),
      onNext: vi.fn()
    });

    view.render(
      WORD_PROBLEMS[0],
      { current: 1, total: 5 },
      {
        correct: true,
        valid: true,
        message: "Correct!",
        explanation: "2/8 + 3/8 = 5/8"
      },
      null,
      true,
      "5/8"
    );

    expect(root.textContent).toContain("Next Problem");
    expect(root.textContent).toContain("2/8 + 3/8 = 5/8");
  });
});
