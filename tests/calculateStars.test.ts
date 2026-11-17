import { describe, it, expect } from "vitest";
import { calculateStars } from "../src/features/progressStars/calculateStars";
import type { LevelResult } from "../src/features/level/types";

// Builds a fake finished level with 5 orders (need 3 to pass)
function makeResult(firstTryCorrectCount: number, passed: boolean): LevelResult {
    return {
        levelNumber: 1,
        passed: passed,
        firstTryCorrectCount: firstTryCorrectCount,
        requiredToPass: 3,
        totalOrders: 5,
        score: 500,
        records: [],
    };
}

describe("calculateStars", () => {
    it("should give 3 stars when every order is correct on the first try", () => {
        expect(calculateStars(makeResult(5, true))).toBe(3);
    });

    it("should give 2 stars when the level is passed but not perfect", () => {
        expect(calculateStars(makeResult(4, true))).toBe(2);
        expect(calculateStars(makeResult(3, true))).toBe(2);
    });

    it("should give 1 star when the level is not passed", () => {
        expect(calculateStars(makeResult(1, false))).toBe(1);
        expect(calculateStars(makeResult(2, false))).toBe(1);
    });
});