// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { RecipeView } from "../src/features/recipe/RecipeView";
import type { RecipeHandlers } from "../src/features/recipe/RecipeView";
import type { RecipeResult } from "../src/features/recipe/types";

const flour = { ingredient: "flour", numerator: 1, denominator: 4, multiplier: 3 };

function makeHandlers(clicks: string[]): RecipeHandlers {
    return {
        onAdd: () => clicks.push("add"),
        onRemove: () => clicks.push("remove"),
        onCheck: () => clicks.push("check"),
        onNext: () => clicks.push("next"),
    };
}

function click(root: HTMLElement, selector: string): void {
    (root.querySelector(selector) as HTMLButtonElement).click();
}

function getText(root: HTMLElement, selector: string): string {
    return (root.querySelector(selector) as HTMLElement).textContent as string;
}

describe("RecipeView", () => {

    it("should show the recipe and the multiplier", () => {
        const root = document.createElement("div");
        const view = new RecipeView(root, makeHandlers([]));
        view.render(flour, 0, null, 1, 5);

        expect(getText(root, ".recipe-progress")).toBe("Recipe 1 of 5");
        expect(getText(root, ".recipe-prompt")).toBe("The recipe needs 1/4 cup of flour. Make the recipe 3 times bigger!");
    });

    it("should draw one measuring cup for each scoop", () => {
        const root = document.createElement("div");
        const view = new RecipeView(root, makeHandlers([]));
        view.render(flour, 2, null, 1, 5);

        expect(root.querySelectorAll(".recipe-cup").length).toBe(2);
        expect(getText(root, ".recipe-cup")).toBe("1/4 cup");
        expect(getText(root, ".recipe-total")).toBe("You measured: 2/4 cup");
    });

    it("should call the handlers when the buttons are pressed", () => {
        const clicks: string[] = [];
        const root = document.createElement("div");
        const view = new RecipeView(root, makeHandlers(clicks));
        view.render(flour, 0, null, 1, 5);

        click(root, ".recipe-add");
        click(root, ".recipe-remove");
        click(root, ".recipe-check");

        expect(clicks).toEqual(["add", "remove", "check"]);
    });

    it("should show the feedback and hint for a wrong answer", () => {
        const result: RecipeResult = {
            type: "tooFew",
            title: "Not enough flour!",
            message: "You measured 2/4 cup. The bigger recipe needs more. Add more scoops.",
            hint: "3 × 1/4 means 3 groups of 1/4. Multiply the top number by 3 and keep 4 on the bottom.",
        };
        const root = document.createElement("div");
        const view = new RecipeView(root, makeHandlers([]));
        view.render(flour, 2, result, 1, 5);

        expect(getText(root, ".recipe-feedback h2")).toBe("Not enough flour!");
        expect(getText(root, ".recipe-hint")).toContain("Hint: 3 × 1/4 means");
        expect(root.querySelector(".recipe-check")).not.toBeNull();
        expect(root.querySelector(".recipe-next")).toBeNull();
    });

    it("should swap to a Next Recipe button after a correct answer", () => {
        const clicks: string[] = [];
        const result: RecipeResult = {
            type: "correct",
            title: "Delicious!",
            message: "3 × 1/4 = 3/4 cup of flour. That's just right!",
        };
        const root = document.createElement("div");
        const view = new RecipeView(root, makeHandlers(clicks));
        view.render(flour, 3, result, 1, 5);

        expect(root.querySelector(".recipe-check")).toBeNull();
        expect(root.querySelector(".recipe-hint")).toBeNull();
        click(root, ".recipe-next");
        expect(clicks).toEqual(["next"]);
    });

    it("should show the finished screen with Play Again", () => {
        let played = false;
        const root = document.createElement("div");
        const view = new RecipeView(root, makeHandlers([]));
        view.showFinished(() => { played = true; });

        expect(getText(root, "h1")).toBe("All recipes done!");
        click(root, ".recipe-play-again");
        expect(played).toBe(true);
    });
});