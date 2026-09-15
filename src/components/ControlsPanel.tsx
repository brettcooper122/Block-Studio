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

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-stack-tight">
      <span className="text-ink">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-accent"
      />
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center justify-between">
      <span className="text-ink">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-6 w-10 rounded-control border border-border-strong bg-transparent p-0"
      />
    </label>
  );
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
    <div className="absolute top-gutter right-gutter bottom-gutter flex w-60 flex-col gap-stack overflow-y-auto rounded-panel border border-border bg-surface/90 p-stack text-[13px] backdrop-blur-md">
      <h1 className="text-sm font-semibold text-ink">Block Studio — grid test</h1>

      <Slider label="Density" value={density} min={0} max={1} onChange={(v) => onChange({ density: v })} />
      <Slider
        label="Motion intensity"
        value={motionIntensity}
        min={0}
        max={1}
        onChange={(v) => onChange({ motionIntensity: v })}
      />
      <Slider label="Speed" value={speed} min={0} max={2} onChange={(v) => onChange({ speed: v })} />

      <ColorField label="Background" value={bgColor} onChange={(v) => onChange({ bgColor: v })} />
      <ColorField label="Grid lines" value={gridColor} onChange={(v) => onChange({ gridColor: v })} />
      <ColorField label="Squares" value={squareColor} onChange={(v) => onChange({ squareColor: v })} />
    </div>
  );
}
