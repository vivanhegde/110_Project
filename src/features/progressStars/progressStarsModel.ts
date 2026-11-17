import { calculateStars } from "./calculateStars";
import type { LevelProgressRecord, ProgressData, StarCount } from "./types";

export class ProgressModel {
    private totalLevels: number;
    private levels: LevelProgressRecord[] = [];

    public constructor(totalLevels: number) {
        if ((totalLevels < 1) || (!Number.isInteger(totalLevels))){
            throw new Error("There needs to be at least 1 level and levels are whole numbers.");
        }
        this.totalLevels = totalLevels;
    }

    //Called when a level is finished
    public recordLevel(levelNumber: number, stars: StarCount, score: number): void {
        if ((levelNumber < 1) || (levelNumber > this.totalLevels) || (!Number.isInteger(levelNumber)) || (score < 0)){
            throw new Error("The levelNumber is not valid or the score is negative.");
        }

        //find the level in levels if it exists
        const record = this.levels.find(r => r.levelNumber === levelNumber);
        //if it doesnt exist add the level to levels
        if (record == undefined) {
            this.levels.push({
                levelNumber: levelNumber,
                stars: stars,
                bestScore: score,
            });
        }
        //if it does exist update the stars or score if they have improved
        else{
            if (record.bestScore < score){
                record.bestScore = score;
            }
            if (record.stars < stars){
                record.stars = stars;
            }
        }
    }

    //returns the number of stars (saved per level in levels)
    public getStars(levelNumber: number): StarCount {
        const record = this.levels.find(r => r.levelNumber === levelNumber);
        if (record === undefined) {
            return 0;
        }
        return record.stars;
    }

    //Adds up the stars from every completed level
    public getTotalStars(): number {
        let total = 0;
        for (let i = 0; i < this.levels.length; i++) {
            total = total + this.levels[i].stars;
        }
        return total;
    }

    //returns a copy of all the levels 
    public getCompletedLevels(): LevelProgressRecord[]{
        const copy = this.levels.map(r => ({ ...r }));
        copy.sort((a, b) => a.levelNumber - b.levelNumber);
        return copy;
    }

    //returns the percent of levels that have been completed
    public getPercentComplete(): number{
        let completed = 0;
        for(let i = 0; i < this.levels.length; i++){
            if(this.levels[i].stars > 0){
                completed ++;
            }
        }
        const percent = Math.round((completed/this.totalLevels)*100);
        return percent;
    }

    //Returns everything to save
    public toData(): ProgressData {
        return {
            levels: this.levels.map(r => ({ ...r })),
        };
    }

    //Replaces the current progress with saved data
    public loadData(data: ProgressData): void {
        this.levels = data.levels.map(r => ({ ...r }));
    }
}