import { describe, it, expect } from "vitest";
import { RecipeModel } from "../src/features/recipe/RecipeModel";
import { RecipeController } from "../src/features/recipe/RecipeController";
import { RECIPES } from "../src/features/recipe/recipes";

const flour = { ingredient: "flour", numerator: 1, denominator: 4, multiplier: 3 };

describe("RecipeController", () => {

    it("should update the model when scoops are added and removed", () => {
        const model = new RecipeModel(flour);
        const controller = new RecipeController(model);

        controller.addScoop();
        controller.addScoop();
        controller.removeScoop();

        expect(model.getScoops()).toBe(1);
        expect(controller.getScoops()).toBe(1);
    });

    it("should return the model's result when checking", () => {
        const controller = new RecipeController(new RecipeModel(flour));
        controller.addScoop();
        controller.addScoop();
        controller.addScoop();

        expect(controller.checkAnswer().type).toBe("correct");
    });

    it("should report incorrect attempts from the model", () => {
        const controller = new RecipeController(new RecipeModel(flour));
        controller.checkAnswer();

        expect(controller.getIncorrectAttempts()).toBe(1);
    });

    it("should give back the recipe it was created with", () => {
        const controller = new RecipeController(new RecipeModel(flour));
        expect(controller.getRecipe()).toEqual(flour);
    });

    it("should accept every recipe in the recipe list", () => {
        for (const recipe of RECIPES) {
            expect(() => new RecipeController(new RecipeModel(recipe))).not.toThrow();
        }
    });
});