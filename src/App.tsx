import { useState } from "react";
import { GlitchGrid } from "./components/GlitchGrid";
import { ControlsPanel } from "./components/ControlsPanel";

function App() {
  const [density, setDensity] = useState(0.55);
  const [motionIntensity, setMotionIntensity] = useState(0.3);
  const [speed, setSpeed] = useState(0.5);
  const [bgColor, setBgColor] = useState("#ffffff"); // charcoal-50
  const [gridColor, setGridColor] = useState("#bdbdbd"); // charcoal-300
  const [squareColor, setSquareColor] = useState("#da6233"); // orange-600

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <GlitchGrid
        density={density}
        motionIntensity={motionIntensity}
        speed={speed}
        bgColor={bgColor}
        gridColor={gridColor}
        squareColor={squareColor}
      />
      <ControlsPanel
        density={density}
        motionIntensity={motionIntensity}
        speed={speed}
        bgColor={bgColor}
        gridColor={gridColor}
        squareColor={squareColor}
        onChange={(patch) => {
          if (patch.density !== undefined) setDensity(patch.density);
          if (patch.motionIntensity !== undefined) setMotionIntensity(patch.motionIntensity);
          if (patch.speed !== undefined) setSpeed(patch.speed);
          if (patch.bgColor !== undefined) setBgColor(patch.bgColor);
          if (patch.gridColor !== undefined) setGridColor(patch.gridColor);
          if (patch.squareColor !== undefined) setSquareColor(patch.squareColor);
        }}
      />
    </div>
  );
}

export default App;
