// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { ProgressStorage } from "../src/features/progressStars/progressStorage";
import type { ProgressData } from "../src/features/progressStars/types";

// Same key ProgressStorage uses, so tests can put broken data in directly
const STORAGE_KEY = "fractionFoodTruck.progress";

const sampleData: ProgressData = {
    levels: [
        { levelNumber: 1, stars: 3, bestScore: 500 },
        { levelNumber: 2, stars: 1, bestScore: 200 },
    ],
};

describe("ProgressStorage", () => {

    // Start every test with nothing saved
    beforeEach(() => {
        localStorage.clear();
    });

    //loading with nothing saved
    it("should load empty progress when nothing has been saved", () => {
        const storage = new ProgressStorage();
        expect(storage.load()).toEqual({ levels: [] });
    });

    //saving and loading
    it("should load the same progress that was saved", () => {
        const storage = new ProgressStorage();
        storage.save(sampleData);
        expect(storage.load()).toEqual(sampleData);
    });

    it("should still have the progress with a new storage object, like after a refresh", () => {
        new ProgressStorage().save(sampleData);
        const afterRefresh = new ProgressStorage();
        expect(afterRefresh.load()).toEqual(sampleData);
    });

    it("should replace old progress when saving again", () => {
        const storage = new ProgressStorage();
        storage.save(sampleData);
        storage.save({ levels: [{ levelNumber: 1, stars: 2, bestScore: 300 }] });
        expect(storage.load().levels.length).toBe(1);
        expect(storage.load().levels[0].stars).toBe(2);
    });

    //bad saved data
    it("should load empty progress if the saved text is not valid JSON", () => {
        localStorage.setItem(STORAGE_KEY, "{not json");
        const storage = new ProgressStorage();
        expect(storage.load()).toEqual({ levels: [] });
    });

    it("should load empty progress if levels is not a list", () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ levels: 5 }));
        const storage = new ProgressStorage();
        expect(storage.load()).toEqual({ levels: [] });
    });

    it("should load empty progress if a level has an impossible number of stars", () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ levels: [{ levelNumber: 1, stars: 7, bestScore: 500 }] }));
        const storage = new ProgressStorage();
        expect(storage.load()).toEqual({ levels: [] });
    });

    it("should load empty progress if a level number is not valid", () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ levels: [{ levelNumber: 0, stars: 2, bestScore: 500 }] }));
        const storage = new ProgressStorage();
        expect(storage.load()).toEqual({ levels: [] });
    });

    it("should load empty progress if a score is negative", () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ levels: [{ levelNumber: 1, stars: 2, bestScore: -10 }] }));
        const storage = new ProgressStorage();
        expect(storage.load()).toEqual({ levels: [] });
    });

    //clearing
    it("should load empty progress after clearing", () => {
        const storage = new ProgressStorage();
        storage.save(sampleData);
        storage.clear();
        expect(storage.load()).toEqual({ levels: [] });
    });
});