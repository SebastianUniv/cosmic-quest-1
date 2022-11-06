import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Box, Center, Grid, GridItem, SimpleGrid } from "@chakra-ui/layout";
import { ButtonGroup, Flex, IconButton, Spacer } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import Map, { Planet, PlanetState, Star } from "../components/Map";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

export type GalaxyData = {
  star_list: Star[];
  planet_list: Planet[];
  human_colony: number[];
  connections: [number, number][];
  new_human_colony_planets: number[];
  new_connections: [number, number][];
  scores: number[];
};

export default function Page() {
  const { height, width } = useWindowDimensions();
  const [scale, setScale] = useState(1);
  const [bodies, setBodies] = useState<GalaxyData>();
  const [simulate, setSimulate] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<ReturnType<typeof setTimeout>>();

  const fetchGalaxy = () => {
    fetch("http://127.0.0.1:5000/move")
      .then((res) => res.json())
      .then((data: GalaxyData) => {
        console.log(data);
        setBodies(data);
      });
  };

  const resetGalaxy = () => {
    fetch("http://127.0.0.1:5000/reset")
      .then((res) => res.json())
      .then((data: GalaxyData) => {
        console.log(data);
        setBodies(data);
      });
  };

  const setSimulationRefresh = () => {
    if (refresh) {
      clearInterval(refresh);
    }

    const interval = setInterval(() => {
      console.log("Fetching Galaxy...");
      fetchGalaxy();
      console.log("Galaxy Fetched, waiting 5 seconds");
      //setRefresh(() => setSimulationRefresh());
    }, 2000);
    setRefresh(interval);
  };

  // useEffect(() => {
  //   if (refresh) {
  //     const interval = setInterval(() => {
  //       console.log("Fetching Galaxy...");
  //       fetchGalaxy();
  //       console.log("Galaxy Fetched, waiting 5 seconds");
  //     }, 5000);

  //     return () => clearInterval(interval);
  //   }
  // }, [refresh]);

  return (
    <Grid h="calc(100vh)" templateColumns="repeat(3, 1fr)" bg="#1B191B">
      <GridItem colSpan={2}>
        <Flex margin={3} w="100%" position={"absolute"}>
          <Center w="100%">
            <ButtonGroup gap="1">
              {refresh ? (
                <IconButton
                  aria-label={"Pause"}
                  icon={<FaPause />}
                  onClick={() => {
                    clearInterval(refresh);
                    setRefresh(undefined);
                  }}
                />
              ) : (
                <IconButton
                  aria-label={"Play"}
                  icon={<FaPlay />}
                  onClick={() => setSimulationRefresh()}
                />
              )}
              <IconButton
                aria-label={"Reset"}
                icon={<FaRedo />}
                onClick={() => resetGalaxy()}
              />
            </ButtonGroup>
          </Center>
        </Flex>
        {bodies && (
          <Map
            width={(width * 2) / 3}
            height={height}
            bodies={bodies}
            scale={scale}
          />
        )}
      </GridItem>
      <GridItem>
        <Dashboard />
      </GridItem>
    </Grid>
  );
}
