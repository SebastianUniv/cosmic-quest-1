import dynamic from "next/dynamic";
import { memo } from "react";
import useCanvasDrawer from "../hooks/useCanvasDrawer";
import usePrinter from "../hooks/usePrinter";

export default function MapView() {
  // Will only import `react-p5` on client-side
  const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
    ssr: false,
  });

  console.count("rerendered");

  const printer = usePrinter();
  const { setup, draw } = useCanvasDrawer(printer);

  return <Sketch setup={setup} draw={draw} />;
}
