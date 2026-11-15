
import type { PizzaOrder, AnswerResult, SubtractionOrder } from "./types";
import type { Feedback } from "../feedback/types";

export class PizzaOrderView {
  private root: HTMLElement;

  public constructor(root: HTMLElement) {
    this.root = root;
  }

  private element<T extends HTMLElement = HTMLElement>(
    id: string
  ): T {
    const node = this.root.querySelector<T>(`#${id}`);

    if (!node) {
      throw new Error(`Missing view element: ${id}`);
    }

    return node;
  }

  //Build the gameplay page based on the mockup
  public render(): void {
    this.root.innerHTML = `
      <main class="addition-game">
        <header class="addition-header">
          <a href="./" class="addition-logo">
            🍕 Fraction Food Truck
          </a>

          <div class="addition-progress">
            <strong>Level 1</strong>
            <span id="addition-order-number">
              Order 1 of 5
            </span>
            <div id="addition-dots"
                 class="addition-dots"></div>
          </div>

          <div class="addition-score">
            ⭐ Score
            <strong id="addition-score-value">0</strong>
          </div>
        </header>

        <section class="addition-heading">
          <div>
            <h1 id="addition-heading">
              Let's make some pizza!
            </h1>
            <p>Put two amounts together to fill the order.</p>
          </div>

          <span class="addition-level-label">
            Adding fractions
          </span>
        </section>

        <div class="addition-layout">
          <aside class="addition-order-card">
            <h2>PIZZA ORDER</h2>

            <div class="addition-customer">
              👩‍🍳
              <strong id="addition-customer"></strong>
            </div>

            <p>One pizza, please!</p>

            <p id="addition-request"
               class="addition-request"></p>

            <hr />

            <h3>YOUR ORDER</h3>

            <div id="addition-equation"
                 class="addition-equation"></div>

            <p id="addition-order-note"
               class="addition-order-note">
              Put slices together
            </p>
          </aside>

          <section class="addition-play-card">
            <p id="addition-instruction"
               class="addition-instruction">
              Drag slices onto the plate.
            </p>

            <div id="addition-plate"
                 class="addition-plate"></div>

            <div class="addition-controls">
              <div class="addition-selected">
                <span id="addition-count-label">On your plate</span>
                <span class="addition-selected-fraction">
                  <span id="addition-count-numerator">0</span>
                  <span id="addition-count-denominator">8</span>
                </span>
              </div>

              <div class="addition-buttons">
                <button id="addition-hint"
                        class="addition-secondary"
                        type="button">
                  Hint
                </button>

                <button id="addition-check"
                        class="addition-primary"
                        type="button">
                  Check Order
                </button>

                <button id="addition-next"
                        class="addition-primary"
                        type="button"
                        hidden>
                  Next Order
                </button>
              </div>
            </div>
          </section>
        </div>

        <section id="addition-message"
                 class="addition-message"
                 role="status"
                 aria-live="polite">
          Ready, chef? Let's make some pizza!
        </section>
      </main>
    `;
  }

  //Creates the stacked fraction used in the mockup
  private fraction(
    numerator: number,
    denominator: number
  ): HTMLElement {
    const container = document.createElement("span");
    container.className = "addition-fraction";

    const top = document.createElement("span");
    top.textContent = String(numerator);

    const bottom = document.createElement("span");
    bottom.textContent = String(denominator);

    container.append(top, bottom);
    return container;
  }

  //Displays the current customer's order
 
  public showOrder(order: PizzaOrder): void {
    const name = order.customerName ?? "Customer";
    const subtract = "initialNumerator" in order;

    //Determine the first and second numerators based on whether the order is a subtraction or addition order
    const first = subtract
      ? (order as SubtractionOrder).initialNumerator
      : (order.firstNumerator ?? order.numerator);

    const second = subtract
      ? (order as SubtractionOrder).subtractNumerator
      : (order.secondNumerator ?? 0);

    this.element("addition-heading").textContent =
      `Let's make ${name}'s pizza!`;

    this.element("addition-customer").textContent = name;

    this.element("addition-request").textContent =
      order.request ??
      (subtract
        ? `I have ${first}/${order.denominator}. Please take away ${second}/${order.denominator}.`
        : `I'd like ${first}/${order.denominator} plus ${second}/${order.denominator} of a pizza!`);

    this.element("addition-instruction").textContent =
      subtract
        ? `Move ${second} slices to the return plate for ${name}.`
        : `Drag slices onto the plate to make ${name}'s order.`;

    const equation = this.element("addition-equation");

    equation.replaceChildren(
      this.fraction(first, order.denominator),
      document.createTextNode(subtract ? "−" : "+"),
      this.fraction(second, order.denominator)
    );

    //Update the order note and level label based on whether the order is a subtraction or addition order
    this.element("addition-order-note").textContent =
      subtract
        ? "− Take slices away"
        : "＋ Put slices together";

    const label = this.root.querySelector<HTMLElement>(
      ".addition-level-label"
    );

    if (label) {
      label.textContent = subtract
        ? "Subtracting fractions"
        : "Adding fractions";
    }

    this.showSelectedSlices(
      subtract ? first : 0,
      order.denominator
    );
  }


  //Displays which of the five orders is active
  public showProgress(
    currentOrder: number,
    totalOrders: number
  ): void {
    this.element("addition-order-number").textContent =
      `Order ${currentOrder} of ${totalOrders}`;

    const dots = this.element("addition-dots");
    dots.replaceChildren();

    for (let i = 1; i <= totalOrders; i++) {
      const dot = document.createElement("span");

      if (i <= currentOrder) {
        dot.classList.add("active");
      }

      dots.append(dot);
    }
  }

  //Displays the current score in the header
  public showScore(score: number): void {
    this.element("addition-score-value").textContent =
      String(score);
  }

  //Displays the current slice selection on the plate
  public showSelectedSlices(
    count: number,
    denominator: number
  ): void {
    this.element("addition-count-numerator").textContent = String(count);
    this.element("addition-count-denominator").textContent = String(denominator);
  }

  //Display a message to the student
  public showMessage(
    message: string,
    type: "neutral" | "correct" | "incorrect" = "neutral"
  ): void {
    const banner = this.element("addition-message");

    banner.textContent = message;
    banner.dataset.result = type;
  }

  //Displays success or retry feedback
  public showResult(
    result: AnswerResult,
    order: PizzaOrder,
    selectedSlices: number
  ): void {
    if (result.correct) {
      this.showMessage(
        `🎉 Delicious work, chef! +100 points. ` +
        `${selectedSlices}/${order.denominator} is correct!`,
        "correct"
      );

      const equation = this.element("addition-equation");

      equation.append(
        document.createTextNode("="),
        this.fraction(order.numerator, order.denominator)
      );

      this.element("addition-order-note").textContent =
        "✓ Order served!";

      this.element("addition-instruction").textContent =
        "Just right! Your pizza is ready to serve.";
    } else {
      this.showMessage(
        `Not quite! You made ` +
        `${selectedSlices}/${order.denominator}. ` +
        `Try moving some slices and checking again.`,
        "incorrect"
      );
    }
  }

  //Explains how to add like denominators
  public showHint(order: PizzaOrder): void {
    const first = order.firstNumerator ?? order.numerator;
    const second = order.secondNumerator ?? 0;

    this.showMessage(
      `💡 Add the top numbers: ${first} + ${second}. ` +
      `Keep ${order.denominator} on the bottom.`
    );
  }

  //Reset controls when starting a new order
  public resetControls(): void {
    const check =
      this.element<HTMLButtonElement>("addition-check");
    const next =
      this.element<HTMLButtonElement>("addition-next");
    const hint =
      this.element<HTMLButtonElement>("addition-hint");

    check.hidden = false;
    check.disabled = false;
    next.hidden = true;
    hint.hidden = false;
  }

  //Unlocks progression after a correct answer
  public showCompletedOrder(isLast: boolean): void {
    this.element("addition-check").hidden = true;
    this.element("addition-hint").hidden = true;

    const next =
      this.element<HTMLButtonElement>("addition-next");

    next.hidden = false;
    next.textContent = isLast
      ? "Finish Level"
      : "Next Order";
  }

  //Displays the end-of-level results screen
  public showCompletion(
    score: number,
    totalOrders: number
  ): void {
    this.root.innerHTML = `
      <main class="addition-game addition-completion">
        <h1>🎉 Level 1 Complete!</h1>

        <p>
          Great job, chef! You completed
          ${totalOrders} pizza orders.
        </p>

        <div class="addition-final-score">
          <p>TOTAL SCORE</p>
          <h2>${score}</h2>
        </div>

        <button id="addition-replay"
                class="addition-primary"
                type="button">
          Play Again
        </button>
      </main>
    `;
  }

  //Connects the interactive controls to the game
  public onCheck(callback: () => void): void {
    this.element("addition-check")
      .addEventListener("click", callback);
  }

  public onHint(callback: () => void): void {
    this.element("addition-hint")
      .addEventListener("click", callback);
  }

  public onNext(callback: () => void): void {
    this.element("addition-next")
      .addEventListener("click", callback);
  }

  public onReplay(callback: () => void): void {
    this.element("addition-replay")
      .addEventListener("click", callback);
  }


  //Displays feedback from the shared FeedbackController
  public showFeedback(
    feedback: Feedback,
    order: PizzaOrder,
    selected: number
  ): void {
    this.showMessage(
      `${feedback.title} ${feedback.message}`,
      feedback.type === "correct" ? "correct" : "incorrect"
    );

    if (feedback.type === "correct") {
      this.element("addition-order-note").textContent =
        "✓ Order served!";

      const equation = this.element("addition-equation");

      equation.append(
        document.createTextNode("="),
        this.fraction(
          order.numerator,
          order.denominator
        )
      );
    }

    this.showSelectedSlices(
      selected,
      order.denominator
    );
  }

  //Shows the action chosen by the FeedbackController
  public showAction(label: string): void {
    this.element("addition-check").hidden = true;
    this.element("addition-hint").hidden = true;

    const action = this.element<HTMLButtonElement>(
      "addition-next"
    );

    action.textContent = label;
    action.hidden = false;
  }

}
