import { Planet } from "./Planet";
import { Star } from "./Star";

export type GalaxyMap = {
  planets: Map<string, Planet[]>;
  stars: Star[];
};

export type Coordinate = {
  x: number;
  y: number;
};
