import { Coordinate } from "./GalaxyMap";

export type Planet = {
  id: string;
  coordinate: Coordinate;
  //dist_to_star: number; probably calculate this?
  mass: number;
  radius: number;
  temperature: number;
  //status: PlanetState; set this in hook with hashmap of ids
  //habitable: number; this should probably be part of another object?
};
