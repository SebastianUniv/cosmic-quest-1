import { Coordinate } from "../types/GalaxyMap";

export function scaleCoordinateToPixels(
  c: Coordinate,
  screenWidth: number,
  screenHeight: number
): Coordinate {
  const factorY = 100000 / screenHeight;
  const factorX = 100000 / screenWidth;
  const x = c.x / factorX + (1 / 2) * screenWidth;
  const y = c.y / factorY + (1 / 2) * screenHeight;
  return { x, y };
}

export function scaleWithZoom(currentScale: number) {
  return 0.8 / (currentScale - 0.2) + 0.2;
}
