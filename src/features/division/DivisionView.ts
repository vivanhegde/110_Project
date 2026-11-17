import { gcd } from "../../shared/fractions";
import type { DivisionOrder, DivisionResult } from "./types";
import { createPizzaDiagram } from "./PizzaDiagram";

interface DivisionHandlers {
  onAdd: () => void;
  onRemove: () => void;
  onCheck: () => void;
  onHint: () => void;
  onNext: () => void;
}

export class DivisionView {
  public constructor(private root: HTMLElement, private handlers: DivisionHandlers) {}

  public render(order: DivisionOrder, portions: number, result: DivisionResult | null,
    hint: string | null, index: number, total: number): void {
    const active = this.root.contains(document.activeElement)
      ? (document.activeElement as HTMLElement).id : "";
    this.root.innerHTML = `
      <div class="division-page">
        <header class="division-header">
          <a class="division-logo" href="./">🍕 Fraction Food Truck</a>
          <strong class="division-progress"></strong>
          <a href="./">Back to Map</a>
        </header>
        <main>
          <section class="division-heading">
            <div><h1>Let's share some pizza!</h1><p>Divide Food into Equal Portions</p></div>
            <span class="division-operation">Dividing fractions</span>
          </section>
          <div class="division-layout">
            <aside class="division-order-card">
              <h2>PIZZA ORDER</h2>
              <p class="division-customer">👩‍🍳 <strong>Head Chef</strong></p>
              <p class="division-prompt"></p>
              <hr><h3>YOUR ORDER</h3>
              <div class="division-equation"></div>
              <p class="division-order-note">How many equal portions can you make?</p>
            </aside>
            <section class="division-play-card" aria-label="Pizza portioning area">
              <p class="division-instruction">Click a pizza or use Make a Portion to serve food. Click a portion to put it back.</p>
              <div class="division-board">
                <h2>Your food supply</h2>
                <div class="division-supply"></div>
                <p class="division-slice-note"></p>
                <h2>Your portions</h2>
                <div class="division-portions"></div>
              </div>
              <p class="division-count" role="status"></p>
              <div class="division-controls"></div>
            </section>
          </div>
          <div class="division-feedback" role="status"></div>
        </main>
      </div>`;

    const find = <T extends HTMLElement>(selector: string): T => this.root.querySelector<T>(selector)!;
    find(".division-progress").textContent = `Order ${index} of ${total}`;
    find(".division-prompt").textContent =
      `You have ${order.totalNumerator}/${order.totalDenominator} of a ${order.food}. ` +
      `Each portion needs ${order.portionNumerator}/${order.portionDenominator} of a ${order.food}. ` +
      "How many equal portions can you make?";

    const equation = find(".division-equation");
    const divide = document.createElement("span");
    divide.textContent = "÷";
    const answer = document.createElement("span");
    answer.textContent = result?.type === "correct" ? `= ${portions}` : "= ?";
    equation.append(this.fraction(order.totalNumerator, order.totalDenominator), divide,
      this.fraction(order.portionNumerator, order.portionDenominator), answer);

    const denominator = order.totalDenominator * order.portionDenominator /
      gcd(order.totalDenominator, order.portionDenominator);
    const totalSlices = order.totalNumerator * denominator / order.totalDenominator;
    const portionSlices = order.portionNumerator * denominator / order.portionDenominator;
    const supply = find(".division-supply");
    const solved = result?.type === "correct";
    const remaining = totalSlices - portions * portionSlices;
    find(".division-slice-note").textContent =
      `Each slice is 1/${denominator} of a pizza. Faded slices have been served.`;
    for (let start = 0; start < totalSlices; start += denominator) {
      const pizza = document.createElement("figure");
      pizza.className = "division-pizza";
      const slices = Math.min(denominator, totalSlices - start);
      const served = Math.max(0, Math.min(slices, portions * portionSlices - start));
      const pizzaNumber = start / denominator + 1;
      const serve = this.button(`division-serve-${pizzaNumber}`, "", this.handlers.onAdd);
      serve.className = "division-pizza-button";
      serve.disabled = solved || portions >= 12 || remaining < portionSlices;
      serve.setAttribute("aria-label", `Make a portion from the pizza supply, pizza ${pizzaNumber}`);
      serve.appendChild(createPizzaDiagram(denominator, slices, served,
        `Pizza ${pizzaNumber}: ${slices} of ${denominator} equal slices; ${served} served, ${slices - served} left`, true));
      const caption = document.createElement("figcaption");
      caption.textContent = `Pizza ${pizzaNumber} · ${slices - served}/${denominator} left`;
      pizza.append(serve, caption);
      supply.appendChild(pizza);
    }

    const plates = find(".division-portions");
    for (let i = 0; i < portions; i++) {
      const plate = this.button(`division-portion-${i}`, "", this.handlers.onRemove);
      plate.className = "division-portion";
      plate.disabled = solved;
      const caption = document.createElement("span");
      caption.textContent = `Portion ${i + 1}: ${order.portionNumerator}/${order.portionDenominator}`;
      plate.setAttribute("aria-label", `Return portion ${i + 1} to the food supply`);
      const overflow = (i + 1) * portionSlices > totalSlices;
      if (overflow) {
        plate.classList.add("division-overflow");
        caption.textContent += " — not enough food";
      }
      for (let start = 0; start < portionSlices; start += denominator) {
        plate.appendChild(createPizzaDiagram(denominator,
          overflow ? 0 : Math.min(denominator, portionSlices - start), 0,
          overflow ? "Empty plate: not enough food for this portion"
            : `Portion ${i + 1}: ${order.portionNumerator}/${order.portionDenominator} of a pizza`));
      }
      plate.appendChild(caption);
      plates.appendChild(plate);
    }
    if (portions === 0) plates.textContent = "No portions served yet.";
    find(".division-count").textContent = `Your answer: ${portions} portions. ` +
      (remaining >= 0 ? `${remaining} slices still available.` : `${-remaining} extra slices needed.`);

    const controls = find(".division-controls");
    if (solved) {
      controls.appendChild(this.button("division-next", index === total ? "Finish Practice" : "Next Order", this.handlers.onNext));
    } else {
      const add = this.button("division-add", "Make a Portion", this.handlers.onAdd);
      add.disabled = portions >= 12;
      const remove = this.button("division-remove", "Return a Portion", this.handlers.onRemove);
      remove.disabled = portions === 0;
      controls.append(add, remove,
        this.button("division-check", "Check Order", this.handlers.onCheck),
        this.button("division-hint", "Hint", this.handlers.onHint));
    }
    const feedback = find(".division-feedback");
    if (result) {
      feedback.dataset.result = result.type;
      const message = document.createElement("p");
      message.textContent = result.message;
      feedback.appendChild(message);
    }
    const hintText = result?.hint ?? hint;
    if (hintText) {
      const explanation = document.createElement("p");
      explanation.className = "division-hint";
      explanation.textContent = "Hint: " + hintText;
      feedback.appendChild(explanation);
    }
    const focus = active ? document.getElementById(active) : null;
    if (focus && this.root.contains(focus) && !(focus as HTMLButtonElement).disabled) focus.focus();
    else if (solved) find<HTMLButtonElement>("#division-next").focus();
    else if (active) {
      // The focused control may have been removed or disabled by the redraw.
      find<HTMLButtonElement>(portions === 12 ? "#division-remove" : "#division-add").focus();
    }
  }

  private fraction(numerator: number, denominator: number): HTMLElement {
    const fraction = document.createElement("span");
    fraction.className = "division-fraction";
    for (const value of [numerator, denominator]) {
      const number = document.createElement("span");
      number.textContent = String(value);
      fraction.appendChild(number);
    }
    return fraction;
  }

  public showFinished(onRestart: () => void): void {
    this.root.innerHTML = `
      <main class="division-page"><section class="division-card">
        <h1 tabindex="-1">All portions served!</h1>
        <p>Great job, chef! You practiced counting equal portions with fraction division.</p>
        <div class="division-controls"><a href="./">Back to Map</a></div>
      </section></main>`;
    this.root.querySelector(".division-controls")!.appendChild(
      this.button("division-restart", "Play Again", onRestart));
    this.root.querySelector<HTMLElement>("h1")!.focus();
  }

  private button(id: string, text: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.id = id;
    button.textContent = text;
    button.addEventListener("click", onClick);
    return button;
  }
}
