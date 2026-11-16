import type { ProgressData } from "./types";

// The name progress is saved under in the browser
const STORAGE_KEY = "fractionFoodTruck.progress";

// Checks that something loaded from storage really looks like ProgressData.
// Saved data can be missing, edited by hand, or from an older version of the game,
// so we never trust it without checking.
function isValidProgressData(value: unknown): value is ProgressData {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const levels = (value as { levels?: unknown }).levels;
    if (!Array.isArray(levels)) {
        return false;
    }

    // Every record needs a real level number, 0-3 stars, and a score that isn't negative
    for (let i = 0; i < levels.length; i++) {
        const record = levels[i];

        if (typeof record !== "object" || record === null) {
            return false;
        }

        if (!Number.isInteger(record.levelNumber) || record.levelNumber < 1) {
            return false;
        }

        if (record.stars !== 0 && record.stars !== 1 && record.stars !== 2 && record.stars !== 3) {
            return false;
        }

        if (typeof record.bestScore !== "number" || record.bestScore < 0) {
            return false;
        }
    }

    return true;
}

export class ProgressStorage {

    //Saves progress so it survives a page refresh
    public save(data: ProgressData): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
        catch {
            // Some browsers block storage (like private mode). The game still works, it just won't save.
        }
    }

    //Loads saved progress, or empty progress if nothing valid is saved
    public load(): ProgressData {
        let text: string | null = null;
        try {
            text = localStorage.getItem(STORAGE_KEY);
        }
        catch {
            return { levels: [] };
        }

        // Nothing saved yet (first time playing)
        if (text === null) {
            return { levels: [] };
        }

        // The saved text might not be valid JSON, and JSON.parse throws if it isn't
        let parsed: unknown;
        try {
            parsed = JSON.parse(text);
        }
        catch {
            return { levels: [] };
        }

        // Valid JSON, but the wrong shape (like stars: 7)
        if (!isValidProgressData(parsed)) {
            return { levels: [] };
        }

        return parsed;
    }

    //Deletes saved progress (used by tests, and later a reset button)
    public clear(): void {
        try {
            localStorage.removeItem(STORAGE_KEY);
        }
        catch {
            // Nothing to do if storage is blocked
        }
    }
}