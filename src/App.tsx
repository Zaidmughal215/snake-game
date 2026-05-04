import { useEffect, useRef, useState } from "react";
import { useSnakeGame } from "./hooks/useSnakeGame";
import GameBoard from "./components/GameBoard";
import StatsPanel from "./components/StatsPanel";
import SettingsPanel from "./components/SettingsPanel";
import DPad from "./components/DPad";
import GameOverlay from "./components/GameOverlay";

const CELL_SIZE = 22;
const MIN_CELL_SIZE = 14;

export default function App() {
  const { state, startGame, pauseGame, resumeGame, updateSettings, setDirection } =
    useSnakeGame();

  const boardRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(CELL_SIZE);
  const [showControls, setShowControls] = useState(true);

  // Responsive cell size
  useEffect(() => {
    function updateCellSize() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Available space for the board
      const availableW = vw < 768 ? vw - 32 : Math.min(vw - 340, 600);
      const availableH = vh - 180;
      const available = Math.min(availableW, availableH);
      const ideal = Math.floor(available / state.settings.gridSize);
      setCellSize(Math.max(MIN_CELL_SIZE, Math.min(CELL_SIZE, ideal)));
    }
    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, [state.settings.gridSize]);

  const isActive = state.status === "RUNNING" || state.status === "PAUSED";
  const showOverlay = state.status === "IDLE" || state.status === "GAME_OVER";

  return (
    <div
      className="min-h-screen bg-gray-950 text-white flex flex-col"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-800/60 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐍</span>
          <h1 className="text-white font-black text-xl tracking-tight">
            Snake<span className="text-green-400">.</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {isActive && (
            <button
              onClick={() => state.status === "RUNNING" ? pauseGame() : resumeGame()}
              className="px-3 py-1.5 rounded-lg text-sm font-bold bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all"
            >
              {state.status === "RUNNING" ? "⏸ Pause" : "▶ Resume"}
            </button>
          )}
          {isActive && (
            <button
              onClick={startGame}
              className="px-3 py-1.5 rounded-lg text-sm font-bold bg-gray-800 hover:bg-gray-700 border border-gray-700 text-red-400 transition-all"
            >
              ↺ Restart
            </button>
          )}
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 flex flex-col md:flex-row items-start justify-center gap-4 p-4 overflow-auto">

        {/* Left sidebar (desktop) */}
        <aside className="hidden md:flex flex-col gap-4 w-56 flex-shrink-0 pt-2">
          <StatsPanel state={state} />
          <SettingsPanel
            settings={state.settings}
            onUpdate={updateSettings}
            disabled={isActive}
          />
        </aside>

        {/* Game Board */}
        <div className="flex flex-col items-center gap-4 flex-shrink-0">
          {/* Board container */}
          <div
            ref={boardRef}
            className="relative rounded-xl shadow-2xl shadow-black/60 border border-gray-800/80"
            style={{
              outline: state.settings.wallsEnabled
                ? "3px solid rgba(239,68,68,0.45)"
                : "3px solid rgba(74,222,128,0.2)",
              boxShadow: state.settings.wallsEnabled
                ? "0 0 30px rgba(239,68,68,0.12), 0 25px 60px rgba(0,0,0,0.6)"
                : "0 0 30px rgba(74,222,128,0.08), 0 25px 60px rgba(0,0,0,0.6)",
            }}
          >
            <GameBoard state={state} cellSize={cellSize} />
            {showOverlay && (
              <GameOverlay
                status={state.status as "IDLE" | "GAME_OVER"}
                score={state.score}
                highScore={state.highScore}
                onStart={startGame}
              />
            )}
          </div>

          {/* Wall indicator */}
          <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border
            ${state.settings.wallsEnabled
              ? "text-red-400 border-red-500/30 bg-red-500/10"
              : "text-green-400 border-green-500/30 bg-green-500/10"}`}
          >
            {state.settings.wallsEnabled ? "🧱 Walls ON — hit a wall and it's over!" : "🌀 No walls — wrap through edges"}
          </div>

          {/* Mobile stats */}
          <div className="md:hidden w-full max-w-sm">
            <StatsPanel state={state} />
          </div>

          {/* D-Pad for mobile */}
          <div className="md:hidden flex flex-col items-center gap-3">
            <DPad
              onDirection={setDirection}
              disabled={!isActive || state.status === "PAUSED"}
            />
            {!isActive && (
              <button
                onClick={startGame}
                className="mt-2 px-8 py-3 bg-green-500 hover:bg-green-400 text-white font-black text-base rounded-2xl shadow-lg shadow-green-500/30 transition-all active:scale-95"
              >
                {state.status === "IDLE" ? "▶ Start" : "▶ Play Again"}
              </button>
            )}
          </div>

          {/* Mobile settings */}
          <div className="md:hidden w-full max-w-sm">
            <button
              onClick={() => setShowControls(!showControls)}
              className="w-full py-2 text-xs font-bold text-gray-400 hover:text-gray-300 flex items-center justify-center gap-2 transition-colors"
            >
              ⚙️ Settings {showControls ? "▲" : "▼"}
            </button>
            {showControls && (
              <SettingsPanel
                settings={state.settings}
                onUpdate={updateSettings}
                disabled={isActive}
              />
            )}
          </div>
        </div>

        {/* Right sidebar: controls cheatsheet (desktop) */}
        <aside className="hidden md:flex flex-col gap-4 w-48 flex-shrink-0 pt-2">
          <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/40">
            <h3 className="text-gray-300 text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <span>🎮</span> Controls
            </h3>
            <div className="space-y-2.5 text-xs">
              {[
                { keys: "↑ ↓ ← →", action: "Move" },
                { keys: "W A S D", action: "Move (alt)" },
                { keys: "Space", action: "Pause/Resume" },
                { keys: "Enter", action: "Start/Restart" },
                { keys: "Esc", action: "Pause" },
              ].map(({ keys, action }) => (
                <div key={action} className="flex justify-between items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-300 font-mono text-[10px] whitespace-nowrap">
                    {keys}
                  </kbd>
                  <span className="text-gray-500">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring guide */}
          <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/40">
            <h3 className="text-gray-300 text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <span>📋</span> Scoring
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">🍎 Apple</span>
                <span className="text-green-400 font-bold">+10 pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">⭐ Star</span>
                <span className="text-yellow-400 font-bold">+30 pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Level up</span>
                <span className="text-blue-400 font-bold">every 50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Speed boost</span>
                <span className="text-orange-400 font-bold">per level</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="text-center py-2 text-gray-700 text-xs border-t border-gray-800/40 flex-shrink-0">
        Classic Snake — Use arrow keys or WASD to play
      </footer>
    </div>
  );
}
