import type { LevelResult } from "../level/types";
import type { StarCount } from "./types";

// Interprets a finished level's result as 1–3 stars
export function calculateStars(result: LevelResult): StarCount {
    let stars: StarCount = 0;
    //if the user gets all orders right on the first try they get all 3 stars
    if (result.firstTryCorrectCount === result.totalOrders){
        stars = 3;
    }
    //if they passed the level they get 2 stars
    else if (result.passed){
        stars = 2;
    }
    //they get 1 star for just completing the level
    else {
        stars = 1;
    }
    return stars;
}