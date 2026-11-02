
import { PizzaOrderModel } from "./PizzaOrderModel";
import { PizzaOrderController } from "./PizzaOrderController";
import { PizzaOrderView } from "./PizzaOrderView";

import { PlateModel } from "../plate/PlateModel";
import { PlateController } from "../plate/PlateController";
import { PlateView } from "../plate/PlateView";

import type { PizzaOrder } from "./types";

import "./AdditionGame.css";

// Five orders for User Story 1.
// All orders use eight equal pizza slices.
const ORDERS: PizzaOrder[] = [
  {
    customerName: "Kayla",
    numerator: 5,
    denominator: 8,
    firstNumerator: 2,
    secondNumerator: 3,
  },
  {
    customerName: "Mia",
    numerator: 3,
    denominator: 8,
    firstNumerator: 1,
    secondNumerator: 2,
  },
  {
    customerName: "Leo",
    numerator: 6,
    denominator: 8,
    firstNumerator: 3,
    secondNumerator: 3,
  },
  {
    customerName: "Sam",
    numerator: 6,
    denominator: 8,
    firstNumerator: 2,
    secondNumerator: 4,
  },
  {
    customerName: "Ava",
    numerator: 5,
    denominator: 8,
    firstNumerator: 1,
    secondNumerator: 4,
  },
];

export function startAdditionGame(app: HTMLElement): void {
  // Create the Pizza Order MVC components.
  const model = new PizzaOrderModel(ORDERS[0]);

  const controller = new PizzaOrderController(
    model,
    ORDERS
  );

  const view = new PizzaOrderView(app);

  // Render the main page before initializing the plate.
  view.render();

  // Reuse Charlie's drag-and-drop components.
  const plateModel = new PlateModel(
    ORDERS[0].denominator
  );

  const plateController = new PlateController();
  const plateView = new PlateView("addition-plate");

  plateController.setModel(plateModel);
  plateController.setView(plateView);
  plateView.setController(plateController);

  // Initialize the current pizza order.
  function startOrder(): void {
    const order = controller.getCurrentOrder();

    // Reset the plate for the new order.
    plateController.startOrder(order.denominator);

    plateView.setCustomerName(
      order.customerName ?? "Customer"
    );

    plateView.setInteractionEnabled(true);

    // Update the view.
    view.showOrder(order);

    view.showProgress(
      controller.getOrderIndex() + 1,
      controller.getTotalOrders()
    );

    view.showScore(controller.getScore());
    view.resetControls();

    view.showMessage(
      `Ready, chef? Every pizza has ` +
      `${order.denominator} equal slices. ` +
      `Move slices onto your plate and check your order.`
    );
  }

  // Check the amount the student placed on the plate.
  view.onCheck(() => {
    if (controller.isOrderCompleted()) return;

    const order = controller.getCurrentOrder();

    // Get the actual slice count from Charlie's plate.
    const selected = plateController.getSlicesOnPlate();

    // Pass the answer into your PizzaOrderController.
    controller.selectSlice(selected);

    const result = controller.submitAnswer();

    // Display the result using PizzaOrderView.
    view.showSelectedSlices(
      selected,
      order.denominator
    );

    view.showResult(result, order, selected);

    if (result.correct) {
      view.showScore(controller.getScore());

      plateView.setInteractionEnabled(false);

      view.showCompletedOrder(
        controller.isLastOrder()
      );
    }
  });

  // Provide a fraction addition hint.
  view.onHint(() => {
    view.showHint(controller.getCurrentOrder());
  });

  // Move to the next order.
  view.onNext(() => {
    if (!controller.isOrderCompleted()) return;

    // If all orders are finished, show the final score.
    if (controller.isLastOrder()) {
      view.showCompletion(
        controller.getScore(),
        controller.getTotalOrders()
      );

      view.onReplay(() => {
        startAdditionGame(app);
      });

      return;
    }

    // Advance the controller to the next order.
    if (controller.nextOrder()) {
      startOrder();
    }
  });

  // Start the first order.
  startOrder();
}
