// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { ProgressController } from "../src/features/progressStars/progressStarsController";
import { ProgressModel } from "../src/features/progressStars/progressStarsModel";
import { ProgressStorage } from "../src/features/progressStars/progressStorage";
import type { LevelResult } from "../src/features/level/types";

// Builds a fake finished level with 5 orders (need 4 to pass)
function makeResult(levelNumber: number, firstTryCorrectCount: number, passed: boolean, score: number): LevelResult {
    return {
        levelNumber: levelNumber,
        passed: passed,
        firstTryCorrectCount: firstTryCorrectCount,
        requiredToPass: 4,
        totalOrders: 5,
        score: score,
        records: [],
    };
}

// A fresh controller with 3 levels, like opening the game
function makeController(): ProgressController {
    return new ProgressController(new ProgressModel(3), new ProgressStorage());
}

describe("ProgressController", () => {

    // Start every test with nothing saved
    beforeEach(() => {
        localStorage.clear();
    });

    //starting the game
    it("should start with no progress when nothing is saved", () => {
        const controller = makeController();
        expect(controller.getCompletedLevels()).toEqual([]);
        expect(controller.getTotalStars()).toBe(0);
    });

    //finishing levels
    it("should give back the stars earned when a level is completed", () => {
        const controller = makeController();
        expect(controller.completeLevel(makeResult(1, 5, true, 500))).toBe(3);
        expect(controller.completeLevel(makeResult(2, 4, true, 400))).toBe(2);
        expect(controller.completeLevel(makeResult(3, 2, false, 200))).toBe(1);
    });

    it("should remember the stars for a completed level", () => {
        const controller = makeController();
        controller.completeLevel(makeResult(1, 4, true, 400));
        expect(controller.getStars(1)).toBe(2);
    });

    it("should keep the best stars when a level is replayed worse", () => {
        const controller = makeController();
        controller.completeLevel(makeResult(1, 5, true, 500));
        controller.completeLevel(makeResult(1, 2, false, 200));
        expect(controller.getStars(1)).toBe(3);
    });

    //progress screen
    it("should add up stars and fill the progress bar", () => {
        const controller = makeController();
        controller.completeLevel(makeResult(1, 5, true, 500));
        controller.completeLevel(makeResult(2, 4, true, 400));
        expect(controller.getTotalStars()).toBe(5);
        expect(controller.getPercentComplete()).toBe(67);
        expect(controller.getCompletedLevels().length).toBe(2);
    });

    //saving
    it("should keep progress after a refresh", () => {
        const before = makeController();
        before.completeLevel(makeResult(1, 5, true, 500));

        // A new controller is like reloading the page
        const after = makeController();
        expect(after.getStars(1)).toBe(3);
        expect(after.getTotalStars()).toBe(3);
    });

    it("should erase progress when reset, even after a refresh", () => {
        const controller = makeController();
        controller.completeLevel(makeResult(1, 5, true, 500));
        controller.resetProgress();
        expect(controller.getStars(1)).toBe(0);

        const after = makeController();
        expect(after.getStars(1)).toBe(0);
    });
});