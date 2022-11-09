import { Center, Grid, GridItem } from "@chakra-ui/layout";
import { ButtonGroup, Flex, IconButton } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { Planet } from "../types/Planet";
import Dashboard from "../components/Dashboard";
import MemoizedGalaxyMap from "../organisms/MemoizedGalaxyMap";
import { setRequestMeta } from "next/dist/server/request-meta";

export default function Page() {
  const [reset, setReset] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<ReturnType<typeof setTimeout>>();
  const [selectedPlanet, setSelectedPlanet] = useState<Planet>();
  let [active, setActive] = useState(false);

  return (
    <Grid h="calc(100vh)" templateColumns="repeat(3, 1fr)" bg="#1B191B">
      <GridItem colSpan={3}>
        <Flex marginTop={3} w="100%" position={"absolute"}>
          <Center w="100%">
            <ButtonGroup gap="1">
              {active ? (
                <IconButton
                  aria-label={"Pause"}
                  icon={<FaPause />}
                  onClick={() => {
                    clearInterval(refresh);
                    setRefresh(undefined);
                    setActive(false);
                  }}
                />
              ) : (
                <IconButton
                  aria-label={"Play"}
                  icon={<FaPlay />}
                  onClick={() => setActive(true)}
                />
              )}
              <IconButton
                aria-label={"Reset"}
                icon={<FaRedo />}
                onClick={() => setReset(true)}
              />
            </ButtonGroup>
          </Center>
        </Flex>
        <Dashboard selectedPlanet={selectedPlanet} />
        <MemoizedGalaxyMap
          setSelectedPlanet={setSelectedPlanet}
          refresh={refresh}
          setRefresh={setRefresh}
          active={active}
          resetSimulation={reset}
          setResetSimulation={setReset}
        />
      </GridItem>
    </Grid>
  );
}
