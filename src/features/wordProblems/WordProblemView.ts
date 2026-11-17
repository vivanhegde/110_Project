import type {
  WordProblem,
  AnswerResult,
  GameProgress
} from "./types";

export interface WordProblemHandlers {
  onCheck: (answer: string) => void;
  onHint: () => void;
  onNext: () => void;
}

export class WordProblemView {
  private root: HTMLElement;
  private handlers: WordProblemHandlers;

  constructor(
    root: HTMLElement,
    handlers: WordProblemHandlers
  ) {
    this.root = root;
    this.handlers = handlers;
  }

  public render(
    problem: WordProblem,
    progress: GameProgress,
    result: AnswerResult | null,
    hint: string | null,
    solved: boolean,
    currentAnswer: string
  ): void {
    this.root.innerHTML = "";

    const container = document.createElement("main");
    container.className = "word-game";

    const title = document.createElement("h1");
    title.textContent = "Fraction Food Truck";
    container.appendChild(title);

    const subtitle = document.createElement("h2");
    subtitle.textContent = "Word Problem Challenge";
    container.appendChild(subtitle);

    const progressText = document.createElement("p");
    progressText.className = "word-progress";
    progressText.textContent =
      `Problem ${progress.current} of ${progress.total}`;
    container.appendChild(progressText);

    // Display the customer's word problem.
    const problemCard = document.createElement("section");
    problemCard.className = "word-problem-card";

    const problemTitle = document.createElement("h3");
    problemTitle.textContent = problem.title;

    const question = document.createElement("p");
    question.className = "word-question";
    question.textContent = problem.question;

    problemCard.append(problemTitle, question);
    container.appendChild(problemCard);

    // Answer entry.
    const answerLabel = document.createElement("label");
    answerLabel.textContent = "Your answer:";
    answerLabel.htmlFor = "word-answer";
    container.appendChild(answerLabel);

    const input = document.createElement("input");
    input.id = "word-answer";
    input.className = "word-answer-input";
    input.type = "text";
    input.placeholder = "Example: 3/4";
    input.value = currentAnswer;
    input.disabled = solved;
    container.appendChild(input);

    // Action buttons.
    const controls = document.createElement("div");
    controls.className = "word-controls";

    if (!solved) {
      const checkButton = this.makeButton(
        "Check Answer",
        () => this.handlers.onCheck(input.value)
      );

      const hintButton = this.makeButton(
        "Get Hint",
        this.handlers.onHint
      );

      controls.append(checkButton, hintButton);

      // Allow Enter to submit.
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          this.handlers.onCheck(input.value);
        }
      });
    } else {
      const nextLabel =
        progress.current === progress.total
          ? "Finish"
          : "Next Problem";

      const nextButton = this.makeButton(
        nextLabel,
        this.handlers.onNext
      );

      controls.appendChild(nextButton);
    }

    container.appendChild(controls);

    // Show a hint when requested.
    if (hint !== null) {
      const hintBox = document.createElement("div");
      hintBox.className = "word-hint";
      hintBox.textContent = `Hint: ${hint}`;
      container.appendChild(hintBox);
    }

    // Show answer feedback.
    if (result !== null) {
      const feedback = document.createElement("div");
      feedback.className = result.correct
        ? "word-feedback correct"
        : "word-feedback incorrect";

      const feedbackMessage = document.createElement("p");
      feedbackMessage.textContent = result.message;
      feedback.appendChild(feedbackMessage);

      if (result.explanation) {
        const explanation = document.createElement("p");
        explanation.className = "word-explanation";
        explanation.textContent = result.explanation;
        feedback.appendChild(explanation);
      }

      container.appendChild(feedback);
    }

    this.root.appendChild(container);
  }

  public showFinished(onRestart: () => void): void {
    this.root.innerHTML = "";

    const container = document.createElement("main");
    container.className = "word-game word-finished";

    const title = document.createElement("h1");
    title.textContent = "Great job, chef!";

    const message = document.createElement("p");
    message.textContent =
      "You completed all the fraction word problems!";

    const restartButton = this.makeButton(
      "Play Again",
      onRestart
    );

    container.append(title, message, restartButton);
    this.root.appendChild(container);
  }

  private makeButton(
    label: string,
    onClick: () => void
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", onClick);

    return button;
  }
}
