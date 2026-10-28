// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { LevelView } from "../src/features/level/LevelView";
import type { LevelProgress, LevelResult } from "../src/features/level/types";

//Creates empty header and results elements for each test
function setup(): { view: LevelView; header: HTMLElement; results: HTMLElement } {
  const header = document.createElement("div");
  const results = document.createElement("div");
  results.hidden = true;
  return { view: new LevelView(header, results), header, results };
}

const progress: LevelProgress = {
  levelNumber: 1,
  currentOrderNumber: 3,
  totalOrders: 5,
  completedOrders: 2,
  score: 200,
  isComplete: false,
};

const passedResult: LevelResult = {
  levelNumber: 1,
  passed: true,
  firstTryCorrectCount: 4,
  requiredToPass: 4,
  totalOrders: 5,
  score: 500,
  records: [
    { order: { numerator: 5, denominator: 8 }, firstTryCorrect: true, pointsEarned: 100 },
    { order: { numerator: 3, denominator: 8 }, firstTryCorrect: false, pointsEarned: 100 },
  ],
};

describe("LevelView", () => {
  it("should show the level, order count, progress bar, and score in the header", () => {
    const { view, header } = setup();
    view.renderHeader(progress);
    expect(header.querySelector(".level-number")?.textContent).toBe("Level 1");
    expect(header.querySelector(".order-count")?.textContent).toBe("Order 3 of 5");
    expect((header.querySelector(".progress-fill") as HTMLElement).style.width).toBe("40%");
    expect(header.querySelector(".score")?.textContent).toBe("Score: 200");
  });

  it("should replace the old header instead of adding a second one", () => {
    const { view, header } = setup();
    view.renderHeader(progress);
    view.renderHeader({ ...progress, currentOrderNumber: 4 });
    expect(header.querySelectorAll(".order-count")).toHaveLength(1);
    expect(header.querySelector(".order-count")?.textContent).toBe("Order 4 of 5");
  });

  it("should show the level complete screen with Play Again", () => {
    const { view, results } = setup();
    view.renderResults(passedResult, () => {});
    expect(results.hidden).toBe(false);
    expect(results.querySelector("h2")?.textContent).toBe("Level 1 complete!");
    expect(results.querySelector(".results-score")?.textContent).toBe("Total score: 500");
    expect(results.querySelectorAll(".results-orders li")).toHaveLength(2);
    expect(results.querySelector(".results-orders li")?.textContent).toBe("Order 1: 5/8 (first try)");
    expect(results.querySelector(".restart-button")?.textContent).toBe("Play Again");
  });

  it("should show the level not passed screen with Retry Level", () => {
    const { view, results } = setup();
    view.renderResults({ ...passedResult, passed: false, firstTryCorrectCount: 3 }, () => {});
    expect(results.querySelector("h2")?.textContent).toBe("Level 1 not passed");
    expect(results.querySelector(".restart-button")?.textContent).toBe("Retry Level");
  });

  it("should call onRestart when the button is pressed", () => {
    const { view, results } = setup();
    const onRestart = vi.fn();
    view.renderResults(passedResult, onRestart);
    (results.querySelector(".restart-button") as HTMLButtonElement).click();
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it("should hide and clear the results screen", () => {
    const { view, results } = setup();
    view.renderResults(passedResult, () => {});
    view.hideResults();
    expect(results.hidden).toBe(true);
    expect(results.children).toHaveLength(0);
  });
});
