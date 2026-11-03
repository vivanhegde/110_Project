import type { WorkedExampleController } from "./WorkedExampleController";

export class WorkedExampleView {
  public constructor(private root: HTMLElement) {}

  //Displays the worked example in the root element
  public show(
    controller: WorkedExampleController,
    onClose: () => void,
    beforeLevel: boolean
  ): void {

    //Draws the current step of the worked example
    const draw = (): void => {
      const step = controller.getCurrentStep();

      this.root.replaceChildren();
      const heading = document.createElement("h2");
      heading.textContent = "A little help from the Head Chef";

      const explanation = document.createElement("p");
      explanation.textContent = step.explanation;

      const equations = document.createElement("p");
      equations.className = "example-equation";

      //If the order is a subtraction order, display it as that, otherwise display it as an addition order
      equations.textContent = step.pizzas.map(order => {
        if (
          "initialNumerator" in order &&
          "subtractNumerator" in order
        ) {
          return (
            `${order.initialNumerator}/${order.denominator} − ` +
            `${order.subtractNumerator}/${order.denominator} = ` +
            `${order.numerator}/${order.denominator}`
          );
        }

        if (
          order.firstNumerator !== undefined &&
          order.secondNumerator !== undefined
        ) {
          return (
            `${order.firstNumerator}/${order.denominator} + ` +
            `${order.secondNumerator}/${order.denominator} = ` +
            `${order.numerator}/${order.denominator}`
          );
        }

        return `${order.numerator}/${order.denominator}`;
      }).join(" · ");

      //Create the previous and next buttons, and set their text based on whether the example is before the level or not
      const previous = document.createElement("button");
      previous.textContent = "Previous";

      //Add event listeners to the previous and next buttons to move to the previous or next step, and redraw the example
      previous.addEventListener("click", () => {
        controller.prevStep();
        draw();
      });

      const next = document.createElement("button");

      //Set the text of the next button based on whether the example is before the level or not, and whether the level can be started
      next.textContent = controller.canStartLevel()
        ? (beforeLevel ? "Start Level" : "Back to Order")
        : "Next Step";

      next.addEventListener("click", () => {
        if (controller.canStartLevel()) {
          onClose();
        } else {
          controller.nextStep();
          draw();
        }
      });

      this.root.append(
        heading,
        explanation,
        equations,
        previous,
        next
      );

      //If the example is not before the level, add a close button to the example
      if (!beforeLevel) {
        const close = document.createElement("button");
        close.textContent = "Close Help";

        close.addEventListener("click", onClose);

        this.root.append(close);
      }
    };

    draw();
  }
}
