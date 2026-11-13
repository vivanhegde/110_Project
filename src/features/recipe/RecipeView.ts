import type { Recipe, RecipeResult } from "./types";

export interface RecipeHandlers {
  onAdd: () => void;
  onRemove: () => void;
  onCheck: () => void;
  onNext: () => void;
}

export class RecipeView {
  private root: HTMLElement;
  private handlers: RecipeHandlers;

  //The page gives the view a box to draw in and what to do when buttons are pressed
  public constructor(root: HTMLElement, handlers: RecipeHandlers) {
    this.root = root;
    this.handlers = handlers;
  }

  //Redraws the whole screen from the current recipe, scoops, and result
  public render(recipe: Recipe, scoops: number, result: RecipeResult | null, recipeNumber: number, totalRecipes: number): void {
    this.root.innerHTML = "";
    const scoopSize = `1/${recipe.denominator}`;

    const title = document.createElement("h1");
    title.textContent = "Recipe Scaling";
    this.root.appendChild(title);

    const progress = document.createElement("p");
    progress.className = "recipe-progress";
    progress.textContent = `Recipe ${recipeNumber} of ${totalRecipes}`;
    this.root.appendChild(progress);

    const prompt = document.createElement("p");
    prompt.className = "recipe-prompt";
    prompt.textContent =
      `The recipe needs ${recipe.numerator}/${recipe.denominator} cup of ${recipe.ingredient}. ` +
      `Make the recipe ${recipe.multiplier} times bigger!`;
    this.root.appendChild(prompt);

    //One measuring cup box for each scoop the student added
    const cups = document.createElement("div");
    cups.className = "recipe-cups";
    for (let i = 0; i < scoops; i++) {
      const cup = document.createElement("span");
      cup.className = "recipe-cup";
      cup.textContent = scoopSize + " cup";
      cups.appendChild(cup);
    }
    this.root.appendChild(cups);

    const total = document.createElement("p");
    total.className = "recipe-total";
    total.textContent = `You measured: ${scoops}/${recipe.denominator} cup`;
    this.root.appendChild(total);

    const solved = result !== null && result.type === "correct";

    if (solved) {
      this.root.appendChild(this.makeButton("recipe-next", "Next Recipe", this.handlers.onNext));
    } else {
      this.root.appendChild(this.makeButton("recipe-add", "+ Add " + scoopSize + " cup", this.handlers.onAdd));
      this.root.appendChild(this.makeButton("recipe-remove", "− Remove", this.handlers.onRemove));
      this.root.appendChild(this.makeButton("recipe-check", "Check", this.handlers.onCheck));
    }

    if (result !== null) {
      const feedback = document.createElement("div");
      feedback.className = "recipe-feedback";
      feedback.dataset.result = result.type;

      const feedbackTitle = document.createElement("h2");
      feedbackTitle.textContent = result.title;
      feedback.appendChild(feedbackTitle);

      const message = document.createElement("p");
      message.className = "recipe-message";
      message.textContent = result.message;
      feedback.appendChild(message);

      if (result.hint) {
        const hint = document.createElement("p");
        hint.className = "recipe-hint";
        hint.textContent = "Hint: " + result.hint;
        feedback.appendChild(hint);
      }

      this.root.appendChild(feedback);
    }
  }

  //Shown after the last recipe
  public showFinished(onPlayAgain: () => void): void {
    this.root.innerHTML = "";

    const title = document.createElement("h1");
    title.textContent = "All recipes done!";
    this.root.appendChild(title);

    const message = document.createElement("p");
    message.textContent = "Great job, chef! You scaled every recipe.";
    this.root.appendChild(message);

    this.root.appendChild(this.makeButton("recipe-play-again", "Play Again", onPlayAgain));
  }

  private makeButton(className: string, label: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
  }
}