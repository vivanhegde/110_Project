import { PlateView } from "./PlateView";
import { PlateModel } from "./PlateModel";

export class PlateController {
    private model : PlateModel | null = null;
    private view : PlateView | null = null;

    public constructor() {}

    public setModel(model: PlateModel): void {
        this.model = model;
    }
    public setView(view: PlateView): void {
        this.view = view;
    }

    public startOrder(denominator: number): void {
        const model = this.model;
        const view = this.view;
        if (model==null || view == null) return;

        model.reset(denominator);
        view.drawOrder(denominator);
        view.showFraction(model.getSlicesOnPlate(), denominator);
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
            slotIndex = model.placeSlice(sliceId);
        }

        view.snapToPlateSlot(sliceId, slotIndex, denominator);
        view.showFraction(model.getSlicesOnPlate(), denominator);
    }

    public sliceDroppedOutside(sliceId: number, denominator: number): void {
        const model = this.model;
        const view = this.view;
        if (model == null || view == null) return;

        if (model.isOnPlate(sliceId)) {
            model.removeSlice(sliceId);
        }

        // a slice's tray position is its own id
        view.snapToTraySlot(sliceId, sliceId, denominator);
        view.showFraction(model.getSlicesOnPlate(), denominator);
    }

    public getSlicesOnPlate(): number {
        return this.model == null ? 0 : this.model.getSlicesOnPlate();
    }

}