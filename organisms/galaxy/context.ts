import {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
} from "react";
import { GalaxyHook } from "../../hooks/useGalaxy";
import { Planet } from "../../types/Planet";

type GalaxyContext = {
  galaxy: GalaxyHook;
  selectedPlanet: MutableRefObject<Planet | undefined>;
  setSelectedPlanet: (planet: Planet) => void;
};

export const GalaxyContext = createContext<GalaxyContext>({
  galaxy: undefined!,
  selectedPlanet: undefined!,
  setSelectedPlanet: undefined!,
});
