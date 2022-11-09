import p5Types from "p5";
import { useContext, useRef } from "react";
import { scaleCoordinateToPixels } from "../helpers/scaling";
import { GalaxyContext } from "../organisms/galaxy/context";
import { Planet } from "../types/Planet";
import { CameraState } from "./useCanvasDrawer";
import useWindowDimensions from "./useWindowDimensions";

export default function useUserControls() {
  let p5: p5Types;
  let camera: CameraState;

  let zoomSensitivity = 0.1;
  let isMouseDragged = false;
  let mousePressedX = useRef(0);
  let mousePressedY = useRef(0);
  let mouseX = useRef(1000);
  let mouseY = useRef(1000);

  let {
    galaxy: {
      solarSystems: { getPlanets },
    },
    selectedPlanet,
    setSelectedPlanet,
  } = useContext(GalaxyContext);
  const { width, height } = useWindowDimensions();

  const createControls = (p5Ref: p5Types, cameraState: CameraState) => {
    p5 = p5Ref;
    camera = cameraState;

    return { click, release, press, mouse, drag };
  };

  const click = () => {
    const x =
      p5.mouseX / camera.currentScale.current -
      camera.transformX.current / camera.currentScale.current;
    const y =
      p5.mouseY / camera.currentScale.current -
      camera.transformY.current / camera.currentScale.current;

    let closestDistance = -1;
    let closestPlanet: Planet | undefined;

    // TODO: move this elsewhere
    getPlanets().forEach((planet) => {
      const c = scaleCoordinateToPixels(planet.coordinate, width, height);
      const a = c.x - x;
      const b = c.y - y;
      const distance = Math.hypot(a, b);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPlanet = planet;
      }

      if (closestDistance === -1) {
        closestDistance = distance;
        closestPlanet = planet;
      }
    });

    if (closestPlanet) {
      selectedPlanet.current = closestPlanet;
      setSelectedPlanet(closestPlanet);
    }
  };

  const release = () => {
    mousePressedX.current = 0;
    mousePressedY.current = 0;
    isMouseDragged = false;
  };

  const press = () => {
    mousePressedX.current = p5.mouseX;
    mousePressedY.current = p5.mouseY;
    isMouseDragged = true;
  };

  const mouse = (event: any) => {
    event.preventDefault();
    // Determine the scale factor based on zoom sensitivity
    let scaleFactor = null;
    if (event.deltaY < 0) {
      // Zoom in
      scaleFactor = 1 + zoomSensitivity;
    } else {
      // Zoom out
      scaleFactor = 1 - zoomSensitivity;
    }
    if (p5.mouseX !== 0 && p5.mouseY !== 0) {
      mouseX.current = p5.mouseX;
      mouseY.current = p5.mouseY;
    }

    if (
      !(camera.currentScale.current * scaleFactor > 40) &&
      !(camera.currentScale.current * scaleFactor < 0.65)
    ) {
      camera.currentScale.current = camera.currentScale.current * scaleFactor;
      camera.transformX.current =
        mouseX.current -
        mouseX.current * scaleFactor +
        camera.transformX.current * scaleFactor;
      camera.transformY.current =
        mouseY.current -
        mouseY.current * scaleFactor +
        camera.transformY.current * scaleFactor;
    }

    // Disable page scroll
    return false;
  };

  const drag = () => {
    mouseX.current = p5.mouseX;
    mouseY.current = p5.mouseY;

    if (isMouseDragged) {
      camera.transformX.current +=
        (mouseX.current - mousePressedX.current!) * 0.3;
      camera.transformY.current +=
        (mouseY.current - mousePressedY.current!) * 0.3;
    }
  };

  return { createControls };
}
