import { describe, it, expect } from "vitest";
import { RecipeModel } from "../src/features/recipe/RecipeModel";

const flour = { ingredient: "flour", numerator: 1, denominator: 4, multiplier: 3 };
const milk = { ingredient: "milk", numerator: 2, denominator: 3, multiplier: 2 };

function addScoops(model: RecipeModel, count: number): void {
    for (let i = 0; i < count; i++) {
        model.addScoop();
    }
}

describe("RecipeModel", () => {

    it("should start with zero scoops", () => {
        const model = new RecipeModel(flour);
        expect(model.getScoops()).toBe(0);
    });

    it("should add and remove scoops", () => {
        const model = new RecipeModel(flour);
        addScoops(model, 3);
        model.removeScoop();
        expect(model.getScoops()).toBe(2);
    });

    it("should not go below zero scoops", () => {
        const model = new RecipeModel(flour);
        model.removeScoop();
        expect(model.getScoops()).toBe(0);
    });

    it("should multiply the top number and keep the bottom number", () => {
        expect(new RecipeModel(flour).getAnswerNumerator()).toBe(3);
        expect(new RecipeModel(milk).getAnswerNumerator()).toBe(4);
    });

    it("should accept the correct amount", () => {
        const model = new RecipeModel(flour);
        addScoops(model, 3);
        const result = model.checkAnswer();

        expect(result.type).toBe("correct");
        expect(result.message).toBe("3 × 1/4 = 3/4 cup of flour. That's just right!");
        expect(result.hint).toBeUndefined();
    });

    it("should accept an answer bigger than one cup", () => {
        const model = new RecipeModel(milk);
        addScoops(model, 4);
        const result = model.checkAnswer();

        expect(result.type).toBe("correct");
        expect(result.message).toContain("2 × 2/3 = 4/3 cup of milk");
    });

    it("should say too few with a hint when there is not enough", () => {
        const model = new RecipeModel(flour);
        addScoops(model, 2);
        const result = model.checkAnswer();

        expect(result.type).toBe("tooFew");
        expect(result.title).toBe("Not enough flour!");
        expect(result.message).toContain("You measured 2/4 cup");
        expect(result.hint).toBe("3 × 1/4 means 3 groups of 1/4. Multiply the top number by 3 and keep 4 on the bottom.");
    });

    it("should say too many with a hint when there is too much", () => {
        const model = new RecipeModel(flour);
        addScoops(model, 5);
        const result = model.checkAnswer();

        expect(result.type).toBe("tooMany");
        expect(result.title).toBe("Too much flour!");
        expect(result.hint).toContain("Multiply the top number by 3");
    });

    it("should count incorrect attempts but not correct ones", () => {
        const model = new RecipeModel(flour);
        model.checkAnswer();
        addScoops(model, 5);
        model.checkAnswer();
        expect(model.getIncorrectAttempts()).toBe(2);

        model.removeScoop();
        model.removeScoop();
        model.checkAnswer();
        expect(model.getIncorrectAttempts()).toBe(2);
    });

    it("should reject invalid recipes", () => {
        expect(() => new RecipeModel({ ingredient: "flour", numerator: 1, denominator: 1, multiplier: 3 })).toThrow("Invalid recipe");
        expect(() => new RecipeModel({ ingredient: "flour", numerator: 1, denominator: 13, multiplier: 3 })).toThrow("Invalid recipe");
        expect(() => new RecipeModel({ ingredient: "flour", numerator: 4, denominator: 4, multiplier: 3 })).toThrow("Invalid recipe");
        expect(() => new RecipeModel({ ingredient: "flour", numerator: 1, denominator: 4, multiplier: 1 })).toThrow("Invalid recipe");
        expect(() => new RecipeModel({ ingredient: "flour", numerator: 1, denominator: 4, multiplier: 2.5 })).toThrow("Invalid recipe");
    });
});