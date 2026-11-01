
export class PlateModel {
    private denominator = 0;
    private plateSlots : (number | null)[] = [];

    public constructor(denominator: number) {
        this.reset(denominator);
    }

    public reset(denominator: number): void {
        if (!Number.isInteger(denominator) || denominator < 2 || denominator > 12) {
            throw new Error("Invalid denominator (needs to be 2-12), current: " + denominator);
        }
        this.denominator = denominator;
        this.plateSlots = new Array(denominator).fill(null);
    }

    public placeSlice(sliceId: number): number {
        if (this.plateSlots.includes(sliceId)) {
            throw new Error("Slice is already on the plate");
        }

        const slot = this.plateSlots.indexOf(null);
        if (slot === -1) {
            throw new Error("Plate is full");
        }
        this.plateSlots[slot] = sliceId;
        return slot;
    }

    public removeSlice(sliceId: number): number {
        const slot = this.plateSlots.indexOf(sliceId);

        if (slot === -1) {
            throw new Error("Slice is not on the plate");
        }

        this.plateSlots[slot] = null;
        return slot;
    }

    public getSlicesOnPlate(): number {
        return this.plateSlots.filter((s) => s !== null).length;
    }

    public isOnPlate(sliceId: number): boolean {
        return this.plateSlots.includes(sliceId);
    }

    public getSlot(sliceId: number): number {
        return this.plateSlots.indexOf(sliceId);
    }

    public getDenominator(): number {
        return this.denominator;
    }

}