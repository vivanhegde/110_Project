import type { StarCount } from "./types";

// Turns a star count into text like "★★☆" (filled stars, then empty ones up to 3)
export function starsText(stars: StarCount): string {
    let text = "";
    for (let i = 1; i <= 3; i++) {
        if (i <= stars) {
            text = text + "★";
        }
        else {
            text = text + "☆";
        }
    }
    return text;
}