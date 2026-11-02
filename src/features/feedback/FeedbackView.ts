import type { Feedback } from "./types";
import type { PizzaOrder, SubtractionOrder } from "../pizza/types";

import type { Explanation, PizzaDiagram } from "./Explanation";

/** Render teaching pizzas */
export function renderExplanation(container: HTMLElement, explanation?: Explanation): void {
  container.replaceChildren();
  container.hidden = !explanation;
  if (!explanation) return;

  const heading = document.createElement("h3");
  heading.textContent = "Let's solve it step by step";
  const steps = document.createElement("ol");
  for (const text of explanation.steps) {
    const step = document.createElement("li");
    step.textContent = text;
    steps.append(step);
  }
  const diagrams = document.createElement("div");
  diagrams.className = "explanation-pizzas";
  function renderPizza(pizza: PizzaDiagram): HTMLElement {
    const figure = document.createElement("figure");
    const visual = document.createElement("div");
    visual.className = "explanation-pizza";
    visual.setAttribute("role", "img");
    visual.setAttribute("aria-label", `${pizza.label}: ${pizza.filledSlices} of ${pizza.denominator} equal slices remain${pizza.fadedSlices ? `; ${pizza.fadedSlices} removed slices shown faded` : ""}`);
    const degrees = 360 / pizza.denominator;
    const stops = Array.from({ length: pizza.denominator }, (_, index) => {
      const start = index * degrees;
      const end = (index + 1) * degrees;
      const color = index < pizza.filledSlices ? "#f4bd55"
        : index < pizza.filledSlices + (pizza.fadedSlices ?? 0) ? "rgba(244, 189, 85, 0.22)" : "#fff8ec";
      return `${color} ${start}deg ${end}deg`;
    });
    visual.style.background = `conic-gradient(${stops.join(", ")})`;
    const svgNamespace = "http://www.w3.org/2000/svg";
    const dividers = document.createElementNS(svgNamespace, "svg");
    dividers.setAttribute("viewBox", "0 0 120 120");
    dividers.setAttribute("aria-hidden", "true");
    dividers.classList.add("explanation-dividers");
    for (let index = 0; index < pizza.denominator; index++) {
      const angle = index * 2 * Math.PI / pizza.denominator - Math.PI / 2;
      const line = document.createElementNS(svgNamespace, "line");
      line.setAttribute("x1", "60");
      line.setAttribute("y1", "60");
      line.setAttribute("x2", String(60 + 60 * Math.cos(angle)));
      line.setAttribute("y2", String(60 + 60 * Math.sin(angle)));
      line.setAttribute("stroke", "#4a2e1f");
      line.setAttribute("stroke-width", "1");
      line.setAttribute("vector-effect", "non-scaling-stroke");
      dividers.append(line);
    }
    visual.append(dividers);
    const caption = document.createElement("figcaption");
    caption.textContent = pizza.fadedSlices !== undefined
      ? `${pizza.label}: ${pizza.filledSlices}/${pizza.denominator}, ${pizza.fadedSlices} slices moving`
      : `${pizza.label}: ${pizza.filledSlices}/${pizza.denominator}`;
    figure.append(visual, caption);
    return figure;
  }
  if (explanation.rows) {
    diagrams.classList.add("explanation-matrix");
    for (const row of explanation.rows) {
      const section = document.createElement("section");
      section.className = "explanation-row";
      const title = document.createElement("h4");
      title.textContent = row.label;
      const pair = document.createElement("div");
      pair.className = "explanation-pair";
      const operator = document.createElement("span");
      operator.className = "explanation-operator";
      operator.textContent = row.operator;
      if (row.operator) operator.setAttribute("aria-label", "move slices to return plate");
      else operator.setAttribute("aria-hidden", "true");
      pair.append(renderPizza(row.pizzas[0]), operator, renderPizza(row.pizzas[1]));
      section.append(title, pair);
      diagrams.append(section);
    }
  } else {
    for (const pizza of explanation.pizzas) diagrams.append(renderPizza(pizza));
  }
  container.append(heading, steps, diagrams);
}

export interface FeedbackDisplay {
  show(feedback: Feedback, order: PizzaOrder): void;
  clear(): void;
}

export class FeedbackView implements FeedbackDisplay {
  private readonly panel: HTMLElement;
  private readonly title: HTMLElement;
  private readonly message: HTMLElement;
  private readonly equation: HTMLElement;
  private readonly explanation: HTMLElement;
  private readonly action: HTMLButtonElement;

  public constructor(root: HTMLElement) {
    const requireElement = <T extends HTMLElement>(selector: string): T => {
      const element = root.querySelector<T>(selector);
      if (!element) throw new Error(`Missing feedback element: ${selector}`);
      return element;
    };
    this.panel = requireElement("#order-feedback");
    this.title = requireElement("#feedback-title");
    this.message = requireElement("#feedback-message");
    this.equation = requireElement("#solved-equation");
    this.explanation = requireElement("#order-explanation");
    this.action = requireElement<HTMLButtonElement>("#feedback-action");
  }

  public show(feedback: Feedback, order: PizzaOrder): void {
    this.title.textContent = feedback.title;
    this.message.textContent = feedback.message;
    this.action.textContent = feedback.actionLabel;
    this.panel.dataset.result = feedback.type;
    renderExplanation(this.explanation, feedback.explanation);
    const subtraction = order as Partial<SubtractionOrder>;
    this.equation.hidden = feedback.type !== "correct" || subtraction.initialNumerator === undefined;
    this.equation.textContent = this.equation.hidden ? "" :
      `${subtraction.initialNumerator}/${order.denominator} − ${subtraction.subtractNumerator}/${order.denominator} = ${order.numerator}/${order.denominator}`;
    this.panel.hidden = false;
    if (feedback.explanation) {
      this.explanation.tabIndex = -1;
      this.explanation.focus({ preventScroll: true });
    } else {
      this.action.focus({ preventScroll: true });
    }
    this.panel.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  public clear(): void {
    this.panel.hidden = true;
    renderExplanation(this.explanation);
  }
}
