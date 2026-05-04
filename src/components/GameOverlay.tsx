interface GameOverlayProps {
  status: "IDLE" | "GAME_OVER";
  score: number;
  highScore: number;
  onStart: () => void;
}

export default function GameOverlay({ status, score, highScore, onStart }: GameOverlayProps) {
  const isNewRecord = status === "GAME_OVER" && score > 0 && score >= highScore;

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-lg bg-black/80 backdrop-blur-md">
      {status === "IDLE" ? (
        <>
          {/* IDLE screen */}
          <div className="text-7xl mb-4 drop-shadow-2xl animate-bounce" style={{ animationDuration: "2s" }}>
            🐍
          </div>
          <h2 className="text-white text-4xl font-black tracking-tight mb-1">Snake</h2>
          <p className="text-gray-400 text-sm mb-8">Classic arcade game</p>

          <div className="space-y-2 text-center mb-8">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">↑↓←→</kbd>
              <span>or</span>
              <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">W A S D</kbd>
              <span>to move</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm justify-center">
              <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">Space</kbd>
              <span>to pause / resume</span>
            </div>
          </div>

          <button
            onClick={onStart}
            className="px-10 py-3.5 bg-green-500 hover:bg-green-400 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl shadow-green-500/40 transition-all duration-150 tracking-wide"
          >
            ▶ Start Game
          </button>
        </>
      ) : (
        <>
          {/* GAME OVER screen */}
          {isNewRecord && (
            <div className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-2 animate-pulse">
              🏆 New High Score! 🏆
            </div>
          )}
          <div className="text-6xl mb-3 drop-shadow-xl">💀</div>
          <h2 className="text-white text-4xl font-black tracking-tight mb-5">Game Over</h2>

          <div className="flex gap-6 mb-8">
            <div className="text-center">
              <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Score</p>
              <p className="text-green-400 text-3xl font-black tabular-nums">{score}</p>
            </div>
            <div className="w-px bg-gray-700" />
            <div className="text-center">
              <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Best</p>
              <p className="text-yellow-400 text-3xl font-black tabular-nums">{highScore}</p>
            </div>
          </div>

          <button
            onClick={onStart}
            className="px-10 py-3.5 bg-green-500 hover:bg-green-400 active:scale-95 text-white font-black text-lg rounded-2xl shadow-xl shadow-green-500/40 transition-all duration-150 tracking-wide"
          >
            ▶ Play Again
          </button>
          <p className="text-gray-600 text-xs mt-3">or press Space / Enter</p>
        </>
      )}
    </div>
  );
}
