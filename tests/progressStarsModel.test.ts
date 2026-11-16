import { describe, it, expect } from "vitest";
import { ProgressModel } from "../src/features/progressStars/progressStarsModel";

describe("ProgressModel", () => {

    //constructor
    it("should throw if there are no levels", () => {
        expect(() => new ProgressModel(0)).toThrow();
    });

    it("should throw if the number of levels is not a whole number", () => {
        expect(() => new ProgressModel(2.5)).toThrow();
    });

    //recording levels
    it("should give 0 stars for a level that has not been played", () => {
        const model = new ProgressModel(3);
        expect(model.getStars(2)).toBe(0);
    });

    it("should save stars for a completed level", () => {
        const model = new ProgressModel(3);
        model.recordLevel(1, 2, 400);
        expect(model.getStars(1)).toBe(2);
    });

    it("should keep the higher stars when a level is replayed worse", () => {
        const model = new ProgressModel(3);
        model.recordLevel(1, 3, 500);
        model.recordLevel(1, 1, 200);
        expect(model.getStars(1)).toBe(3);
        expect(model.getCompletedLevels()[0].bestScore).toBe(500);
    });

    it("should update both stars and score when a replay is better at both", () => {
        const model = new ProgressModel(3);
        model.recordLevel(1, 1, 300);
        model.recordLevel(1, 3, 500);
        expect(model.getStars(1)).toBe(3);
        expect(model.getCompletedLevels()[0].bestScore).toBe(500);
    });

    it("should update stars and score separately when only one improves", () => {
        const model = new ProgressModel(3);
        model.recordLevel(1, 2, 500);
        model.recordLevel(1, 3, 300);
        expect(model.getStars(1)).toBe(3);
        expect(model.getCompletedLevels()[0].bestScore).toBe(500);
    });

    it("should throw for a level number outside the game", () => {
        const model = new ProgressModel(3);
        expect(() => model.recordLevel(0, 2, 400)).toThrow();
        expect(() => model.recordLevel(4, 2, 400)).toThrow();
    });

    it("should throw for a level number that is not a whole number", () => {
        const model = new ProgressModel(3);
        expect(() => model.recordLevel(1.5, 2, 400)).toThrow("The levelNumber is not valid or the score is negative.");
    });

    it("should throw for a negative score", () => {
        const model = new ProgressModel(3);
        expect(() => model.recordLevel(1, 2, -10)).toThrow();
    });

    //progress screen
    it("should list completed levels sorted by level number", () => {
        const model = new ProgressModel(3);
        model.recordLevel(3, 1, 200);
        model.recordLevel(1, 3, 500);
        const levels = model.getCompletedLevels();
        expect(levels.length).toBe(2);
        expect(levels[0].levelNumber).toBe(1);
        expect(levels[1].levelNumber).toBe(3);
    });

    it("should add up stars across levels", () => {
        const model = new ProgressModel(3);
        model.recordLevel(1, 3, 500);
        model.recordLevel(2, 2, 400);
        expect(model.getTotalStars()).toBe(5);
    });

    it("should give the percent of levels completed", () => {
        const model = new ProgressModel(4);
        expect(model.getPercentComplete()).toBe(0);
        model.recordLevel(1, 2, 400);
        expect(model.getPercentComplete()).toBe(25);
    });

    //saving
    it("should keep the same progress after saving and loading", () => {
        const original = new ProgressModel(3);
        original.recordLevel(1, 3, 500);
        original.recordLevel(2, 1, 200);

        const restored = new ProgressModel(3);
        restored.loadData(original.toData());

        expect(restored.getStars(1)).toBe(3);
        expect(restored.getStars(2)).toBe(1);
        expect(restored.getTotalStars()).toBe(4);
    });

    it("should not let changes to the returned list affect the model", () => {
        const model = new ProgressModel(3);
        model.recordLevel(1, 1, 200);
        const levels = model.getCompletedLevels();
        levels[0].stars = 3;
        expect(model.getStars(1)).toBe(1);
    });

    it("should not let changes to saved data affect the model", () => {
        const model = new ProgressModel(3);
        model.recordLevel(1, 1, 200);
        const data = model.toData();
        data.levels[0].stars = 3;
        expect(model.getStars(1)).toBe(1);
    });
});