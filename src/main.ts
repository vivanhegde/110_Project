import { PlateView } from "./features/plate/PlateView";
import { PlateModel } from "./features/plate/PlateModel";
import { PlateController } from "./features/plate/PlateController";

import { startSubtractionGame } from "./features/pizza/SubtractionGame";
import { startAdditionGame } from "./features/pizza/AdditionGame";
import { startGame } from "./features/game/GameScreen";
import { startRecipeGame } from "./features/recipe/RecipeGame";

const app = document.getElementById("app");

if (!app) {
  throw new Error("App container not found");
}

const mode = new URLSearchParams(window.location.search)
  .get("mode");

if (mode === "addition") {
  startAdditionGame(app);

} else if (mode === "subtraction") {
  startSubtractionGame(app);

} else if (mode === "recipe") {
  startRecipeGame(app);

} else if (mode === "demo") {
  app.innerHTML = `
    <h1>Fraction Food Truck</h1>
    <p>Welcome to the pizza fraction game!</p>

    <p><a href="?mode=addition">Addition Practice</a></p>
    <p><a href="?mode=subtraction">Subtraction Practice</a></p>

    <div id="plate"></div>
  `;

  const denominator = 8;
  const view = new PlateView("plate");
  const model = new PlateModel(denominator);
  const controller = new PlateController();

  controller.setModel(model);
  controller.setView(view);
  view.setController(controller);

  controller.startOrder(denominator);
  view.setCustomerName("Joe");

} else {
  startGame(app);
}