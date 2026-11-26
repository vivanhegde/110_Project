import { PizzaOrderModel } from "../pizza/PizzaOrderModel";
import { PizzaOrderController } from "../pizza/PizzaOrderController";
import { PizzaOrderView } from "../pizza/PizzaOrderView";
import {
  UnlikeDenominatorOrderController,
} from "../pizza/UnlikeDenominatorOrderController";

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


import { renderExplanation } from "../feedback/ExplanationView";
import "../pizza/SubtractionGame.css";


import type {
  PizzaOrder,
  SubtractionOrder,
  AnswerResult
} from "../pizza/types";

import type { WorkedExample } from "../workedExamples/types";

import { LEVEL_ORDERS } from "./orders";

import { ProgressModel } from "../progressStars/progressStarsModel";
import { ProgressStorage } from "../progressStars/progressStorage";
import { ProgressController } from "../progressStars/progressStarsController";
import { MAP_LOCATIONS } from "../map/locations";

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
  // Build conversion steps for unlike-denominator orders.
  const unlike = order.unlikeOrder;

  if (unlike) {
    const subtract = unlike.operation === "subtraction";
    const symbol = subtract ? "−" : "+";
    const operationWord = subtract ? "minus" : "plus";

    // Describe how each original fraction is converted.
    const firstMultiplier =
      unlike.commonDenominator / unlike.firstDenominator;

    const secondMultiplier =
      unlike.commonDenominator / unlike.secondDenominator;

    return {
      type: subtract ? "Subtraction" : "Addition",
      steps: [
        {
          // Start with the original question.
          explanation:
            `Read the customer's order: ` +
            `${unlike.firstNumerator}/${unlike.firstDenominator} ` +
            `${operationWord} ` +
            `${unlike.secondNumerator}/${unlike.secondDenominator}.`,
          // Reuse the shared full-equation display.
          pizzas: [order]
        },
        {
          // Explain the least common denominator.
          explanation:
            `Find the smallest number divisible by both ` +
            `${unlike.firstDenominator} and ` +
            `${unlike.secondDenominator}. ` +
            `It is ${unlike.commonDenominator}, so divide ` +
            `the pizza into ${unlike.commonDenominator} equal slices.`,
          pizzas: [order]
        },
        {
          // Explain equivalent fractions without changing their amounts.
          explanation:
            `Multiply the numerator and denominator of ` +
            `${unlike.firstNumerator}/${unlike.firstDenominator} ` +
            `by ${firstMultiplier} to get ` +
            `${unlike.convertedFirstNumerator}/${unlike.commonDenominator}. ` +
            `Multiply the numerator and denominator of ` +
            `${unlike.secondNumerator}/${unlike.secondDenominator} ` +
            `by ${secondMultiplier} to get ` +
            `${unlike.convertedSecondNumerator}/${unlike.commonDenominator}.`,
          pizzas: [order]
        },
        {
          // Complete the operation using equal-sized slices.
          explanation:
            `${subtract ? "Subtract" : "Add"} the numerators: ` +
            `${unlike.convertedFirstNumerator} ${symbol} ` +
            `${unlike.convertedSecondNumerator} = ` +
            `${unlike.resultNumerator}. ` +
            `Keep ${unlike.commonDenominator} as the denominator.`,
          pizzas: [order]
        }
      ]
    };
  }

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
//levelNumber and orders come from the map location the student picked (US-9).
//They default to level 1 and LEVEL_ORDERS, so calling startGame(app) still works the old way.
//onLevelPassed is called when the student passes, so the map can unlock the next place.
//onBackToMap adds a "Back to Map" button to the results screen.
export function startGame(
  app: HTMLElement,
  levelNumber: number = 1,
  orders: PizzaOrder[] = LEVEL_ORDERS,
  onLevelPassed?: (levelNumber: number) => void,
  onBackToMap?: () => void
): void {

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


  const explanationPanel = document.createElement("section");
  explanationPanel.className = "unified-explanation";
  explanationPanel.setAttribute(
    "aria-label",
    "Step-by-step explanation"
  );
  explanationPanel.hidden = true;

  content.append(explanationPanel);


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
    new LevelModel(levelNumber, orders)
  );

  //Remembers the stars earned on every level (US-8)
  const progress = new ProgressController(
    new ProgressModel(MAP_LOCATIONS.length),
    new ProgressStorage()
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
      buildExample(orders[0])
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
  // Manage cutting and answering for the current US11 order.
  let currentUnlike: UnlikeDenominatorOrderController | null = null;
  let locked = false;

  //Return the currently active level order.
  function current(): PizzaOrder {
    return level.getCurrentOrder();
  }

  // Refresh slice counts, cutting controls, and dragging.
  function refreshPlateState(): void {
    if (level.isLevelComplete()) return;

    const order = current();

    if (currentUnlike) {
      const cutting = currentUnlike.getStage() === "cutting";
      const denominator = currentUnlike.getDenominator();
      const unlike = currentUnlike.getOrder();

      // Show the equivalent starting amount while choosing cuts.
      const selected = cutting
        ? unlike.firstNumerator * denominator /
          unlike.firstDenominator
        : currentUnlike.getSelectedSlices();

      orderView.showSelectedSlices(selected, denominator);

      // Keep both tray captions aligned with the current cuts and moves.
      const placed = cutting ? 0 : plateController.getSlicesOnPlate();
      const remaining = cutting || unlike.operation === "subtraction"
        ? selected
        : denominator - placed;
      plateView.showSliceCounts(remaining, placed, denominator);

      orderView.showCuttingControls({
        cutting,
        denominator,
        canFewer: currentUnlike.canStepDenominator(-1),
        canMore: currentUnlike.canStepDenominator(1),
        canChangeCuts: currentUnlike.canStartCutting(),
        locked,
      });

      orderView.setCheckEnabled(!cutting && !locked);

      plateView.setInteractionEnabled(
        !cutting && !locked && examplePanel.hidden === true
      );

      return;
    }

    // Keep the existing same-denominator behavior.
    const selected = isSubtraction(order)
      ? plateController.getRemainingSlices()
      : plateController.getSlicesOnPlate();

    orderView.showSelectedSlices(
      selected,
      order.denominator
    );

    orderView.showCuttingControls(null);
    orderView.setCheckEnabled(!locked);

    plateView.setInteractionEnabled(
      !locked && examplePanel.hidden === true
    );
  }

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

        // Restore interaction according to the current stage.
        refreshPlateState();
      },
      beforeLevel
    );
  }

  // Prepare the next order using its existing game modules.
  function beginOrder(): void {
    const order = current();

    locked = false;
    feedback.startNewOrder();
    renderExplanation(explanationPanel);

    currentAddition = null;
    currentUnlike = null;

    orderView.showOrder(order);
    orderView.resetControls();

    levelView.renderHeader(level.getProgress());

    if (order.unlikeOrder) {
      // Let the US11 controller manage cutting and slice changes.
      currentUnlike = new UnlikeDenominatorOrderController(
        plateController,
        plateView
      );

      currentUnlike.setOnStateChanged(refreshPlateState);
      currentUnlike.startOrder(order.unlikeOrder);

      orderView.showMessage(
        "Choose the least common denominator, then click Confirm."
      );
    } else {
      // Use the existing callback for same-denominator orders.
      plateController.setOnSliceCountChanged(refreshPlateState);

      if (isSubtraction(order)) {
        plateController.startSubtractionOrder(order);
      } else {
        plateController.startOrder(order.denominator);

        currentAddition = new PizzaOrderController(
          new PizzaOrderModel(order)
        );
      }

      orderView.showMessage(
        isSubtraction(order)
          ? "Drag slices from the starting pizza to the return plate. Check how many remain."
          : "Move slices from the tray onto your plate, then check your order."
      );
    }

    refreshPlateState();
  }

  // Change the selected denominator through the US11 controller.
  orderView.onStepDenominator(direction => {
    if (
      locked ||
      !currentUnlike ||
      currentUnlike.getStage() !== "cutting"
    ) {
      return;
    }

    currentUnlike.stepDenominator(direction);

    orderView.showMessage(
      "Choose the least common denominator, then click Confirm."
    );
  });

  // Check every submitted denominator before allowing dragging.
  orderView.onConfirmCutting(() => {
    if (
      locked ||
      !currentUnlike ||
      currentUnlike.getStage() !== "cutting"
    ) {
      return;
    }

    const result = currentUnlike.checkCutting();

    if (!result.correct) {
      orderView.showMessage(result.message, "incorrect");
      return;
    }

    currentUnlike.confirmCutting();

    orderView.showMessage(
      `${result.message} Move slices to complete the order.`
    );
  });

  // Reopen cutting after all moved slices have been returned.
  orderView.onChangeCuts(() => {
    if (
      locked ||
      !currentUnlike ||
      currentUnlike.getStage() !== "answering" ||
      !currentUnlike.canStartCutting()
    ) {
      return;
    }

    currentUnlike.startCutting();

    orderView.showMessage(
      "Choose the least common denominator, then click Confirm."
    );
  });

  //Handles Check Order
  orderView.onCheck(() => {
    if (locked || feedback.getCurrentFeedback()) {
      return;
    }

    // Require confirmed cuts before checking a US11 answer.
    if (
      currentUnlike &&
      currentUnlike.getStage() !== "answering"
    ) {
      return;
    }

    const order = current();

    let answer: number;
    let result: AnswerResult;

    if (currentUnlike) {
      // Check the actual plate state through the US11 controller.
      answer = currentUnlike.getSelectedSlices();
      result = currentUnlike.checkAnswer();
    } else if (isSubtraction(order)) {
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

    renderExplanation(
      explanationPanel,
      response.explanation
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

    // Lock cutting controls while feedback is displayed.
    refreshPlateState();
  });

  //Handles Try Again or Next Order.
  orderView.onNext(() => {
    const response = feedback.getCurrentFeedback();

    if (!locked || !response) return;

    if (response.type !== "correct") {
      //Incorrect answer -> resume the same order
      feedback.closeFeedback();
      renderExplanation(explanationPanel);

      locked = false;

      orderView.resetControls();

      // Restore cutting controls and preserve the current slices.
      refreshPlateState();

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

      const result = level.getResult();

      //Work out and save the stars for this level (US-8)
      const stars = progress.completeLevel(result);

      //Tell the map the level was passed so the next place unlocks (US-9)
      if (result.passed && onLevelPassed !== undefined) {
        onLevelPassed(levelNumber);
      }

      levelView.renderResults(
        result,
        () => {
          level.restartLevel();
          levelView.hideResults();

          content.hidden = false;

          beginOrder();
          openExample(true);
        },
        onBackToMap,
        stars
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
