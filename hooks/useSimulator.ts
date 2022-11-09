import { useContext } from "react";
import { GalaxyContext } from "../organisms/galaxy/context";
import useRecommender from "./useRecommender";
import { GalaxyHook } from "./useGalaxy";

interface SimulatorHook {
  setup: () => void;
  tick: () => void;
  reset: () => void;
}

export default function useSimulator(galaxy: GalaxyHook): SimulatorHook {
  const {
    solarSystems: { generate, getPlanets },
    colonies: {
      getCurrentColonies,
      getPlannedColonies,
      getPlannedConnections,
      setCurrent,
      setPlanned,
    },
  } = galaxy;
  const {
    recommend,
    getNextColonies,
    getNextConnections,
    reset: resetRecommender,
  } = useRecommender();

  const setup = () => {
    generate();
    recommend(getPlanets(), []);
    setCurrent(getNextColonies());
    recommend(getPlanets(), getCurrentColonies());
    setPlanned(getNextColonies(), getNextConnections());
  };

  const tick = () => {
    setCurrent(getPlannedColonies(), getPlannedConnections());
    recommend(getPlanets(), getCurrentColonies());
    setPlanned(getNextColonies(), getNextConnections());
  };

  const reset = () => {
    setCurrent();
    setPlanned();
    resetRecommender();
  };

  return { setup, tick, reset };
}
