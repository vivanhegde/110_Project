import { describe, it, expect } from "vitest";
import { LevelView } from "../src/features/level/LevelView";
import type { LevelProgress, LevelResult } from "../src/features/level/types";
import type { SubtractionOrder } from "../src/features/pizza/types";

/*
  Tests for LevelView.

  The view only draws, so these tests check what ends up on the page.
  We don't use LevelModel here at all. We hand the view made-up data and check
  the text, the progress bar width, and the button. That way, if a test fails,
  we know the problem is in the drawing and not in the game rules.
*/

// Made-up header data: level 1, 2 of 5 orders done, 200 points
function makeProgress(currentOrderNumber: number): LevelProgress
{
  return {
    levelNumber: 1,
    currentOrderNumber: currentOrderNumber,
    totalOrders: 5,
    completedOrders: 2,
    score: 200,
    isComplete: false,
  };
}

// A subtraction order: start with 6/8, take away 2/8, leaves 4/8
const subtractionOrder: SubtractionOrder = {
  numerator: 4,
  denominator: 8,
  initialNumerator: 6,
  subtractNumerator: 2,
};

// Made-up results with one addition order (first try) and one subtraction order (after a retry).
// "passed" lets each test pick which results screen to draw.
function makeResult(passed: boolean): LevelResult
{
  return {
    levelNumber: 1,
    passed: passed,
    firstTryCorrectCount: 1,
    requiredToPass: 1,
    totalOrders: 2,
    score: 200,
    records: [
      { order: { numerator: 5, denominator: 8 }, firstTryCorrect: true, pointsEarned: 100 },
      { order: subtractionOrder, firstTryCorrect: false, pointsEarned: 100 },
    ],
  };
}

// Small helper: find an element by its class (like ".score") and return its text
function getText(container: HTMLElement, selector: string): string
{
  const element = container.querySelector(selector) as HTMLElement;
  return element.textContent as string;
}

describe("LevelView", () => {
  // Checks every part of the header, including the bar: 2 of 5 done = 40% wide
  it("should show the level, order count, progress bar, and score in the header", () => {
    const header = document.createElement("div");
    const results = document.createElement("div");
    const view = new LevelView(header, results);
    view.renderHeader(makeProgress(3));

    expect(getText(header, ".level-number")).toBe("Level 1");
    expect(getText(header, ".order-count")).toBe("Order 3 of 5");
    expect(getText(header, ".score")).toBe("Score: 200");

    const fill = header.querySelector(".progress-fill") as HTMLElement;
    expect(fill.style.width).toBe("40%");
  });

  // The header gets redrawn after every order and replaces the old one
  // instead of adding a second copy underneath.
  it("should replace the old header instead of adding a second one", () => {
    const header = document.createElement("div");
    const results = document.createElement("div");
    const view = new LevelView(header, results);
    view.renderHeader(makeProgress(3));
    view.renderHeader(makeProgress(4));

    expect(header.querySelectorAll(".order-count").length).toBe(1);
    expect(getText(header, ".order-count")).toBe("Order 4 of 5");
  });

  // Passed: title says "complete" and the button says Play Again
  it("should show the level complete screen with Play Again", () => {
    const header = document.createElement("div");
    const results = document.createElement("div");
    results.hidden = true; // start hidden to check that rendering shows it
    const view = new LevelView(header, results);
    view.renderResults(makeResult(true), function () {});

    expect(results.hidden).toBe(false);
    expect(getText(results, "h2")).toBe("Level 1 complete!");
    expect(getText(results, ".results-score")).toBe("Total score: 200");
    expect(getText(results, ".restart-button")).toBe("Play Again");
  });

  // Didn't pass: title says "not passed" and the button says Retry Level
  it("should show the level not passed screen with Retry Level", () => {
    const header = document.createElement("div");
    const results = document.createElement("div");
    const view = new LevelView(header, results);
    view.renderResults(makeResult(false), function () {});

    expect(getText(results, "h2")).toBe("Level 1 not passed");
    expect(getText(results, ".restart-button")).toBe("Retry Level");
  });

  // Each solved order gets a line. Subtraction shows the whole equation,
  // addition only shows the answer because that's all a PizzaOrder stores.
  it("should list each solved order, with the full equation for subtraction", () => {
    const header = document.createElement("div");
    const results = document.createElement("div");
    const view = new LevelView(header, results);
    view.renderResults(makeResult(true), function () {});

    const items = results.querySelectorAll(".results-orders li");
    expect(items.length).toBe(2);
    expect(items[0].textContent).toBe("Order 1: 5/8 (first try)");
    expect(items[1].textContent).toBe("Order 2: 6/8 - 2/8 = 4/8 (after a retry)");
  });

  // The view doesn't restart anything itself. It just calls the function it was given.
  // We pass a function that counts clicks and check it ran exactly once.
  it("should call onRestart when the button is pressed", () => {
    const header = document.createElement("div");
    const results = document.createElement("div");
    const view = new LevelView(header, results);

    let clicks = 0;
    function onRestart(): void
    {
      clicks = clicks + 1;
    }

    view.renderResults(makeResult(true), onRestart);
    const button = results.querySelector(".restart-button") as HTMLButtonElement;
    button.click();

    expect(clicks).toBe(1);
  });

  // When the level restarts, the results screen should disappear and be emptied
  it("should hide and clear the results screen", () => {
    const header = document.createElement("div");
    const results = document.createElement("div");
    const view = new LevelView(header, results);
    view.renderResults(makeResult(true), function () {});
    view.hideResults();

    expect(results.hidden).toBe(true);
    expect(results.children.length).toBe(0);
  });
});
