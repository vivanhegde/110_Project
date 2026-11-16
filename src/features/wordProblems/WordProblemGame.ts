import { WordProblemController } from "./WordProblemController";
import { WordProblemView } from "./WordProblemView";
import { WORD_PROBLEMS } from "./problems";

import type { AnswerResult } from "./types";

import "./WordProblemGame.css";

export function startWordProblemGame(
  app: HTMLElement
): void {
  const controller = new WordProblemController(
    WORD_PROBLEMS
  );

  let result: AnswerResult | null = null;
  let hint: string | null = null;
  let answer = "";

  const view = new WordProblemView(app, {
    onCheck: (submittedAnswer) => {
      answer = submittedAnswer;
      result = controller.checkAnswer(answer);
      draw();
    },

    onHint: () => {
      hint = controller.getHint();
      draw();
    },

    onNext: () => {
      const finished = controller.nextProblem();

      if (finished) {
        view.showFinished(() => {
          startWordProblemGame(app);
        });
        return;
      }

      // Reset the screen for the next problem.
      result = null;
      hint = null;
      answer = "";

      draw();
    }
  });

  function draw(): void {
    view.render(
      controller.getCurrentProblem(),
      controller.getCurrentProgress(),
      result,
      hint,
      controller.isSolved(),
      answer
    );
  }

  draw();
}
