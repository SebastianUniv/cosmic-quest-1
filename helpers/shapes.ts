import p5Types from "p5";
import { Coordinate } from "../types/GalaxyMap";
import { Planet } from "../types/Planet";
import { Star } from "../types/Star";
import { scaleWithZoom } from "./scaling";

export const drawBox = (p5: p5Types, planet: Planet, scale: number) => {
  p5.stroke("red");
  p5.strokeWeight(2 / scale);
  p5.noFill();
  const scaledSize = 10 * scaleWithZoom(scale / 1.5);
  const offset = (1 / 2) * scaledSize;
  p5.square(
    planet.coordinate.x - offset,
    planet.coordinate.y - offset,
    scaledSize
  );
};

export const drawPlanet = (
  p5: p5Types,
  planet: Planet,
  scale: number,
  color: string
) => {
  p5.fill(color);
  p5.noStroke();
  p5.circle(
    planet.coordinate.x,
    planet.coordinate.y,
    1.5 * scaleWithZoom(scale)
  );
};

export const drawStar = (p5: p5Types, star: Star, scale: number) => {
  let color = p5.color("#C9AF80");
  p5.fill(color);
  p5.noStroke();
  let angle = p5.TWO_PI / 4;
  let halfAngle = angle / 2.0;
  const radius1 = scaleWithZoom(scale);
  const radius2 = radius1 * 4;
  p5.beginShape();
  for (let a = 0; a < p5.TWO_PI; a += angle) {
    let sx = star.coordinate.x + p5.cos(a) * radius2;
    let sy = star.coordinate.y + p5.sin(a) * radius2;
    p5.vertex(sx, sy);
    sx = star.coordinate.x + p5.cos(a + halfAngle) * radius1;
    sy = star.coordinate.y + p5.sin(a + halfAngle) * radius1;
    p5.vertex(sx, sy);
  }
  p5.endShape("close");
};

export const drawColony = (
  p5: p5Types,
  colony: Planet,
  scale: number,
  color: string
) => {
  p5.fill(p5.color(color));
  p5.noStroke();

  p5.circle(colony.coordinate.x, colony.coordinate.y, 6 * scaleWithZoom(scale));
};

export const drawConnection = (
  p5: p5Types,
  origin: Coordinate,
  destination: Coordinate,
  scale: number,
  color: string
) => {
  p5.stroke(color);
  p5.strokeWeight(scaleWithZoom(scale * 0.7));
  p5.line(origin.x, origin.y, destination.x, destination.y);
};
