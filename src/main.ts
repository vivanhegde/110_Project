import { PlateView } from "./features/plate/PlateView";
import { PlateModel } from "./features/plate/PlateModel";
import { PlateController } from "./features/plate/PlateController";

// Import the subtraction screen composition.
import { startSubtractionGame } from "./features/pizza/SubtractionGame";

const app = document.getElementById("app");

if (!app) {
  throw new Error("App container not found");
}

// Keep the original demo as the default page.
if (new URLSearchParams(window.location.search).get("mode") !== "subtraction") {
  app.innerHTML = `
    <h1>Fraction Food Truck</h1>
    <p>Welcome to the pizza fraction game!</p>
    <p><button id="start-subtraction" type="button">Subtraction Practice</button></p>
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

  // Open subtraction only when the student chooses it.
  app.querySelector("#start-subtraction")?.addEventListener("click", () => {
    window.location.search = "?mode=subtraction";
  });
} else {
  // Start subtraction with the shared plate components.
  startSubtractionGame(app);
}
