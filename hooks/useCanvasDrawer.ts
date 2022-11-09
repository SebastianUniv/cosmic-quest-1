import p5Types from "p5";
import { MutableRefObject, useContext, useRef } from "react";
import { scaleCoordinateToPixels } from "../helpers/scaling";
import { drawBox } from "../helpers/shapes";
import { GalaxyContext } from "../organisms/galaxy/context";
import { PrinterHook } from "./usePrinter";
import useUserControls from "./useUserControls";
import useWindowDimensions from "./useWindowDimensions";

export type CameraState = {
  currentScale: MutableRefObject<number>;
  transformX: MutableRefObject<number>;
  transformY: MutableRefObject<number>;
};

export default function useCanvasDrawer(printer: PrinterHook) {
  const camera: CameraState = {
    currentScale: useRef(1),
    transformX: useRef(0),
    transformY: useRef(0),
  };

  const { width, height } = useWindowDimensions();
  const { createControls } = useUserControls();
  const { selectedPlanet } = useContext(GalaxyContext);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const cnv = p5.createCanvas(width, height).parent(canvasParentRef);

    const { click, release, press, mouse, drag } = createControls(p5, camera);

    cnv.mouseWheel((event: any) => mouse(event));
    cnv.mousePressed(() => press());
    cnv.mouseReleased(() => release());
    cnv.mouseMoved(() => drag());
    cnv.mouseClicked(() => click());
  };

  const draw = (p5: p5Types) => {
    p5.background("#1B191B");
    p5.push();
    p5.translate(camera.transformX.current, camera.transformY.current);
    p5.scale(camera.currentScale.current);
    printer.print(p5, camera.currentScale.current);
    // TODO: Move this somewhere else
    if (selectedPlanet.current) {
      const planet = {
        ...selectedPlanet.current,
        coordinate: scaleCoordinateToPixels(
          selectedPlanet.current.coordinate,
          width,
          height
        ),
      };

      drawBox(p5, planet, camera.currentScale.current);
    }

    p5.pop();
  };

  return { setup, draw };
}
