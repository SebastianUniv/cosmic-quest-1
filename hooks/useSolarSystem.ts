import { useRef, useState } from "react";
import { normal, getRandomName, randomInteger } from "../helpers/random";
import { Coordinate, GalaxyMap } from "../types/GalaxyMap";
import { Planet } from "../types/Planet";
import { Star } from "../types/Star";
import useRecommender from "./useRecommender";
import gamma from "@stdlib/random-base-gamma";

export interface SolarSystemHook {
  exists: () => boolean;
  generate: () => GalaxyMap;
  getPlanets: () => Planet[];
  getStars: () => Star[];
  getPlanetsByStar: (star: Star) => Planet[] | undefined;
}

function _createStar(): Star {
  let r = normal(25000, 20000);
  let angle = r / 10000 + randomInteger(0, 1) * Math.PI;
  angle += normal((Math.PI * r) / 40000, (Math.PI * r) / 40000);

  if (r > 100000) {
    r = 100000 - (r - 100000);
  }

  return {
    id: getRandomName(),
    coordinate: {
      x: r * Math.cos(angle),
      y: r * Math.sin(angle),
    },
  };
}

function _createStars(count: number): Star[] {
  let stars: Star[] = [];

  for (let i = 0; i < count; i++) {
    stars.push(_createStar());
  }

  return stars;
}

function _createPlanets(star: Star, min: number, max: number): Planet[] {
  const count = Math.random() * max;
  let planets: Planet[] = [];

  const randRadius = gamma.factory(2, 1 / 2);
  const randMass = gamma.factory(1, 1 / 400);
  const randTemp = gamma.factory(2, 1 / 150);

  for (let i = 0; i < count; i++) {
    let r = normal(25_0, 5_0);
    let angle = Math.random() * 2 * Math.PI;
    if (r > 100_0) r = 100_0 - (r - 100_0);

    planets.push({
      id: getRandomName(),
      coordinate: {
        x: star.coordinate.x + r * Math.cos(angle),
        y: star.coordinate.y + r * Math.sin(angle),
      },
      mass: randMass(),
      radius: randRadius(),
      temperature: randTemp(),
    });
  }

  return planets;
}

export default function useSolarSystems(): SolarSystemHook {
  const galaxy = useRef<GalaxyMap>();

  const exists = () => {
    return galaxy.current ? true : false;
  };

  const generate = () => {
    const stars = _createStars(2000);
    const planets: Map<string, Planet[]> = new Map<string, Planet[]>();

    stars.forEach((star) => {
      const generatedPlanets = _createPlanets(star, 1, 5);
      planets.set(star.id, generatedPlanets);
    });

    galaxy.current = { stars, planets };

    return galaxy.current;
  };

  const getPlanets = () => {
    const planets: Planet[] = [];
    if (!galaxy.current) {
      throw new Error("Galaxy not initialised");
    }

    for (const starPlanets of galaxy.current.planets.values()) {
      planets.push(...starPlanets);
    }

    return planets;
  };

  const getStars = () => {
    if (!galaxy.current) {
      throw new Error("Galaxy not initialised");
    }
    return galaxy.current.stars;
  };

  const getPlanetsByStar = (star: Star) => {
    if (!galaxy.current) {
      throw new Error("Galaxy not initialised");
    }

    return galaxy.current.planets.get(star.id);
  };

  return {
    exists,
    generate,
    getPlanets,
    getStars,
    getPlanetsByStar,
  };
}
