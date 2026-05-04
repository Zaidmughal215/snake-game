
import type { GameSettings } from "../hooks/useSnakeGame";

interface SettingsPanelProps {
  settings: GameSettings;
  onUpdate: (s: Partial<GameSettings>) => void;
  disabled: boolean;
}

const GRID_OPTIONS = [15, 20, 25, 30];
const SPEED_OPTIONS = [
  { label: "Slow", value: 240 },
  { label: "Normal", value: 180 },
  { label: "Fast", value: 120 },
  { label: "Blazing", value: 70 },
];

export default function SettingsPanel({ settings, onUpdate, disabled }: SettingsPanelProps) {
  return (
    <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50 space-y-4">
      <h3 className="text-gray-300 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
        <span>⚙️</span> Settings
      </h3>

      {/* Grid size */}
      <div>
        <p className="text-gray-400 text-xs font-semibold mb-2">Grid Size</p>
        <div className="grid grid-cols-4 gap-1.5">
          {GRID_OPTIONS.map((size) => (
            <button
              key={size}
              onClick={() => onUpdate({ gridSize: size })}
              disabled={disabled}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all duration-150
                ${settings.gridSize === size
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"}
              `}
            >
              {size}×{size}
            </button>
          ))}
        </div>
      </div>

      {/* Speed */}
      <div>
        <p className="text-gray-400 text-xs font-semibold mb-2">Starting Speed</p>
        <div className="grid grid-cols-2 gap-1.5">
          {SPEED_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onUpdate({ initialSpeed: opt.value })}
              disabled={disabled}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all duration-150
                ${settings.initialSpeed === opt.value
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"}
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Walls */}
      <div>
        <p className="text-gray-400 text-xs font-semibold mb-2">Wall Collision</p>
        <button
          onClick={() => onUpdate({ wallsEnabled: !settings.wallsEnabled })}
          disabled={disabled}
          className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-between px-3 transition-all duration-200
            ${settings.wallsEnabled
              ? "bg-red-500/80 text-white shadow-lg shadow-red-500/30 border border-red-400/40"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600/40"}
            disabled:opacity-40 disabled:cursor-not-allowed
          `}
        >
          <span>{settings.wallsEnabled ? "🧱 Walls ON" : "🌀 Walls OFF (wrap)"}</span>
          <span className={`w-8 h-4 rounded-full flex items-center transition-all duration-300 px-0.5
            ${settings.wallsEnabled ? "bg-red-300 justify-end" : "bg-gray-600 justify-start"}`}>
            <span className="w-3 h-3 rounded-full bg-white shadow" />
          </span>
        </button>
        <p className="text-gray-500 text-xs mt-1.5">
          {settings.wallsEnabled
            ? "Snake dies on wall contact"
            : "Snake wraps through walls"}
        </p>
      </div>
    </div>
  );
}
