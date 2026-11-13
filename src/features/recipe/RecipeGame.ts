import { RecipeModel } from "./RecipeModel";
import { RecipeController } from "./RecipeController";
import { RecipeView } from "./RecipeView";
import { RECIPES } from "./recipes";
import type { RecipeResult } from "./types";

import "./RecipeGame.css";

export function startRecipeGame(app: HTMLElement): void {
  let index = 0;
  let controller = new RecipeController(new RecipeModel(RECIPES[index]));
  let result: RecipeResult | null = null;

  const view = new RecipeView(app, {
    onAdd: () => {
      controller.addScoop();
      result = null;
      draw();
    },
    onRemove: () => {
      controller.removeScoop();
      result = null;
      draw();
    },
    onCheck: () => {
      result = controller.checkAnswer();
      draw();
    },
    onNext: () => {
      index++;
      if (index >= RECIPES.length) {
        view.showFinished(() => startRecipeGame(app));
        return;
      }
      controller = new RecipeController(new RecipeModel(RECIPES[index]));
      result = null;
      draw();
    },
  });

  function draw(): void {
    view.render(controller.getRecipe(), controller.getScoops(), result, index + 1, RECIPES.length);
  }

  draw();
}