import Konva from "konva";
import { PlateController } from "./PlateController";

export class PlateView {
    private stage : Konva.Stage;
    private layer : Konva.Layer;

    private readonly radius = 120; //pizza radius
    private readonly trayX = 200;  //tray pos (left)
    private readonly trayY = 220;
    private readonly plateX = 600; //plate pos (right)
    private readonly plateY = 220;
    private readonly plateRadius = 140;

    private labelLayer: Konva.Layer;
    private placedText: Konva.Text;
    private numeratorText: Konva.Text;
    private denominatorText: Konva.Text;
    private trayBottomText: Konva.Text;
    private trayTitle: Konva.Text;
    private plateTitle: Konva.Text;

    private slices : Konva.Group[] = [];
    private controller : PlateController | null = null;
    
    public constructor(containerId : string) {
        this.stage = new Konva.Stage({
            container: containerId,
            width: 800,
            height: 500,
        });
        this.labelLayer = new Konva.Layer();
        this.stage.add(this.labelLayer);

        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        this.placedText = new Konva.Text({
            x: this.plateX - 150,
            y: this.plateY + this.plateRadius + 15,
            width: 300,
            align: "center",
            fontSize: 18,
            fill: "#8A6D5A",
            text: "",
        });
        this.labelLayer.add(this.placedText);

        const fractionX = 170;
        const fractionY = 440;

        this.labelLayer.add(new Konva.Text({
            x: 20,
            y: fractionY - 10,
            fontSize: 20,
            fill: "#8A6D5A",
            text: "On your plate",
        }));

        this.numeratorText = new Konva.Text({
            x: fractionX,
            y: fractionY - 30,
            width: 40,
            align: "center",
            fontSize: 24,
            fontStyle: "bold",
            fill: "#4A2E1F",
            text: "",
        });
        this.labelLayer.add(this.numeratorText);

        this.labelLayer.add(new Konva.Line({
            points: [fractionX + 5, fractionY, fractionX + 35, fractionY],
            stroke: "#4A2E1F",
            strokeWidth: 2,
        }));

        this.denominatorText = new Konva.Text({
            x: fractionX,
            y: fractionY + 6,
            width: 40,
            align: "center",
            fontSize: 24,
            fontStyle: "bold",
            fill: "#4A2E1F",
            text: "",
        });
        this.labelLayer.add(this.denominatorText);

        this.trayBottomText = new Konva.Text({
            x: fractionX,
            y: fractionY + 6,
            width: 40,
            align: "center",
            fontSize: 24,
            fontStyle: "bold",
            fill: "#4A2E1F",
            text: "",
        });
        this.labelLayer.add(this.trayBottomText);
    }

    public setController(controller: PlateController): void {
        this.controller = controller;
    }
    
    private makeSlice(
        cx: number,
        cy: number,
        radius: number,
        denominator: number,
        index: number
    ): Konva.Group {
        const angle = 360 / denominator;

        // -90 starts the first slice at 12 o'clock instead of 3 o'clock
        const group = new Konva.Group({
            x: cx,
            y: cy,
            rotation: index * angle - 90,
            draggable: true,
        });

        // crust (outer wedge); the stroke draws the gap between slices
        group.add(new Konva.Wedge({
            radius,
            angle,
            fill: "#C8803F",
            stroke: "#FFF8EC",
            strokeWidth: 3,
        }));

        // cheese (inner wedge)
        group.add(new Konva.Wedge({
            radius: radius * 0.88,
            angle,
            fill: "#FFD66B",
        }));

        // pepperoni at the middle of the slice
        const left = (angle / 3) * (Math.PI / 180);
        const mid = (angle / 2) * (Math.PI / 180);
        group.add(new Konva.Circle({
            x: Math.cos(left) * radius * 0.7,
            y: Math.sin(left) * radius * 0.7,
            radius: radius * 0.04,
            fill: "#D84B34",
            stroke: "#AD3426",
            strokeWidth: 1,
        }));

        group.add(new Konva.Circle({
            x: Math.cos(mid) * radius * 0.55,
            y: Math.sin(mid) * radius * 0.55,
            radius: radius * 0.07,
            fill: "#D9453B",
            stroke: "#AD3426",
            strokeWidth: 1,
        }));

        group.on("dragend", () => {
            const controller = this.controller;
            if (!controller) return;

            const pointer = this.stage.getPointerPosition();
            if (!pointer) return;

            const dx = pointer.x - this.plateX;
            const dy = pointer.y - this.plateY;
            const onPlate = Math.sqrt(dx * dx + dy * dy) <= this.plateRadius;

            if (onPlate) {
                controller.sliceDroppedOnPlate(index, denominator);
            } else {
                controller.sliceDroppedOutside(index, denominator);
            }
        });

        return group;
    }

    public drawOrder(denominator: number): void {
        this.layer.destroyChildren();
        this.slices = [];
        for (let i = 0; i < denominator; i++) {
            const slice = this.makeSlice(this.trayX, this.trayY, this.radius, denominator, i);
            this.slices.push(slice);
            this.layer.add(slice);
        }
    }

    public showFraction(slices: number, denominator: number): void {
        this.numeratorText.text(String(slices));
        this.denominatorText.text(String(denominator));
        this.placedText.text(`${slices} of ${denominator} slices placed`);
    }

    public showTrayText(denominator: number): void {
        /*
        switch denominator:
            case 2:
*/
        this.placedText.text(`Each slice is 1 eighth`);
    }

    public snapToPlateSlot(sliceId: number, slotIndex: number, denominator: number): void {
        const slice = this.slices[sliceId];
        slice.to({
            x: this.plateX,
            y: this.plateY,
            rotation: slotIndex * (360 / denominator) - 90,
            duration: 0.15,
        });
    }

    public snapToTraySlot(sliceId: number, slotIndex: number, denominator: number): void {
        const slice = this.slices[sliceId];
        slice.to({
            x: this.trayX,
            y: this.trayY,
            rotation: slotIndex * (360 / denominator) - 90,
            duration: 0.15,
        });
    }

}