import { memo } from "react";
import GalaxyProvider, { GalaxyProviderProps } from "./galaxy/provider";
import MapView from "./MapView";

export default memo(function MemoizedMap(props: GalaxyProviderProps) {
  return (
    <GalaxyProvider {...props}>
      <MapView />
    </GalaxyProvider>
  );
});
