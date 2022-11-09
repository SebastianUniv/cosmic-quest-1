import { useRef } from "react";
import { Coordinate } from "../types/GalaxyMap";
import { Planet } from "../types/Planet";

type EsiFactors = {
  radius: number;
  mass: number;
  temperature: number;
};

type ScoringFactors = {
  distance: number;
} & EsiFactors;

function _calcESI(factors: EsiFactors): number {
  const { radius, mass, temperature } = factors;
  const baseline = [1, 1, 1, 288];
  const baselineWeights = [0.57, 1.07, 0.7, 5.58];

  if (radius === 0 || mass === 0) {
    return 0;
  }

  const rho = mass / Math.pow(radius, 3);
  const vel = Math.sqrt(mass / radius);

  const contested = [radius, rho, vel, temperature];

  let calculatedESI = [];

  for (let i = 0; i < baseline.length; i++) {
    const calc =
      1 - Math.abs((contested[i] - baseline[i]) / (contested[i] + baseline[i]));
    calculatedESI.push(Math.pow(calc, baselineWeights[i]));
  }

  const score = Math.pow(
    calculatedESI.reduce((prev, current) => {
      return prev * current;
    }, 1),
    1 / calculatedESI.length
  );

  return score;
}

function _scorePlanet(factors: ScoringFactors): number {
  const esiScore = _calcESI(factors);
  const distanceScore = Math.exp(-0.00005 * factors.distance) * 10;

  return esiScore * distanceScore * 10;
}

function _closestColony(colonies: Planet[], planet: Planet) {
  let leastDistance = -1;
  let closestPlanet: Planet;

  colonies.forEach((colony) => {
    const a = colony.coordinate.x - planet.coordinate.x;
    const b = colony.coordinate.y - planet.coordinate.y;
    const distance = Math.hypot(a, b);

    if (distance < leastDistance) {
      leastDistance = distance;
      closestPlanet = colony;
    }

    if (leastDistance < 0) {
      leastDistance = distance;
      closestPlanet = colony;
    }
  });

  return { leastDistance, closestPlanet: closestPlanet! };
}

type PlanetScoreMap = Map<
  string,
  { origin: Planet | undefined; score: number }
>;

interface RecommenderHook {
  recommend: (planets: Planet[], colonies: Planet[] | undefined) => void;
  getPlanetScore: (
    planet: Planet,
    colonies?: Planet[]
  ) => { planetScore: number; closestPlanet: Planet | undefined };
  getNextColonies: () => Planet[] | undefined;
  getNextConnections: () => [Coordinate, Coordinate][] | undefined;
  reset: () => void;
}

export default function useRecommender(): RecommenderHook {
  const planetScores = useRef<PlanetScoreMap>(
    new Map<string, { origin: Planet | undefined; score: number }>()
  );
  const nextColonies = useRef<Planet[]>();
  const nextConnections = useRef<[Coordinate, Coordinate][]>();

  const recommend = (planets: Planet[], colonies: Planet[] | undefined) => {
    let highestScore = 0;

    planets.forEach((planet) => {
      if (colonies && colonies.includes(planet)) {
        return;
      }

      const { planetScore, closestPlanet } = getPlanetScore(planet, colonies);

      planetScores.current?.set(planet.id, {
        score: planetScore,
        origin: closestPlanet,
      });

      // if (planetScore === highestScore) {
      //   nextColonies.current?.push(planet);

      //   if (closestPlanet) {
      //     nextConnections.current?.push([
      //       closestPlanet?.coordinate,
      //       planet.coordinate,
      //     ]);
      //   }
      // }

      if (planetScore > highestScore) {
        highestScore = planetScore;
        nextColonies.current = [planet];

        if (closestPlanet) {
          nextConnections.current = [
            [closestPlanet?.coordinate, planet.coordinate],
          ];
        }
      }
    });
  };

  const getPlanetScore = (planet: Planet, colonies?: Planet[]) => {
    let leastDistance, closestPlanet;

    if (colonies) {
      ({ leastDistance, closestPlanet } = _closestColony(colonies, planet));
    }

    const planetScore = _scorePlanet({
      distance: leastDistance ? leastDistance : 1,
      mass: planet.mass,
      radius: planet.radius,
      temperature: planet.temperature,
    });

    return {
      closestPlanet,
      planetScore,
    };
  };

  const getNextColonies = (): Planet[] | undefined => {
    return nextColonies.current;
  };

  const getNextConnections = (): [Coordinate, Coordinate][] | undefined => {
    return nextConnections.current;
  };

  const reset = () => {
    nextColonies.current = [];
    nextConnections.current = [];
  };

  return {
    recommend,
    getPlanetScore,
    getNextColonies,
    getNextConnections,
    reset,
  };
}
