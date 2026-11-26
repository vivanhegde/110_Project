// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { LevelView } from "../src/features/level/LevelView";
import type { LevelResult } from "../src/features/level/types";

// Builds a fake finished level with 5 orders (need 4 to pass)
function makeResult(): LevelResult {
    return {
        levelNumber: 1,
        passed: true,
        firstTryCorrectCount: 4,
        requiredToPass: 4,
        totalOrders: 5,
        score: 400,
        records: [],
    };
}

// Makes a LevelView with its own header and results areas
function makeView(): { results: HTMLElement; view: LevelView } {
    const header = document.createElement("div");
    const results = document.createElement("div");
    return { results: results, view: new LevelView(header, results) };
}

describe("LevelView stars (US-8)", () => {

    it("should show the stars earned on the results screen", () => {
        const { results, view } = makeView();
        view.renderResults(makeResult(), function () {}, undefined, 2);

        expect(results.querySelector(".results-stars")?.textContent).toBe("★★☆ 2 of 3 stars");
    });

    it("should not show stars when none are given", () => {
        const { results, view } = makeView();
        view.renderResults(makeResult(), function () {});

        expect(results.querySelector(".results-stars")).toBeNull();
    });
});