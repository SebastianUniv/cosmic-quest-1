import { scaleCoordinateToPixels } from "../helpers/scaling";
import { Coordinate } from "../types/GalaxyMap";
import useWindowDimensions from "./useWindowDimensions";

interface PixelMapperHook {
  scaleGalaxyCoordinate: (c: Coordinate) => Coordinate;
  scaleGalaxyLocationOfBody: <T extends { coordinate: Coordinate }>(
    body: T
  ) => T;
}

export default function usePixelMapper(): PixelMapperHook {
  const { width, height } = useWindowDimensions();

  const scaleGalaxyCoordinate = (c: Coordinate) => {
    return scaleCoordinateToPixels(c, width, height);
  };

  const scaleGalaxyLocationOfBody = <T extends { coordinate: Coordinate }>(
    body: T
  ): T => {
    const transformedBody = { ...body };

    transformedBody.coordinate = scaleGalaxyCoordinate(body.coordinate);

    return transformedBody;
  };

  return { scaleGalaxyCoordinate, scaleGalaxyLocationOfBody };
}
