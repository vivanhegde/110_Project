import { PlateModel } from "./PlateModel";
import { PlateController } from "./PlateController";
import { PlateView } from "./PlateView";
import { CUTTING_ORDERS } from "./cuttingOrders";
import { denomToWord } from "../../shared/denomToWord";

import "./CuttingGame.css";

// Test page for cutting orders (?mode=cutting). No feedback or hints, only a valid / not valid result.
export function startCuttingGame(app: HTMLElement): void {
    app.innerHTML = `
        <section class="cutting-card">
            <p id="cutting-prompt" class="cutting-prompt"></p>

            <div id="cutting-plate" class="cutting-plate"></div>

            <div class="cutting-controls">
                <div class="cutting-selected">
                    <span>On your plate</span>
                    <span class="cutting-fraction">
                        <span id="cutting-numerator" class="cutting-fraction-numerator">0</span>
                        <span class="cutting-denominator-row">
                            <button id="cutting-cut-left" class="cutting-cut" type="button"
                                    aria-label="Bigger slices">◀</button>
                            <span id="cutting-denominator">0</span>
                            <button id="cutting-cut-right" class="cutting-cut" type="button"
                                    aria-label="Smaller slices">▶</button>
                        </span>
                    </span>
                </div>

                <div class="cutting-buttons">
                    <span id="cutting-result" class="cutting-result"></span>
                    <button id="cutting-next" class="cutting-secondary" type="button">Next Order</button>
                    <button id="cutting-check" class="cutting-primary" type="button">Check Order</button>
                </div>
            </div>
        </section>
    `;

    const prompt = element("cutting-prompt");
    const numerator = element("cutting-numerator");
    const denominator = element("cutting-denominator");
    const cutLeft = element("cutting-cut-left") as HTMLButtonElement;
    const cutRight = element("cutting-cut-right") as HTMLButtonElement;
    const result = element("cutting-result");

    const model = new PlateModel(CUTTING_ORDERS[0].denominator);
    const view = new PlateView("cutting-plate");
    const controller = new PlateController();
    controller.setModel(model);
    controller.setView(view);
    view.setController(controller);

    // Show the current plate amount and which cuts are still possible.
    function refresh(): void {
        numerator.textContent = String(controller.getSlicesOnPlate());
        denominator.textContent = String(controller.getDenominator());
        cutLeft.disabled = !controller.canStepDenominator(-1);
        cutRight.disabled = !controller.canStepDenominator(1);
    }

    // Runs after every slice move and every cut.
    controller.setOnSliceCountChanged(() => {
        result.textContent = "";
        refresh();
    });

    cutLeft.addEventListener("click", () => controller.stepDenominator(-1));
    cutRight.addEventListener("click", () => controller.stepDenominator(1));

    let index = 0;

    function beginOrder(): void {
        const order = CUTTING_ORDERS[index];
        prompt.textContent =
            `Order ${index + 1} of ${CUTTING_ORDERS.length}: ` +
            `put ${order.numerator}/${order.denominator} of a pizza on your plate, using ${denomToWord(order.targetDenominator, true)}.`;
        result.textContent = "";
        controller.startCuttingOrder(order);
        refresh();
    }

    element("cutting-check").addEventListener("click", () => {
        result.textContent = controller.isAnswerValid() ? "Valid" : "Not valid";
    });

    element("cutting-next").addEventListener("click", () => {
        index = (index + 1) % CUTTING_ORDERS.length;
        beginOrder();
    });

    beginOrder();
}

function element(id: string): HTMLElement {
    const found = document.getElementById(id);
    if (!found) throw new Error("Missing element: " + id);
    return found;
}