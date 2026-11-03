import { SubtractionFeedbackView } from "../feedback/SubtractionFeedbackView";
// Import the existing plate components.
import { PlateModel } from "../plate/PlateModel";
import { PlateController } from "../plate/PlateController";
import { PlateView } from "../plate/PlateView";

// Import shared feedback and subtraction order creation.
import { FeedbackModel } from "../feedback/FeedbackModel";
import { FeedbackController } from "../feedback/FeedbackController";
import { generateSubtractionOrder } from "./GenerateSubtractionOrder";

// Import styles scoped to the subtraction screen.
import "./SubtractionGame.css";

// Connect subtraction orders, dragging, and shared feedback.
export function startSubtractionGame(app: HTMLElement): void {
  // Keep the customer and random order stable until Next Order is selected.
  const customers = ["Joe", "Maya", "Sam"]; // Practice customer names.
  let customerIndex = 0; // Current customer.
  let order = generateSubtractionOrder(); // Current random subtraction order.

  // Keep controls outside the shared canvas.
  app.innerHTML = `
    <main class="subtraction-game">
      <header>
        <h1>Fraction Food Truck</h1>
        <p>Move slices from the tray to the return plate to take them away.</p>
        <nav aria-label="Practice navigation">
          <a href="./">Back to pizza practice</a>
        </nav>
      </header>
      <section class="subtraction-order" aria-label="Customer order">
        <p id="customer-name"></p>
        <h2 id="order-equation"></h2>
        <p id="order-request"></p>
      </section>
      <div class="subtraction-canvas">
        <div id="plate" role="group" aria-label="Slice tray and return plate"></div>
      </div>
      <div class="subtraction-actions">
        <button id="check-order" type="button">Check Order</button>
        <button id="reset-order" type="button">Reset Order</button>
      </div>
      <section id="order-feedback" class="subtraction-feedback" hidden
        aria-live="polite" aria-atomic="true">
        <h2 id="feedback-title"></h2>
        <p id="feedback-message"></p>
        <p id="solved-equation" class="subtraction-equation" hidden></p>
        <section id="order-explanation" aria-label="Step-by-step explanation" hidden></section>
        <button id="feedback-action" type="button"></button>
      </section>
    </main>
  `;

  // Require each control when connecting the screen.
  function element<T extends HTMLElement>(selector: string): T {
    const node = app.querySelector<T>(selector); // Matching screen element.
    if (!node) throw new Error(`Missing subtraction control: ${selector}`);
    return node;
  }

  const view = new PlateView("plate"); // Shared pizza canvas.
  const plate = new PlateModel(order.denominator); // Authoritative slice state.
  const controller = new PlateController(); // Shared drag controller.
  const feedback = new FeedbackController(new FeedbackModel(), new SubtractionFeedbackView(app)); // Shared feedback state.
  const checkButton = element<HTMLButtonElement>("#check-order"); // Answer submission.
  const actionButton = element<HTMLButtonElement>("#feedback-action"); // Retry or next action.

  // Connect the same plate to drawing and answer checking.
  controller.setModel(plate);
  controller.setView(view);
  view.setController(controller);

  // Initialize or reset an order without carrying over previous state.
  function startOrder(newOrder = true): void {
    const customer = customers[customerIndex]; // Current customer name.
    if (newOrder) feedback.startNewOrder();
    else feedback.closeFeedback();
    controller.startSubtractionOrder(order);
    view.setCustomerName(customer);
    view.setInteractionEnabled(true);
    element("#customer-name").textContent = `Order for ${customer}`;
    element("#order-equation").textContent =
      `${order.initialNumerator}/${order.denominator} − ${order.subtractNumerator}/${order.denominator} = ?`;
    element("#order-request").textContent =
      `${customer} has ${order.initialNumerator}/${order.denominator} of a pizza. Take away ${order.subtractNumerator}/${order.denominator}. How much is left in the tray?`;
    checkButton.disabled = false;
  }

  // Submit the actual remaining amount and show the existing feedback.
  checkButton.addEventListener("click", () => {
    if (feedback.getCurrentFeedback()) return;
    const result = controller.submitSubtractionAnswer(); // Actual plate answer.
    feedback.showFeedback(order, controller.getRemainingSlices(), result);
    checkButton.disabled = true;
    view.setInteractionEnabled(false);
  });

  // Continue to a new order or resume the unchanged plate.
  actionButton.addEventListener("click", () => {
    const current = feedback.getCurrentFeedback(); // Current feedback state.
    if (!current) return;
    if (current.type === "correct") {
      // Generate a fresh order only after completing the current one.
      customerIndex = (customerIndex + 1) % customers.length;
      order = generateSubtractionOrder();
      startOrder();
    } else {
      feedback.closeFeedback();
      checkButton.disabled = false;
      view.setInteractionEnabled(true);
    }
    checkButton.focus();
  });

  // Restart the current order with its original slice count.
  element("#reset-order").addEventListener("click", () => {
    // Resetting slices is still the same order; preserve its learning progress.
    startOrder(false);
    checkButton.focus();
  });
  startOrder();
}
