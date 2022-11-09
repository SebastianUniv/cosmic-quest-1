import { useRef } from "react";
import { Coordinate } from "../types/GalaxyMap";
import { Planet } from "../types/Planet";

export interface ColoniesHook {
  getCurrentColonies: () => Planet[] | undefined;
  getCurrentConnections: () => [Coordinate, Coordinate][] | undefined;
  setCurrent: (
    colonies?: Planet[],
    connections?: [Coordinate, Coordinate][]
  ) => void;
  getPlannedColonies: () => Planet[] | undefined;
  getPlannedConnections: () => [Coordinate, Coordinate][] | undefined;
  setPlanned: (
    colonies?: Planet[],
    connections?: [Coordinate, Coordinate][]
  ) => void;
}

export default function useColonies(): ColoniesHook {
  let currentColonies = useRef<Planet[]>();
  let currentConnections = useRef<[Coordinate, Coordinate][]>();
  let plannedColonies = useRef<Planet[]>();
  let plannedConnections = useRef<[Coordinate, Coordinate][]>();

  const getCurrentColonies = () => {
    return currentColonies.current;
  };

  const getCurrentConnections = () => {
    return currentConnections.current;
  };

  const setCurrent = (
    colonies: Planet[] = [],
    connections: [Coordinate, Coordinate][] = []
  ): void => {
    if (!colonies.length) {
      currentColonies.current = [];
      currentConnections.current = [];
    }

    if (currentColonies.current) {
      currentColonies.current = [...currentColonies.current, ...colonies];
    } else {
      currentColonies.current = [...colonies];
    }

    if (!connections.length) return;

    if (currentConnections.current) {
      currentConnections.current = [
        ...currentConnections.current,
        ...connections,
      ];
    } else {
      currentConnections.current = [...connections];
    }
  };

  const getPlannedColonies = () => {
    return plannedColonies.current;
  };

  const getPlannedConnections = () => {
    return plannedConnections.current;
  };

  const setPlanned = (
    colonies: Planet[] = [],
    connections: [Coordinate, Coordinate][] = []
  ) => {
    plannedColonies.current = colonies;
    plannedConnections.current = connections;
  };

  return {
    getCurrentColonies,
    getCurrentConnections,
    setCurrent,
    getPlannedColonies,
    getPlannedConnections,
    setPlanned,
  };
}
