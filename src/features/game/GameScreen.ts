
import { PizzaOrderModel } from "../pizza/PizzaOrderModel";
import { PizzaOrderController } from "../pizza/PizzaOrderController";
import { PizzaOrderView } from "../pizza/PizzaOrderView";

import { PlateModel } from "../plate/PlateModel";
import { PlateController } from "../plate/PlateController";
import { PlateView } from "../plate/PlateView";

import { LevelModel } from "../level/LevelModel";
import { LevelController } from "../level/LevelController";
import { LevelView } from "../level/LevelView";

import { FeedbackModel } from "../feedback/FeedbackModel";
import { FeedbackController } from "../feedback/FeedbackController";

import { WorkedExampleModel } from "../workedExamples/WorkedExampleModel";
import { WorkedExampleController } from "../workedExamples/WorkedExampleController";
import { WorkedExampleView } from "../workedExamples/WorkedExampleView";

import type {
  PizzaOrder,
  SubtractionOrder,
  AnswerResult
} from "../pizza/types";

import type { WorkedExample } from "../workedExamples/types";

import { LEVEL_ORDERS } from "./orders";

import "../pizza/AdditionGame.css";
import "./GameScreen.css";

//Determines whether an order is subtraction
function isSubtraction(
  order: PizzaOrder
): order is SubtractionOrder {
  return (
    "initialNumerator" in order &&
    "subtractNumerator" in order
  );
}

//Builds a worked example for the current order
function buildExample(order: PizzaOrder): WorkedExample {
  if (isSubtraction(order)) {
    return {
      type: "Subtraction",
      steps: [
        {
          explanation:
            `Start with ${order.initialNumerator} of ` +
            `${order.denominator} slices.`,
          pizzas: [order]
        },
        {
          explanation:
            `Move ${order.subtractNumerator} slices ` +
            `to the return plate.`,
          pizzas: [order]
        },
        {
          explanation:
            `Count the slices remaining: ` +
            `${order.initialNumerator} − ` +
            `${order.subtractNumerator} = ${order.numerator}.`,
          pizzas: [order]
        }
      ]
    };
  }

  const first = order.firstNumerator ?? order.numerator;
  const second = order.secondNumerator ?? 0;

  return {
    type: "Addition",
    steps: [
      {
        explanation:
          `Read the customer's order: ` +
          `${first}/${order.denominator} plus ` +
          `${second}/${order.denominator}.`,
        pizzas: [order]
      },
      {
        explanation:
          `The denominator stays ${order.denominator}, ` +
          `because each slice is the same size.`,
        pizzas: [order]
      },
      {
        explanation:
          `Add the numerators: ${first} + ${second} ` +
          `= ${order.numerator}.`,
        pizzas: [order]
      }
    ]
  };
}

//Starts the game by initializing the controllers and views and setting up event handlers
export function startGame(app: HTMLElement): void {

  //Renders the existing Pizza Order interface
  const orderView = new PizzaOrderView(app);
  orderView.render();

  const root = app.querySelector<HTMLElement>(
    ".addition-game"
  );

  if (!root) {
    throw new Error("Game screen not found");
  }

  //Replaces the standalone progress display with LevelView
  const progressElement = document.createElement("div");
  progressElement.className = "unified-progress";

  root.querySelector(".addition-progress")!
    .replaceWith(progressElement);

  root.querySelector(".addition-score")!.remove();

  //Groups the gameplay elements together so we can hide them when showing worked examples or results
  const content = document.createElement("div");
  content.className = "unified-content";

  const heading = root.querySelector(".addition-heading")!;
  const layout = root.querySelector(".addition-layout")!;
  const message = root.querySelector(".addition-message")!;

  heading.before(content);
  content.append(heading, layout, message);

  //Level results container.
  const results = document.createElement("section");
  results.className = "unified-results";
  results.hidden = true;

  root.append(results);

  //Worked example container
  const examplePanel = document.createElement("section");
  examplePanel.className = "unified-example";
  examplePanel.hidden = true;

  root.append(examplePanel);

  //Level controls the score and order sequence
  const level = new LevelController(
    new LevelModel(1, LEVEL_ORDERS)
  );

  const levelView = new LevelView(
    progressElement,
    results
  );

  //Shared feedback system
  const feedback = new FeedbackController(
    new FeedbackModel()
  );

  //Worked example components
  let exampleController = new WorkedExampleController(
    new WorkedExampleModel(
      buildExample(LEVEL_ORDERS[0])
    )
  );

  const exampleView = new WorkedExampleView(examplePanel);

  //Shared drag-and-drop pizza components
  const plateModel = new PlateModel(8);
  const plateController = new PlateController();
  const plateView = new PlateView("addition-plate");

  plateController.setModel(plateModel);
  plateController.setView(plateView);
  plateView.setController(plateController);

  let currentAddition: PizzaOrderController | null = null;
  let locked = false;

  //Return the currently active level order.
  function current(): PizzaOrder {
    return level.getCurrentOrder();
  }

  //Updates the fraction counter whenever a slice moves
  plateController.setOnSliceCountChanged(() => {
    if (level.isLevelComplete()) return;

    const order = current();

    const selected = isSubtraction(order)
      ? plateController.getRemainingSlices()
      : plateController.getSlicesOnPlate();

    orderView.showSelectedSlices(
      selected,
      order.denominator
    );
  });

  //Displays a worked example
  function openExample(beforeLevel: boolean): void {
    exampleController = new WorkedExampleController(
      new WorkedExampleModel(buildExample(current()))
    );

    exampleController.openExample();

    content.hidden = true;
    examplePanel.hidden = false;

    plateView.setInteractionEnabled(false);

    exampleView.show(
      exampleController,
      () => {
        exampleController.closeExample();

        examplePanel.hidden = true;
        content.hidden = false;

        plateView.setInteractionEnabled(!locked);
      },
      beforeLevel
    );
  }

  //Prepares the next pizza order
  function beginOrder(): void {
    const order = current();

    locked = false;
    feedback.startNewOrder();
    currentAddition = null;

    //Subtraction and addition share the same plate
    if (isSubtraction(order)) {
      plateController.startSubtractionOrder(order);
    } else {
      plateController.startOrder(order.denominator);

      currentAddition = new PizzaOrderController(
        new PizzaOrderModel(order)
      );
    }

    plateView.setCustomerName(
      order.customerName ?? "Customer"
    );

    plateView.setInteractionEnabled(true);

    // Update the customer and level displays.
    orderView.showOrder(order);
    orderView.resetControls();

    levelView.renderHeader(level.getProgress());

    orderView.showMessage(
      isSubtraction(order)
        ? "Drag slices from the starting pizza to the return plate. Check how many remain."
        : "Move slices from the tray onto your plate, then check your order."
    );

    orderView.showSelectedSlices(
      isSubtraction(order) ? order.initialNumerator : 0,
      order.denominator
    );
  }

  //Handles Check Order
  orderView.onCheck(() => {
    if (locked || feedback.getCurrentFeedback()) {
      return;
    }

    const order = current();

    let answer: number;
    let result: AnswerResult;

    if (isSubtraction(order)) {
      //Subtraction checks what remains
      answer = plateController.getRemainingSlices();

      result = plateController.submitSubtractionAnswer();
    } else {
      //Addition checks what is placed on the plate
      answer = plateController.getSlicesOnPlate();

      currentAddition!.selectSlice(answer);
      result = currentAddition!.submitAnswer();
    }

    const response = feedback.showFeedback(
      order,
      answer,
      result
    );

    orderView.showSelectedSlices(
      answer,
      order.denominator
    );

    orderView.showFeedback(
      response,
      order,
      answer
    );

    //Lock dragging until the player continues or retries
    locked = true;
    plateView.setInteractionEnabled(false);

    orderView.showAction(response.actionLabel);
  });

  //Handles Try Again or Next Order.
  orderView.onNext(() => {
    const response = feedback.getCurrentFeedback();

    if (!locked || !response) return;

    if (response.type !== "correct") {
      //Incorrect answer -> resume the same order
      feedback.closeFeedback();

      locked = false;
      plateView.setInteractionEnabled(true);

      orderView.resetControls();

      orderView.showMessage(
        "Try moving slices again, then check your answer."
      );

      return;
    }

    //Records the completed order exactly once
    locked = false;

    level.completeOrder(
      feedback.getIncorrectAttempts(),
      response.pointsEarned
    );

    //Shows the final level results
    if (level.isLevelComplete()) {
      content.hidden = true;

      levelView.renderHeader(level.getProgress());

      levelView.renderResults(
        level.getResult(),
        () => {
          level.restartLevel();
          levelView.hideResults();

          content.hidden = false;

          beginOrder();
          openExample(true);
        }
      );

      return;
    }

    //Move to the next level order
    beginOrder();
  });

  //Opens a worked example when Hint is clicked
  orderView.onHint(() => {
    if (locked) return;

    openExample(false);
  });

  //Starts the first order with an introduction
  beginOrder();
  openExample(true);
}
