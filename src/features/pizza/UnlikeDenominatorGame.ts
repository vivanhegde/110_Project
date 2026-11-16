/**
 * Connects US11 practice to the shared pizza, cutting, and feedback features.
 * Displays the original fractions and explains their conversion in text.
 * Coordinates cutting controls, live answers, hints, retry, and order reset.
 * Generates the next question after the current answer has been completed.
 */

// Reuse the existing plate and feedback features.
import { PlateModel } from "../plate/PlateModel";
import { PlateController } from "../plate/PlateController";
import { PlateView } from "../plate/PlateView";
import { FeedbackModel } from "../feedback/FeedbackModel";
import { FeedbackController } from "../feedback/FeedbackController";
import { SubtractionFeedbackView } from "../feedback/SubtractionFeedbackView";
import { UnlikeDenominatorOrderController } from "./UnlikeDenominatorOrderController";
import { generateUnlikeDenominatorOrder } from "./GenerateUnlikeDenominatorOrder";

// Reuse the existing practice layout and controls.
import "./SubtractionGame.css";

// Mount unlike-denominator practice without changing the shared modules.
export function startUnlikeDenominatorGame(app: HTMLElement): void {
  app.innerHTML = `
    <main class="subtraction-game">
      <header>
        <h1>Unlike Denominator Practice</h1>
        <p>Choose equal-sized slices, then complete the fraction order.</p>
        <nav aria-label="Practice navigation">
          <a href="./">Back to pizza practice</a>
        </nav>
      </header>
      <section class="subtraction-order" aria-label="Current order">
        <p>Fraction order</p>
        <h2 id="order-equation"></h2>
        <p id="order-request"></p>
      </section>
      <section aria-label="Cutting controls">
        <h2 id="stage-title">Choose your cuts</h2>
        <p id="cut-status" role="status"></p>
        <div class="subtraction-actions">
          <button id="fewer-cuts" type="button">Fewer Slices</button>
          <button id="more-cuts" type="button">More Slices</button>
          <button id="confirm-cuts" type="button">Confirm Cuts</button>
          <button id="change-cuts" type="button" hidden>Change Cuts</button>
        </div>
        <p id="cut-feedback" role="status" aria-atomic="true" hidden></p>
      </section>
      <p id="move-instruction"></p>
      <div class="subtraction-canvas">
        <div id="plate" role="group" aria-label="Slice tray and answer plate"></div>
      </div>
      <p id="live-fraction" role="status"></p>
      <div class="subtraction-actions">
        <button id="check-order" type="button">Check Order</button>
        <button id="reset-order" type="button">Reset Order</button>
        <button id="hint-button" type="button" aria-expanded="false"
          aria-controls="conversion-hint">Hint</button>
      </div>
      <section id="conversion-hint" class="subtraction-order" hidden>
        <h2>Find a common denominator</h2>
        <p id="hint-denominator"></p>
        <p id="hint-conversion"></p>
        <p id="hint-operation"></p>
      </section>
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

  // Require each element before connecting its behavior.
  function element<T extends HTMLElement>(selector: string): T {
    const node = app.querySelector<T>(selector); // Matching page element.
    if (!node) throw new Error(`Missing US11 control: ${selector}`);
    return node;
  }

  const view = new PlateView("plate"); // Shared pizza drawing.
  const plate = new PlateController(); // Shared cutting and dragging.
  plate.setModel(new PlateModel(2));
  plate.setView(view);
  view.setController(plate);

  const controller = new UnlikeDenominatorOrderController(plate, view); // US11 flow.
  const feedback = new FeedbackController(
    new FeedbackModel(),
    new SubtractionFeedbackView(app),
  ); // Shared answer feedback.
  const button = (id: string) => element<HTMLButtonElement>(`#${id}`); // Button lookup.
  let hintVisible = false; // Current hint visibility.
  let cutMessage = ""; // Feedback for the submitted denominator.

  // Keep the original question and conversion guidance together.
  function renderQuestion(): void {
    const order = controller.getOrder(); // Active question.
    const symbol = order.operation === "addition" ? "+" : "−"; // Operation symbol.
    element("#order-equation").textContent =
      `${order.firstNumerator}/${order.firstDenominator} ${symbol} ${order.secondNumerator}/${order.secondDenominator} = ?`;
    element("#order-request").textContent = order.operation === "addition"
      ? "Combine the two amounts on your order plate."
      : "Start with the first amount. Move the second amount to the return plate.";
    element("#hint-denominator").textContent =
      `The least common denominator of ${order.firstDenominator} and ${order.secondDenominator} is ${order.commonDenominator}.`;
    element("#hint-conversion").textContent =
      `${order.firstNumerator}/${order.firstDenominator} = ${order.convertedFirstNumerator}/${order.commonDenominator}; ` +
      `${order.secondNumerator}/${order.secondDenominator} = ${order.convertedSecondNumerator}/${order.commonDenominator}.`;
    element("#hint-operation").textContent = order.operation === "addition"
      ? "Add the converted numerators and keep the common denominator."
      : "Subtract the converted numerators and keep the common denominator.";
  }

  // Refresh controls from the actual controller and feedback state.
  function refresh(): void {
    const cutting = controller.getStage() === "cutting"; // Current interaction stage.
    const locked = feedback.getCurrentFeedback() !== null; // Feedback pause.
    const denominator = controller.getDenominator(); // Actual denominator.
    const subtraction = controller.getOrder().operation === "subtraction"; // Answer mode.
    element("#stage-title").textContent = cutting ? "Choose your cuts" : "Complete the order";
    element("#cut-status").textContent = cutting
      ? `Current denominator: ${denominator}. Choose the least common denominator for both fractions.`
      : controller.canStartCutting()
        ? "The right plate is empty. You can change the cuts or complete the order."
        : "Return every moved slice to the tray, or reset, before changing cuts.";
    for (const id of ["fewer-cuts", "more-cuts", "confirm-cuts"]) button(id).hidden = !cutting;
    button("fewer-cuts").disabled = locked || !controller.canStepDenominator(-1);
    button("more-cuts").disabled = locked || !controller.canStepDenominator(1);
    // Let students submit any available cut choice for feedback.
    button("confirm-cuts").disabled = locked || !cutting;
    element("#cut-feedback").textContent = cutMessage;
    element("#cut-feedback").hidden = !cutting || !cutMessage;
    button("change-cuts").hidden = cutting;
    button("change-cuts").disabled = locked || !controller.canStartCutting();
    button("check-order").disabled = locked || cutting;
    element("#move-instruction").textContent = cutting
      ? "Confirm the cuts before moving slices."
      : subtraction
        ? "✋ Drag slices onto the return plate to take them away. Drag them back to fix a mistake."
        : "✋ Drag slices onto your order plate to combine the two amounts. Drag them back to fix a mistake.";
    element("#live-fraction").textContent = cutting
      ? `Each slice is 1/${denominator} of a pizza.`
      : `${subtraction ? "Slices left" : "On your plate"}: ${controller.getSelectedSlices()}/${denominator}`;
    element("#conversion-hint").hidden = !hintVisible;
    button("hint-button").textContent = hintVisible ? "Hide Hint" : "Hint";
    button("hint-button").setAttribute("aria-expanded", String(hintVisible));
    view.setInteractionEnabled(!cutting && !locked);
  }

  // Start a fresh question without carrying over feedback or placements.
  function nextOrder(): void {
    feedback.startNewOrder();
    hintVisible = false;
    controller.startOrder(generateUnlikeDenominatorOrder());
    renderQuestion();
  }

  // Connect cutting actions through the existing US11 controller.
  button("fewer-cuts").addEventListener("click", () => controller.stepDenominator(-1));
  button("more-cuts").addEventListener("click", () => controller.stepDenominator(1));
  button("confirm-cuts").addEventListener("click", () => {
    if (controller.getStage() !== "cutting" || feedback.getCurrentFeedback()) return;
    const result = controller.checkCutting(); // Feedback for the chosen denominator.
    if (result.correct) controller.confirmCutting();
    else {
      cutMessage = result.message;
      refresh();
    }
  });
  button("change-cuts").addEventListener("click", () => controller.startCutting());
  button("hint-button").addEventListener("click", () => {
    hintVisible = !hintVisible;
    refresh();
  });

  // Check live slice state and preserve the original question in the result.
  button("check-order").addEventListener("click", () => {
    if (controller.getStage() !== "answering" || feedback.getCurrentFeedback()) return;
    const result = controller.checkAnswer(); // Validated actual answer.
    feedback.showFeedback(controller.getCommonOrder(), controller.getSelectedSlices(), result);
    const equation = element("#solved-equation"); // Completed original equation.
    equation.hidden = !result.correct;
    equation.textContent = result.correct
      ? element("#order-equation").textContent!.replace(
        "?", `${controller.getOrder().resultNumerator}/${controller.getDenominator()}`,
      )
      : "";
    if (feedback.getIncorrectAttempts() >= 2 && !result.correct) hintVisible = true;
    refresh();
  });

  // Retry keeps the current answer; Next Order generates a new question.
  button("feedback-action").addEventListener("click", () => {
    const current = feedback.getCurrentFeedback(); // Active feedback.
    if (!current) return;
    if (current.type === "correct") nextOrder();
    else feedback.closeFeedback();
    refresh();
  });

  // Reset preserves the question and reopens cutting.
  button("reset-order").addEventListener("click", () => {
    feedback.closeFeedback();
    controller.resetOrder();
  });
  controller.setOnStateChanged(() => {
    cutMessage = "";
    refresh();
  });
  nextOrder();
}
