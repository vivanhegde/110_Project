import type { PizzaOrder, SubtractionOrder } from "../pizza/types";
import type { Feedback } from "./types";

export class FeedbackView {
  private panel: HTMLElement;

  //The page decides where the feedback box goes and gives it to the view
  public constructor(panel: HTMLElement) {
    this.panel = panel;
    this.panel.hidden = true;
  }

  //Draws the feedback box after Check Order
  //onAction is called when the student presses Next Order or Try Again
  public show(feedback: Feedback, order: PizzaOrder, onAction: () => void): void {
    this.panel.innerHTML = "";

    const title = document.createElement("h2");
    title.className = "feedback-title";
    title.textContent = feedback.title;
    this.panel.appendChild(title);

    const message = document.createElement("p");
    message.className = "feedback-message";
    message.textContent = feedback.message;
    this.panel.appendChild(message);

    //Only a correct answer shows the completed equation
    if (feedback.type === "correct") {
      const equation = document.createElement("p");
      equation.className = "feedback-equation";
      equation.textContent = this.getEquationText(order);
      this.panel.appendChild(equation);
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "feedback-action";
    button.textContent = feedback.actionLabel;
    button.addEventListener("click", onAction);
    this.panel.appendChild(button);

    this.panel.dataset.result = feedback.type;
    this.panel.hidden = false;
  }

  //Clears and hides the feedback box
  public hide(): void {
    this.panel.innerHTML = "";
    this.panel.hidden = true;
  }

  //Subtraction orders know both numbers, so we can show "6/8 − 2/8 = 4/8"
  //Addition orders only store the answer right now, so we show "5/8"
  private getEquationText(order: PizzaOrder): string {
    const answer = order.numerator + "/" + order.denominator;

    if ("initialNumerator" in order) {
      const subtraction = order as SubtractionOrder;
      const start = subtraction.initialNumerator + "/" + subtraction.denominator;
      const takeAway = subtraction.subtractNumerator + "/" + subtraction.denominator;
      return start + " − " + takeAway + " = " + answer;
    }

    return answer;
  }
}