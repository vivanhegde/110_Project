export type StarCount = 0 | 1 | 2 | 3;

export interface LevelProgressRecord {
    levelNumber: number;
    stars: StarCount;
    bestScore: number;
}

export interface ProgressData {
    levels: LevelProgressRecord[];
}