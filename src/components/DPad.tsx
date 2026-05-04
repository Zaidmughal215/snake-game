import type { Direction } from "../hooks/useSnakeGame";

interface DPadProps {
  onDirection: (dir: Direction) => void;
  disabled?: boolean;
}

export default function DPad({ onDirection, disabled }: DPadProps) {
  const btnBase =
    "w-14 h-14 flex items-center justify-center rounded-xl text-2xl font-bold select-none transition-all duration-100 active:scale-90 " +
    "bg-gray-700/80 border border-gray-600/60 text-white shadow-md active:shadow-inner active:bg-gray-600 ";
  const disabledCls = disabled ? "opacity-40 pointer-events-none" : "hover:bg-gray-600";

  return (
    <div className="grid grid-cols-3 gap-1.5 items-center justify-items-center">
      {/* Row 1 */}
      <div />
      <button
        className={`${btnBase} ${disabledCls}`}
        onPointerDown={() => onDirection("UP")}
        aria-label="Up"
      >
        ▲
      </button>
      <div />

      {/* Row 2 */}
      <button
        className={`${btnBase} ${disabledCls}`}
        onPointerDown={() => onDirection("LEFT")}
        aria-label="Left"
      >
        ◀
      </button>
      <div className="w-14 h-14 rounded-xl bg-gray-800/40 border border-gray-700/30 flex items-center justify-center">
        <span className="text-gray-600 text-lg">🐍</span>
      </div>
      <button
        className={`${btnBase} ${disabledCls}`}
        onPointerDown={() => onDirection("RIGHT")}
        aria-label="Right"
      >
        ▶
      </button>

      {/* Row 3 */}
      <div />
      <button
        className={`${btnBase} ${disabledCls}`}
        onPointerDown={() => onDirection("DOWN")}
        aria-label="Down"
      >
        ▼
      </button>
      <div />
    </div>
  );
}
