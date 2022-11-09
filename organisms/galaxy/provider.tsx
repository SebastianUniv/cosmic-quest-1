import {
  Dispatch,
  memo,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import useGalaxy from "../../hooks/useGalaxy";
import useSimulator from "../../hooks/useSimulator";
import useSolarSystems, { SolarSystemHook } from "../../hooks/useSolarSystem";
import { GalaxyMap } from "../../types/GalaxyMap";
import { Planet } from "../../types/Planet";
import { GalaxyContext } from "./context";

export interface GalaxyProviderProps {
  setSelectedPlanet: (planet: Planet) => void;
  refresh: ReturnType<typeof setTimeout> | undefined;
  setRefresh: Dispatch<
    SetStateAction<ReturnType<typeof setTimeout> | undefined>
  >;
  active: boolean;
  resetSimulation: boolean;
  setResetSimulation: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
}

export default function GalaxyProvider({
  setSelectedPlanet,
  refresh,
  setRefresh,
  active,
  resetSimulation,
  setResetSimulation,
  children,
}: GalaxyProviderProps) {
  const galaxy = useGalaxy();
  const { setup, tick, reset } = useSimulator(galaxy);
  const selectedPlanet = useRef<Planet>();

  const startSimulation = () => {
    if (refresh) {
      clearInterval(refresh);
    }

    const interval = setInterval(() => {
      tick();
    }, 2000);
    setRefresh(interval);
  };

  useEffect(() => {
    if (!galaxy.solarSystems.exists()) {
      setup();
    }
  });

  useEffect(() => {
    if (galaxy.solarSystems.exists() && active) {
      startSimulation();
    }
    if (!active) {
      clearInterval(refresh);
    }
  }, [active]);

  useEffect(() => {
    if (resetSimulation) {
      reset();
      setResetSimulation(false);
    }
  }, [resetSimulation]);

  return (
    <GalaxyContext.Provider
      value={{ galaxy, selectedPlanet, setSelectedPlanet }}
    >
      {galaxy.solarSystems.exists() && children}
    </GalaxyContext.Provider>
  );
}
