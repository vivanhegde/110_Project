import type { PizzaOrder, SubtractionOrder } from "../pizza/types";
import type { LevelProgress, LevelResult } from "./types";

/*
  LevelView
  This class only draws things. It has two jobs:
    1. Draw the header at the top of the game:
       "Level 1", "Order 3 of 5", a progress bar, and the score.
    2. Draw the results screen after the last order:
       "Level 1 complete!" with Play Again, or "Level 1 not passed" with Retry Level.

  It never decides anything on its own. It doesn't know the pass rule
  or how the score is added up. It just gets data from the controller
  (which got it from LevelModel) and puts it on the page.
*/
export class LevelView
{
  private header: HTMLElement;  // where the header gets drawn
  private results: HTMLElement; // where the results screen gets drawn

  // The page decides where the header and results go and give them to the view
  public constructor(header: HTMLElement, results: HTMLElement)
  {
    this.header = header;
    this.results = results;
  }

  // Draws the header. Called at the start and again after every order.
  public renderHeader(progress: LevelProgress): void
  {
    // Clear out the old header first, otherwise we'd stack a new one under it every time
    this.header.innerHTML = "";

    // "Level 1"
    const level = document.createElement("span");
    level.className = "level-number";
    level.textContent = "Level " + progress.levelNumber;

    // "Order 3 of 5"
    const order = document.createElement("span");
    order.className = "order-count";
    order.textContent = "Order " + progress.currentOrderNumber + " of " + progress.totalOrders;

    // The progress bar is an outer box with an inner "fill" box.
    // The fill's width is the percent of orders finished, so 2 of 5 done = 40% wide.
    const bar = document.createElement("div");
    bar.className = "progress-bar";

    const fill = document.createElement("div");
    fill.className = "progress-fill";
    const percent = Math.round((progress.completedOrders / progress.totalOrders) * 100);
    fill.style.width = percent + "%";
    bar.appendChild(fill);

    // "Score: 200"
    const score = document.createElement("span");
    score.className = "score";
    score.textContent = "Score: " + progress.score;

    this.header.appendChild(level);
    this.header.appendChild(order);
    this.header.appendChild(bar);
    this.header.appendChild(score);
  }

  // Draws the results screen once the level is over.
  // onRestart is a function the controller gives us. We don't know what it does,
  // we just call it when the button is clicked. This keeps the view from having
  // to know about the model.
  public renderResults(result: LevelResult, onRestart: () => void): void
  {
    // Clear out anything from last time
    this.results.innerHTML = "";

    // The title depends on whether they passed
    const title = document.createElement("h2");
    if (result.passed)
    {
      title.textContent = "Level " + result.levelNumber + " complete!";
    }
    else
    {
      title.textContent = "Level " + result.levelNumber + " not passed";
    }

    // "4 of 5 orders correct on the first try. You needed 4 to pass."
    const summary = document.createElement("p");
    summary.className = "results-summary";
    summary.textContent =
      result.firstTryCorrectCount + " of " + result.totalOrders +
      " orders correct on the first try. You needed " + result.requiredToPass + " to pass.";

    // "Total score: 500"
    const score = document.createElement("p");
    score.className = "results-score";
    score.textContent = "Total score: " + result.score;

    // A list of every order they solved, so they can see the equations again
    const list = document.createElement("ul");
    list.className = "results-orders";

    for (let i = 0; i < result.records.length; i++)
    {
      const record = result.records[i];

      let note = "after a retry";
      if (record.firstTryCorrect)
      {
        note = "first try";
      }

      // i starts at 0, so we add 1 to get "Order 1", "Order 2", ...
      const item = document.createElement("li");
      item.textContent = "Order " + (i + 1) + ": " + this.getEquationText(record.order) + " (" + note + ")";
      list.appendChild(item);
    }

    // Same button either way, just different text depending on the result
    const button = document.createElement("button");
    button.className = "restart-button";
    if (result.passed)
    {
      button.textContent = "Play Again";
    }
    else
    {
      button.textContent = "Retry Level";
    }
    button.addEventListener("click", onRestart);

    this.results.appendChild(title);
    this.results.appendChild(summary);
    this.results.appendChild(score);
    this.results.appendChild(list);
    this.results.appendChild(button);

    // Make sure the results screen is visible
    this.results.hidden = false;
  }

  // Clears and hides the results screen, used when the level restarts
  public hideResults(): void
  {
    this.results.innerHTML = "";
    this.results.hidden = true;
  }

  // Turns one order into the text shown in the results list.
  // Subtraction orders know both numbers, so we can show the whole equation: "6/8 - 2/8 = 4/8".
  // Addition orders only store the answer right now, so we just show "5/8".
  private getEquationText(order: PizzaOrder): string
  {
    const answer = order.numerator + "/" + order.denominator;

    // Only a SubtractionOrder has initialNumerator, so this is how we tell them apart
    if ("initialNumerator" in order)
    {
      const subtraction = order as SubtractionOrder;
      const start = subtraction.initialNumerator + "/" + subtraction.denominator;
      const takeAway = subtraction.subtractNumerator + "/" + subtraction.denominator;
      return start + " - " + takeAway + " = " + answer;
    }

    //Only an AdditionOrder has firstNumerator and secondNumerator
    if (order.firstNumerator !== undefined && order.secondNumerator !== undefined) {
      return (
        `${order.firstNumerator}/${order.denominator} + ` +
        `${order.secondNumerator}/${order.denominator} = ` +
        `${answer}`
      );
    }

    //If we don't know what kind of order it is, just show the answer
    return answer;
  }
}
