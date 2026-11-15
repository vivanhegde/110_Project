import { PlateView } from "./PlateView";
import { PlateModel } from "./PlateModel";

// Import subtraction state and answer types.
import { SubtractionOrderModel } from "../pizza/SubtractionOrderModel";
import type { SubtractionOrder, AnswerResult, CuttingOrder } from "../pizza/types";
import { validDenominators, areEquivalent } from "../../shared/fractions";

export class PlateController {
    private model : PlateModel | null = null;
    private view : PlateView | null = null;
    private subtractionModel: SubtractionOrderModel | null = null; // Active subtraction order.

    private cuttingOrder: CuttingOrder | null = null;
    private cutOptions: number[] = [];
    private cutIndex = 0;

    private onSliceCountChanged: (() => void) | null = null;

    public constructor() {}

    public setModel(model: PlateModel): void {
        this.model = model;
    }
    public setView(view: PlateView): void {
        this.view = view;
    }

    public startOrder(denominator: number): void {
        const view = this.view;
        if (view == null) return;

        // Restore the original addition labels when switching modes.
        if (this.subtractionModel) view.setSubtractionMode(null);
        this.subtractionModel = null;
        this.cuttingOrder = null;

        this.resetPlate(denominator);
    }

    // Empty the plate and redraw every slice on the tray.
    private resetPlate(denominator: number): void {
        const model = this.model;
        const view = this.view;
        if (model == null || view == null) return;

        model.reset(denominator);
        view.drawOrder(denominator);
        view.showFraction(model.getSlicesOnPlate(), denominator);
        view.showTrayText(denominator);
    }

    // Initialize subtraction on the same plate used for dragging.
    public startSubtractionOrder(order: SubtractionOrder): void {
        this.cuttingOrder = null;
        const model = this.model; // Shared plate state.
        const view = this.view; // Shared drag view.
        if (!model || !view) return;

        this.subtractionModel = new SubtractionOrderModel(order, model);
        const current = this.subtractionModel.getOrder(); // Validated order.
        view.setSubtractionMode(current);
        view.drawOrder(current.denominator, current.initialNumerator);

        // Leave the starting slices in the tray, as in the original layout.
        view.showFraction(model.getSlicesOnPlate(), current.denominator);
        view.showTrayText(current.denominator);
    }

    public sliceDroppedOnPlate(sliceId: number, denominator: number): void {
        const model = this.model;
        const view = this.view;
        if (model == null || view == null) return;

        let slotIndex: number;
        if (model.isOnPlate(sliceId)) {
            // moved around on the plate: return to its current slot
            slotIndex = model.getSlot(sliceId);
        } else {
            // Placing a slice on the right takes it away from the left tray.
            if (this.subtractionModel) {
                this.subtractionModel.removeSlice(sliceId);
                slotIndex = model.getSlot(sliceId);
            } else {
                slotIndex = model.placeSlice(sliceId);
            }
        }

        view.snapToPlateSlot(sliceId, slotIndex, denominator);
        view.showFraction(model.getSlicesOnPlate(), denominator);
        this.onSliceCountChanged?.();
    }

    public sliceDroppedOutside(sliceId: number, denominator: number): void {
        const model = this.model;
        const view = this.view;
        if (model == null || view == null) return;

        if (model.isOnPlate(sliceId)) {
            // Preserve the original return-to-tray behavior for both operations.
            if (this.subtractionModel) {
                this.subtractionModel.restoreSlice(sliceId);
            } else {
                model.removeSlice(sliceId);
            }
        }

        // a slice's tray position is its own id
        view.snapToTraySlot(sliceId, sliceId, denominator);
        view.showFraction(model.getSlicesOnPlate(), denominator);
        this.onSliceCountChanged?.();
    }

    // Check the same slice state that is shown on screen.
    public submitSubtractionAnswer(): AnswerResult {
        if (!this.subtractionModel) throw new Error("No subtraction order is active");
        return this.subtractionModel.checkAnswer();
    }

    // Read the amount left in the tray rather than the amount moved right.
    public getRemainingSlices(): number {
        if (!this.subtractionModel) throw new Error("No subtraction order is active");
        return this.subtractionModel.getSelectedSlices();
    }

    public getSlicesOnPlate(): number {
        return this.model == null ? 0 : this.model.getSlicesOnPlate();
    }

    public isSliceOnPlate(sliceId: number): boolean {
        return this.model == null ? false : this.model.isOnPlate(sliceId);
    }

    //Register a callback to be called when the slice count changes
    public setOnSliceCountChanged(
        callback: () => void
    ): void {
        this.onSliceCountChanged = callback;
    }

        // Start an order where the student cuts the pizza into a target denominator.
    public startCuttingOrder(order: CuttingOrder): void {
        const view = this.view;
        if (view == null) return;

        const options = validDenominators(order.numerator, order.denominator);
        if (!options.includes(order.targetDenominator)) {
            throw new Error("Target denominator cannot show this fraction: " + order.targetDenominator);
        }

        if (this.subtractionModel) view.setSubtractionMode(null);
        this.subtractionModel = null;

        this.cuttingOrder = { ...order };
        this.cutOptions = options;
        this.cutIndex = options.indexOf(order.denominator);
        this.resetPlate(order.denominator);
    }

    // Move to the next smaller (-1) or larger (+1) valid denominator.
    // Every slice returns to the tray, cut to the new size.
    public stepDenominator(direction: 1 | -1): void {
        if (!this.canStepDenominator(direction)) return;

        this.cutIndex += direction;
        this.resetPlate(this.cutOptions[this.cutIndex]);
        this.onSliceCountChanged?.();
    }

    // Lets the view disable a button at either end of the options.
    public canStepDenominator(direction: 1 | -1): boolean {
        if (this.cuttingOrder == null) return false;
        const next = this.cutIndex + direction;
        return next >= 0 && next < this.cutOptions.length;
    }

    // True when the plate shows the same amount using the target denominator.
    public isAnswerValid(): boolean {
        const order = this.cuttingOrder;
        const model = this.model;
        if (order == null || model == null) return false;

        const denominator = model.getDenominator();
        return denominator === order.targetDenominator
            && areEquivalent(model.getSlicesOnPlate(), denominator, order.numerator, order.denominator);
    }
    
    public getDenominator(): number {
        return this.model == null ? 0 : this.model.getDenominator();
    }
}
