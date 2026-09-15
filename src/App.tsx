import { useState } from "react";
import { GlitchGrid } from "./components/GlitchGrid";
import { ControlsPanel } from "./components/ControlsPanel";
import "./App.css";

function App() {
  const [density, setDensity] = useState(0.55);
  const [motionIntensity, setMotionIntensity] = useState(0.3);
  const [speed, setSpeed] = useState(0.5);
  const [bgColor, setBgColor] = useState("#f8f8f8");
  const [gridColor, setGridColor] = useState("#b3b3b3");
  const [squareColor, setSquareColor] = useState("#DA6233");

  return (
    <div className="app">
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
