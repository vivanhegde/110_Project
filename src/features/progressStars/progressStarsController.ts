import { ProgressModel } from "./progressStarsModel";
import { ProgressStorage } from "./progressStorage";
import { calculateStars } from "./calculateStars";
import type { LevelResult } from "../level/types";
import type { LevelProgressRecord, StarCount } from "./types";

export class ProgressController {
    private model: ProgressModel;
    private storage: ProgressStorage;

    //Loads any saved progress as soon as the controller is created,
    //so stars from before a refresh show up right away
    public constructor(model: ProgressModel, storage: ProgressStorage) {
        this.model = model;
        this.storage = storage;
        this.model.loadData(this.storage.load());
    }

    //Called when a level finishes. Works out the stars, remembers them, and saves.
    //Returns the stars so the results screen can show them.
    public completeLevel(result: LevelResult): StarCount {
        const stars = calculateStars(result);
        this.model.recordLevel(result.levelNumber, stars, result.score);
        this.storage.save(this.model.toData());
        return stars;
    }

    //Best stars for one level (0 if not played yet)
    public getStars(levelNumber: number): StarCount {
        return this.model.getStars(levelNumber);
    }

    //Completed levels for the progress screen, sorted by level number
    public getCompletedLevels(): LevelProgressRecord[] {
        return this.model.getCompletedLevels();
    }

    //All stars added together
    public getTotalStars(): number {
        return this.model.getTotalStars();
    }

    //How full the progress bar should be (0-100)
    public getPercentComplete(): number {
        return this.model.getPercentComplete();
    }

    //Erases all progress, both in the game and in saved storage
    public resetProgress(): void {
        this.model.loadData({ levels: [] });
        this.storage.clear();
    }
}