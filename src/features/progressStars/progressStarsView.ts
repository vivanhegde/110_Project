import type { LevelProgressRecord } from "./types";
import { starsText } from "./starsText";

/*
  ProgressView
  This class only draws the progress screen (US-8):
    - a title
    - a progress bar and "Total stars: 5"
    - one row per completed level: "Level 1   ★★★   Best score: 500"
    - a Back button

  Like LevelView, it never decides anything. The controller gives it
  the numbers and it puts them on the page.
*/
export class ProgressView {
    private container: HTMLElement; // where the progress screen gets drawn

    public constructor(container: HTMLElement) {
        this.container = container;
    }

    // Draws the whole progress screen.
    // onBack is a function given to us. We just call it when Back is clicked.
    public render(levels: LevelProgressRecord[], totalStars: number, percentComplete: number, onBack: () => void): void {
        // Clear whatever was on the screen before
        this.container.innerHTML = "";

        // The whole screen: cream background and the same top bar as the menu and map
        const screen = document.createElement("div");
        screen.className = "progress-screen";

        const header = document.createElement("header");
        header.className = "progress-header";

        const logo = document.createElement("div");
        logo.className = "progress-logo";
        logo.textContent = "🍕 Fraction Food Truck";

        header.appendChild(logo);
        screen.appendChild(header);

        const page = document.createElement("div");
        page.className = "progress-page";

        const title = document.createElement("h1");
        title.textContent = "My Progress";

        // The progress bar is an outer box with an inner "fill" box, same as LevelView's
        const bar = document.createElement("div");
        bar.className = "progress-bar";

        const fill = document.createElement("div");
        fill.className = "progress-fill";
        fill.style.width = percentComplete + "%";
        bar.appendChild(fill);

        // "Total stars: 5"
        const total = document.createElement("p");
        total.className = "progress-total";
        total.textContent = "Total stars: " + totalStars;

        page.appendChild(title);
        page.appendChild(bar);
        page.appendChild(total);

        // Nothing finished yet gets a friendly message instead of an empty list
        if (levels.length === 0) {
            const empty = document.createElement("p");
            empty.className = "progress-empty";
            empty.textContent = "No levels completed yet. Finish a level to earn stars!";
            page.appendChild(empty);
        }
        else {
            const list = document.createElement("ul");
            list.className = "progress-levels";

            for (let i = 0; i < levels.length; i++) {
                const record = levels[i];

                const item = document.createElement("li");

                const name = document.createElement("span");
                name.className = "progress-level-name";
                name.textContent = "Level " + record.levelNumber;

                const stars = document.createElement("span");
                stars.className = "progress-level-stars";
                stars.textContent = starsText(record.stars);

                const score = document.createElement("span");
                score.className = "progress-level-score";
                score.textContent = "Best score: " + record.bestScore;

                item.appendChild(name);
                item.appendChild(stars);
                item.appendChild(score);
                list.appendChild(item);
            }

            page.appendChild(list);
        }

        const back = document.createElement("button");
        back.className = "progress-back";
        back.textContent = "Back";
        back.addEventListener("click", onBack);
        page.appendChild(back);

        screen.appendChild(page);
        this.container.appendChild(screen);
    }
}