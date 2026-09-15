export interface ControlsPanelProps {
  density: number;
  motionIntensity: number;
  speed: number;
  bgColor: string;
  gridColor: string;
  squareColor: string;
  onChange: (patch: Partial<{
    density: number;
    motionIntensity: number;
    speed: number;
    bgColor: string;
    gridColor: string;
    squareColor: string;
  }>) => void;
}

export function ControlsPanel({
  density,
  motionIntensity,
  speed,
  bgColor,
  gridColor,
  squareColor,
  onChange,
}: ControlsPanelProps) {
  return (
    <div className="controls-panel">
      <h1>Block Studio — grid test</h1>

      <label>
        Density
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={density}
          onChange={(e) => onChange({ density: Number(e.target.value) })}
        />
      </label>

      <label>
        Motion intensity
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={motionIntensity}
          onChange={(e) => onChange({ motionIntensity: Number(e.target.value) })}
        />
      </label>

      <label>
        Speed
        <input
          type="range"
          min={0}
          max={2}
          step={0.01}
          value={speed}
          onChange={(e) => onChange({ speed: Number(e.target.value) })}
        />
      </label>

      <label className="color-row">
        Background
        <input type="color" value={bgColor} onChange={(e) => onChange({ bgColor: e.target.value })} />
      </label>

      <label className="color-row">
        Grid lines
        <input type="color" value={gridColor} onChange={(e) => onChange({ gridColor: e.target.value })} />
      </label>

      <label className="color-row">
        Squares
        <input type="color" value={squareColor} onChange={(e) => onChange({ squareColor: e.target.value })} />
      </label>
    </div>
  );
}
