import type { Feedback, FeedbackDisplay } from "./types";
import type { PizzaOrder, SubtractionOrder } from "../pizza/types";
import { renderExplanation } from "./ExplanationView";

export class SubtractionFeedbackView implements FeedbackDisplay {
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
