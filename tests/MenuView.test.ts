// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { MenuView } from "../src/features/mainMenu/MenuView";

// Makes an empty container and a menu that draws into it
function makeView(): { container: HTMLElement; view: MenuView } {
    const container = document.createElement("div");
    return { container: container, view: new MenuView(container) };
}

describe("MenuView", () => {

    it("should show the game's title", () => {
        const { container, view } = makeView();
        view.render(0, function () {}, function () {});

        expect(container.querySelector(".menu-title")?.textContent).toBe("Fraction Food Truck");
    });

    it("should show the student's total stars", () => {
        const { container, view } = makeView();
        view.render(5, function () {}, function () {});

        expect(container.querySelector(".menu-stars")?.textContent).toBe("⭐ 5 stars");
    });

    it("should say star instead of stars for exactly 1", () => {
        const { container, view } = makeView();
        view.render(1, function () {}, function () {});

        expect(container.querySelector(".menu-stars")?.textContent).toBe("⭐ 1 star");
    });

    it("should call onPlay when Play is clicked", () => {
        const { container, view } = makeView();
        let played = false;
        view.render(0, function () { played = true; }, function () {});

        container.querySelector<HTMLButtonElement>(".menu-play")?.click();
        expect(played).toBe(true);
    });

    it("should call onProgress when My Progress is clicked", () => {
        const { container, view } = makeView();
        let opened = false;
        view.render(0, function () {}, function () { opened = true; });

        container.querySelector<HTMLButtonElement>(".menu-progress")?.click();
        expect(opened).toBe(true);
    });

    it("should replace the old screen instead of adding a second one", () => {
        const { container, view } = makeView();
        view.render(0, function () {}, function () {});
        view.render(0, function () {}, function () {});

        expect(container.querySelectorAll(".menu-page").length).toBe(1);
    });

    it("should show a Recipe Practice button that calls onRecipe", () => {
        const { container, view } = makeView();
        let opened = false;
        view.render(0, function () {}, function () {}, function () { opened = true; });

        const recipe = container.querySelector(".menu-recipe") as HTMLButtonElement;
        expect(recipe.textContent).toBe("Recipe Practice");
        recipe.click();
        expect(opened).toBe(true);
    });

    it("should not show the Recipe Practice button without onRecipe", () => {
        const { container, view } = makeView();
        view.render(0, function () {}, function () {});

        expect(container.querySelector(".menu-recipe")).toBeNull();
    });
});