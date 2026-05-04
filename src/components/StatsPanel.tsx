import type { GameState } from "../hooks/useSnakeGame";

interface StatsPanelProps {
  state: GameState;
}

function StatBox({
  label,
  value,
  highlight,
  icon,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  icon: string;
}) {
  return (
    <div
      className={`flex-1 rounded-xl p-3 flex flex-col items-center gap-1 border transition-all duration-300
        ${highlight
          ? "bg-green-500/15 border-green-500/40 shadow-lg shadow-green-500/10"
          : "bg-gray-800/60 border-gray-700/40"}
      `}
    >
      <span className="text-lg">{icon}</span>
      <span
        className={`text-xl font-black tabular-nums tracking-tight
          ${highlight ? "text-green-400" : "text-white"}`}
      >
        {value}
      </span>
      <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">{label}</span>
    </div>
  );
}

export default function StatsPanel({ state }: StatsPanelProps) {
  const { score, highScore, level, speed, snake, settings, bonusFoodTimer } = state;
  const speedPercent = Math.round(
    ((settings.initialSpeed - speed) / (settings.initialSpeed - 60)) * 100
  );

  return (
    <div className="space-y-3">
      {/* Main stats */}
      <div className="flex gap-2">
        <StatBox label="Score" value={score} icon="🎯" highlight={score > 0} />
        <StatBox label="Best" value={highScore} icon="🏆" />
        <StatBox label="Level" value={level} icon="⚡" />
      </div>

      {/* Secondary stats */}
      <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/40 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400 font-semibold">🐍 Snake Length</span>
          <span className="text-white font-bold tabular-nums">{snake.length}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400 font-semibold">💨 Speed</span>
          <span className="text-white font-bold tabular-nums">{settings.initialSpeed - speed + settings.initialSpeed > 0 ? `${Math.round(1000 / speed * 10) / 10} t/s` : "—"}</span>
        </div>
        {/* Speed bar */}
        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.max(5, speedPercent))}%`,
              background: `linear-gradient(90deg, #4ade80, ${speedPercent > 70 ? "#f97316" : "#22c55e"})`,
            }}
          />
        </div>
      </div>

      {/* Bonus food timer */}
      {bonusFoodTimer > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-xl p-2.5 flex items-center gap-2.5">
          <span className="text-xl">⭐</span>
          <div className="flex-1">
            <p className="text-yellow-400 text-xs font-bold">Bonus Active! (+30 pts)</p>
            <div className="w-full h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                style={{ width: `${(bonusFoodTimer / 80) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
