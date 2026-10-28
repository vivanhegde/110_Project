import type { LevelProgress, LevelResult } from "./types";

export class LevelView 
{
  private header: HTMLElement;
  private results: HTMLElement;

  //header and results are the page elements this view draws into
  public constructor(header: HTMLElement, results: HTMLElement) 
  {
    this.header = header;
    this.results = results;
  }

  //Draws "Level x", "Order x of y", the progress bar, and the score
  public renderHeader(progress: LevelProgress): void 
  {
    this.header.replaceChildren();

    const level = document.createElement("span");
    level.className = "level-number";
    level.textContent = `Level ${progress.levelNumber}`;

    const order = document.createElement("span");
    order.className = "order-count";
    order.textContent = `Order ${progress.currentOrderNumber} of ${progress.totalOrders}`;

    //The bar's fill width is the share of orders already finished
    const bar = document.createElement("div");
    bar.className = "progress-bar";
    const fill = document.createElement("div");
    fill.className = "progress-fill";
    fill.style.width = `${Math.round((progress.completedOrders / progress.totalOrders) * 100)}%`;
    bar.append(fill);

    const score = document.createElement("span");
    score.className = "score";
    score.textContent = `Score: ${progress.score}`;

    this.header.append(level, order, bar, score);
  }

  //Draws the level complete or level not passed screen
  //onRestart runs when the student presses Play Again or Retry Level
  public renderResults(result: LevelResult, onRestart: () => void): void 
  {
    this.results.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = result.passed
      ? `Level ${result.levelNumber} complete!`
      : `Level ${result.levelNumber} not passed`;

    const summary = document.createElement("p");
    summary.className = "results-summary";
    summary.textContent = `${result.firstTryCorrectCount} of ${result.totalOrders} orders correct on the first try. You needed ${result.requiredToPass} to pass.`;

    const score = document.createElement("p");
    score.className = "results-score";
    score.textContent = `Total score: ${result.score}`;

    //One line per solved order, such as "Order 1: 5/8 (first try)"
    const list = document.createElement("ul");
    list.className = "results-orders";
    result.records.forEach((record, index) => 
    {
      const item = document.createElement("li");
      const fraction = `${record.order.numerator}/${record.order.denominator}`;
      const note = record.firstTryCorrect ? "first try" : "after a retry";
      item.textContent = `Order ${index + 1}: ${fraction} (${note})`;
      list.append(item);
    });

    const button = document.createElement("button");
    button.className = "restart-button";
    button.textContent = result.passed ? "Play Again" : "Retry Level";
    button.addEventListener("click", onRestart);

    this.results.append(title, summary, score, list, button);
    this.results.hidden = false;
  }

  //Hides the results screen when the level restarts
  public hideResults(): void 
  {
    this.results.replaceChildren();
    this.results.hidden = true;
  }
}
