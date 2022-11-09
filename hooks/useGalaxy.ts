import useColonies, { ColoniesHook } from "./useColonies";
import useSolarSystems, { SolarSystemHook } from "./useSolarSystem";

export interface GalaxyHook {
  solarSystems: SolarSystemHook;
  colonies: ColoniesHook;
}

export default function useGalaxy(): GalaxyHook {
  const solarSystems = useSolarSystems();
  const colonies = useColonies();

  return { solarSystems, colonies };
}
