import { PlateView } from "./features/plate/PlateView";
import { PlateModel } from "./features/plate/PlateModel";
import { PlateController } from "./features/plate/PlateController";

const app = document.getElementById("app");

if (!app) {
  throw new Error("App container not found");
}

app.innerHTML = `
  <h1>Fraction Food Truck</h1>
  <p>Welcome to the pizza fraction game!</p>
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