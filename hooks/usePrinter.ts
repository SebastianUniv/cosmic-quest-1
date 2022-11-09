import p5Types from "p5";
import { useContext } from "react";
import { interpolateHex } from "../helpers/interpolateHex";
import {
  drawColony,
  drawConnection,
  drawPlanet,
  drawStar,
} from "../helpers/shapes";
import { GalaxyContext } from "../organisms/galaxy/context";
import { PlanetState } from "../types/ColorMappings";
import usePixelMapper from "./usePixelMapper";
import useRecommender from "./useRecommender";
export interface PrinterHook {
  print: (p5: p5Types, scale: number) => void;
}

export default function usePrinter(): PrinterHook {
  const {
    galaxy: {
      solarSystems: { getPlanets, getStars },
      colonies: {
        getCurrentColonies,
        getCurrentConnections,
        getPlannedColonies,
        getPlannedConnections,
      },
    },
  } = useContext(GalaxyContext);

  const { getPlanetScore } = useRecommender();

  const { scaleGalaxyCoordinate, scaleGalaxyLocationOfBody } = usePixelMapper();

  const print = (p5: p5Types, scale: number) => {
    getStars().forEach((star) => {
      drawStar(p5, scaleGalaxyLocationOfBody(star), scale);
    });

    getPlanets().forEach((planet) => {
      const { planetScore } = getPlanetScore(planet, getCurrentColonies());
      const planetColor = planetScore
        ? interpolateHex("#CD5757", "#00FF00", planetScore / 100)
        : PlanetState.DISCOVERED;

      if (scale > 6) {
        drawPlanet(p5, scaleGalaxyLocationOfBody(planet), scale, planetColor);
      }
    });

    getCurrentConnections()?.forEach((connection) => {
      drawConnection(
        p5,
        scaleGalaxyCoordinate(connection[0]),
        scaleGalaxyCoordinate(connection[1]),
        scale,
        "#0000FF"
      );
    });

    getPlannedConnections()?.forEach((connection) => {
      drawConnection(
        p5,
        scaleGalaxyCoordinate(connection[0]),
        scaleGalaxyCoordinate(connection[1]),
        scale,
        "#A020F0"
      );
    });

    getCurrentColonies()?.forEach((colony) => {
      drawColony(p5, scaleGalaxyLocationOfBody(colony), scale, "#0000FF");
    });

    getPlannedColonies()?.forEach((colony) => {
      drawColony(p5, scaleGalaxyLocationOfBody(colony), scale, "#A020F0");
    });
  };

  return { print };
}
