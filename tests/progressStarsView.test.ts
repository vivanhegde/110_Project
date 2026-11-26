// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { ProgressView } from "../src/features/progressStars/progressStarsView";
import { starsText } from "../src/features/progressStars/starsText";
import type { LevelProgressRecord } from "../src/features/progressStars/types";

const twoLevels: LevelProgressRecord[] = [
    { levelNumber: 1, stars: 3, bestScore: 500 },
    { levelNumber: 2, stars: 1, bestScore: 200 },
];

// Makes an empty container and a view that draws into it
function makeView(): { container: HTMLElement; view: ProgressView } {
    const container = document.createElement("div");
    return { container: container, view: new ProgressView(container) };
}

describe("starsText", () => {
    it("should show filled stars first, then empty ones up to 3", () => {
        expect(starsText(0)).toBe("☆☆☆");
        expect(starsText(2)).toBe("★★☆");
        expect(starsText(3)).toBe("★★★");
    });
});

describe("ProgressView", () => {

    it("should list each completed level with its stars and best score", () => {
        const { container, view } = makeView();
        view.render(twoLevels, 4, 44, function () {});

        const rows = container.querySelectorAll(".progress-levels li");
        expect(rows.length).toBe(2);
        expect(rows[0].textContent).toContain("Level 1");
        expect(rows[0].textContent).toContain("★★★");
        expect(rows[0].textContent).toContain("Best score: 500");
        expect(rows[1].textContent).toContain("★☆☆");
    });

    it("should show the total stars", () => {
        const { container, view } = makeView();
        view.render(twoLevels, 4, 44, function () {});

        expect(container.querySelector(".progress-total")?.textContent).toBe("Total stars: 4");
    });

    it("should fill the progress bar to the percent complete", () => {
        const { container, view } = makeView();
        view.render(twoLevels, 4, 67, function () {});

        const fill = container.querySelector<HTMLElement>(".progress-fill");
        expect(fill?.style.width).toBe("67%");
    });

    it("should show a message when no levels are completed yet", () => {
        const { container, view } = makeView();
        view.render([], 0, 0, function () {});

        expect(container.querySelector(".progress-levels")).toBeNull();
        expect(container.querySelector(".progress-empty")?.textContent).toContain("No levels completed yet");
    });

    it("should call onBack when Back is clicked", () => {
        const { container, view } = makeView();
        let clicked = false;
        view.render(twoLevels, 4, 44, function () { clicked = true; });

        container.querySelector<HTMLButtonElement>(".progress-back")?.click();
        expect(clicked).toBe(true);
    });

    it("should replace the old screen instead of adding a second one", () => {
        const { container, view } = makeView();
        view.render(twoLevels, 4, 44, function () {});
        view.render(twoLevels, 4, 44, function () {});

        expect(container.querySelectorAll(".progress-page").length).toBe(1);
    });
});

describe("ProgressView style (matches the rest of the game)", () => {
    it("should show the game's header bar above the progress card", () => {
        const container = document.createElement("div");
        new ProgressView(container).render([], 0, 0, function () {});

        expect(container.querySelector(".progress-screen .progress-header .progress-logo")?.textContent).toBe("🍕 Fraction Food Truck");
        expect(container.querySelectorAll(".progress-screen").length).toBe(1);
    });
});