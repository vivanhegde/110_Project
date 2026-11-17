import { DivisionModel } from "./DivisionModel";
import { DivisionController } from "./DivisionController";
import { DivisionView } from "./DivisionView";
import { generateDivisionOrders } from "./orders";
import "./DivisionGame.css";

export function startDivisionGame(app: HTMLElement): void {
  const orders = generateDivisionOrders();
  let index = 0;
  let controller = new DivisionController(new DivisionModel(orders[index]));
  let hint: string | null = null;

  const view = new DivisionView(app, {
    onAdd: () => { controller.addPortion(); draw(); },
    onRemove: () => { controller.removePortion(); draw(); },
    onCheck: () => { controller.checkAnswer(); draw(); },
    onHint: () => { hint = controller.getHint(); draw(); },
    onNext: () => {
      if (controller.getResult()?.type !== "correct") return;
      index++;
      if (index === orders.length) {
        view.showFinished(() => startDivisionGame(app));
        return;
      }
      controller = new DivisionController(new DivisionModel(orders[index]));
      hint = null;
      draw();
      app.querySelector<HTMLButtonElement>("#division-add")!.focus();
    },
  });

  function draw(): void {
    view.render(controller.getOrder(), controller.getPortions(), controller.getResult(),
      hint, index + 1, orders.length);
  }
  draw();
}
