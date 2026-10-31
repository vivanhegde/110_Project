import Konva from "konva";
import { PlateController } from "./PlateController";
import { denomToWord } from "../../shared/denomToWord";

export class PlateView {
    private stage : Konva.Stage;
    private layer : Konva.Layer;

    private readonly radius = 100; //pizza radius
    private readonly trayX = 200;  //tray pos (left)
    private readonly trayY = 240;
    private readonly plateX = 600; //plate pos (right)
    private readonly plateY = 240;
    private readonly plateRadius = 120;

    private backgroundLayer: Konva.Layer;
    private labelLayer: Konva.Layer;

    private plateBottomText: Konva.Text;
    private trayBottomText: Konva.Text;
    private numeratorText: Konva.Text;
    private denominatorText: Konva.Text;

    private slices : Konva.Group[] = [];
    private controller : PlateController | null = null;

    private titleText: Konva.Text;
    
    public constructor(containerId : string) {
        this.stage = new Konva.Stage({
            container: containerId,
            width: 800,
            height: 500,
        });

        this.backgroundLayer = new Konva.Layer();
        this.stage.add(this.backgroundLayer);
        this.drawBackground();

        this.labelLayer = new Konva.Layer();
        this.stage.add(this.labelLayer);

        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        this.plateBottomText = new Konva.Text({
            x: this.plateX - 150,
            y: this.plateY + this.plateRadius + 15,
            width: 300,
            align: "center",
            fontSize: 18,
            fill: "#8A6D5A",
            text: "",
        });
        this.labelLayer.add(this.plateBottomText);

        this.trayBottomText = new Konva.Text({
            x: this.trayX - 150,
            y: this.trayY + this.plateRadius + 15,
            width: 300,
            align: "center",
            fontSize: 18,
            fill: "#8A6D5A",
            text: "",
        });

        this.labelLayer.add(this.trayBottomText);
            this.labelLayer.add(new Konva.Text({
            x: this.trayX - 150,
            y: this.trayY - this.plateRadius - 40,
            width: 300,
            align: "center",
            fontSize: 18,
            fontStyle: "bold",
            fill: "#4A2E1F",
            text: "Slice tray",
        }));

        this.labelLayer.add(new Konva.Text({
            x: this.plateX - 150,
            y: this.plateY - this.plateRadius - 40,
            width: 300,
            align: "center",
            fontSize: 18,
            fontStyle: "bold",
            fill: "#4A2E1F",
            text: "Your order plate",
        }));

        const fractionX = 170;
        const fractionY = 440;

        this.labelLayer.add(new Konva.Text({
            x: 20,
            y: fractionY,
            fontSize: 20,
            fill: "#8A6D5A",
            text: "On your plate",
        }));

        this.numeratorText = new Konva.Text({
            x: fractionX-15,
            y: fractionY - 20,
            width: 40,
            align: "center",
            fontSize: 24,
            fontStyle: "bold",
            fill: "#4A2E1F",
            text: "",
        });
        this.labelLayer.add(this.numeratorText);

        this.labelLayer.add(new Konva.Line({
            points: [fractionX - 10, fractionY+10, fractionX + 20, fractionY+10],
            stroke: "#4A2E1F",
            strokeWidth: 2,
        }));

        this.denominatorText = new Konva.Text({
            x: fractionX-15,
            y: fractionY + 15,
            width: 40,
            align: "center",
            fontSize: 24,
            fontStyle: "bold",
            fill: "#4A2E1F",
            text: "",
        });
        this.labelLayer.add(this.denominatorText);

        this.titleText = new Konva.Text({
            x: 30,
            y: 0,
            height: 60,
            verticalAlign: "middle",
            fontSize: 20,
            fontStyle: "bold",
            fill: "#4A2E1F",
            text: "✋ Drag slices onto the plate to make (placeholder)'s order.",
        });
        this.labelLayer.add(this.titleText);

        const midX = (this.trayX + this.plateX) / 2;

        this.labelLayer.add(new Konva.Arrow({
            points: [midX - 22, this.trayY - 10, midX + 22, this.trayY - 10],
            stroke: "#A0603A",
            fill: "#A0603A",
            strokeWidth: 2,
            pointerLength: 8,
            pointerWidth: 10,
            lineCap: "round",
        }));

        this.labelLayer.add(new Konva.Text({
            x: midX - 60,
            y: this.trayY + 15,
            width: 120,
            align: "center",
            fontSize: 15,
            fontStyle: "bold",
            fill: "#A0603A",
            text: "drag slices",
        }));

    }

    public setController(controller: PlateController): void {
        this.controller = controller;
    }

    public setCustomerName(customerName: string): void {
        this.titleText.text(`✋ Drag slices onto the plate to make ${customerName}'s order.`);
    }
    
    private drawBackground(): void {
        const width = this.stage.width();
        const height = this.stage.height();

        const borderWidth = 2;
        const headerHeight = 60;   // white strip above the brown area
        const footerHeight = 90;   // white strip below (fraction, buttons)

        // outlined card
        this.backgroundLayer.add(new Konva.Rect({
            x: borderWidth / 2,
            y: borderWidth / 2,
            width: width - borderWidth,
            height: height - borderWidth,
            cornerRadius: 24,
            fill: "#FFFFFF",
            stroke: "#EADBC8",
            strokeWidth: borderWidth,
        }));

        // brown middle area
        this.backgroundLayer.add(new Konva.Rect({
            x: borderWidth,
            y: headerHeight,
            width: width - borderWidth * 2,
            height: height - headerHeight - footerHeight,
            fill: "#F5E6D3",
        }));

        // tray
        this.backgroundLayer.add(new Konva.Circle({
            x: this.trayX,
            y: this.trayY,
            radius: this.plateRadius+4,
            fill: "#FFF8EC",
            stroke: "#EADBC8",
            strokeWidth: 3,
        }));

        this.backgroundLayer.add(new Konva.Circle({
            x: this.trayX,
            y: this.trayY,
            radius: this.plateRadius-8,
            fill: "#FFF8EC",
            stroke: "#EADBC8",
            strokeWidth: 3,
        }));

        // plate
        this.backgroundLayer.add(new Konva.Circle({
            x: this.plateX,
            y: this.plateY,
            radius: this.plateRadius+4,
            fill: "#FFF8EC",
            stroke: "#EADBC8",
            strokeWidth: 3,
        }));

        this.backgroundLayer.add(new Konva.Circle({
            x: this.plateX,
            y: this.plateY,
            radius: this.plateRadius-8,
            fill: "#FFF8EC",
            stroke: "#EADBC8",
            strokeWidth: 3,
        }));
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
        this.plateBottomText.text(`${slices} of ${denominator} slices placed`);
    }

    public showTrayText(denominator: number): void {
        let denomWord = denomToWord(denominator);
        this.trayBottomText.text(`Each slice is 1 ${denomWord}`);
    }

    public snapToPlateSlot(sliceId: number, slotIndex: number, denominator: number): void {
        const slice = this.slices[sliceId];
        const target = slotIndex * (360 / denominator) - 90;
        slice.to({
            x: this.plateX,
            y: this.plateY,
            rotation: this.nearestRotation(slice.rotation(), target),
            duration: 0.15,
        });
    }

    public snapToTraySlot(sliceId: number, slotIndex: number, denominator: number): void {
        const slice = this.slices[sliceId];
        const target = slotIndex * (360 / denominator) - 90;
        slice.to({
            x: this.trayX,
            y: this.trayY,
            rotation: this.nearestRotation(slice.rotation(), target),
            duration: 0.15,
        });
    }

    // Returns the angle equal to target (mod 360) that is closest to current,
    // so the tween turns the short way.
    private nearestRotation(current: number, target: number): number {
        const diff = ((((target - current) % 360) + 540) % 360) - 180;
        return current + diff;
    }
}