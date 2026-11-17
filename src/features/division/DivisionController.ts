import { DivisionModel } from "./DivisionModel";
import type { DivisionOrder, DivisionResult } from "./types";

export class DivisionController {
  private result: DivisionResult | null = null;

  public constructor(private model: DivisionModel) {}
  public getOrder(): DivisionOrder { return this.model.getOrder(); }
  public getPortions(): number { return this.model.getPortions(); }
  public getResult(): DivisionResult | null { return this.result; }
  public getHint(): string { return this.model.getHint(); }

  public addPortion(): void {
    if (this.result?.type === "correct") return;
    this.model.addPortion();
    this.result = null;
  }

  public removePortion(): void {
    if (this.result?.type === "correct") return;
    this.model.removePortion();
    this.result = null;
  }

  public checkAnswer(): void {
    this.result = this.model.checkAnswer();
  }
}
