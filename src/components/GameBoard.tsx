import React from "react";
import type { Cell, Direction, GameState } from "../hooks/useSnakeGame";

interface GameBoardProps {
  state: GameState;
  cellSize?: number;
}

function getHeadBorderRadius(direction: Direction): string {
  const r = 6;
  const s = 3;
  switch (direction) {
    case "RIGHT": return `${s}px ${r}px ${r}px ${s}px`;
    case "LEFT":  return `${r}px ${s}px ${s}px ${r}px`;
    case "UP":    return `${r}px ${r}px ${s}px ${s}px`;
    case "DOWN":  return `${s}px ${s}px ${r}px ${r}px`;
  }
}

interface EyesProps {
  direction: Direction;
}

function SnakeEyes({ direction }: EyesProps) {
  const positions: Record<Direction, { e1: React.CSSProperties; e2: React.CSSProperties }> = {
    RIGHT: { e1: { top: "18%", right: "16%" }, e2: { bottom: "18%", right: "16%" } },
    LEFT:  { e1: { top: "18%", left: "16%" },  e2: { bottom: "18%", left: "16%" } },
    UP:    { e1: { top: "16%", left: "18%" },   e2: { top: "16%", right: "18%" } },
    DOWN:  { e1: { bottom: "16%", left: "18%" }, e2: { bottom: "16%", right: "18%" } },
  };
  const { e1, e2 } = positions[direction];
  const eyeStyle: React.CSSProperties = {
    position: "absolute",
    width: "22%",
    height: "22%",
    borderRadius: "50%",
    background: "white",
  };
  const pupilStyle: React.CSSProperties = {
    position: "absolute",
    inset: "25%",
    borderRadius: "50%",
    background: "#111",
  };
  return (
    <>
      <div style={{ ...eyeStyle, ...e1 }}><div style={pupilStyle} /></div>
      <div style={{ ...eyeStyle, ...e2 }}><div style={pupilStyle} /></div>
    </>
  );
}

interface SnakeSegmentProps {
  cell: Cell;
  index: number;
  total: number;
  direction: Direction;
  cellSize: number;
}

function SnakeSegment({ cell, index, total, direction, cellSize }: SnakeSegmentProps) {
  const isHead = index === 0;
  const isTail = index === total - 1;
  const progress = index / Math.max(total - 1, 1);

  // Color gradient along body: bright green → darker green
  const greenStart = [74, 222, 128];  // #4ade80
  const greenEnd   = [21, 128, 61];   // #15803d
  const r = Math.round(greenStart[0] + (greenEnd[0] - greenStart[0]) * progress);
  const g = Math.round(greenStart[1] + (greenEnd[1] - greenStart[1]) * progress);
  const b = Math.round(greenStart[2] + (greenEnd[2] - greenStart[2]) * progress);
  const color = `rgb(${r},${g},${b})`;

  const pad = isHead ? 1 : isTail ? 2 : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: cell.x * cellSize + pad,
        top:  cell.y * cellSize + pad,
        width:  cellSize - pad * 2,
        height: cellSize - pad * 2,
        background: isHead
          ? "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)"
          : `linear-gradient(135deg, ${color} 0%, rgb(${r - 15},${g - 20},${b - 10}) 100%)`,
        borderRadius: isHead
          ? getHeadBorderRadius(direction)
          : isTail ? "40%" : "3px",
        boxShadow: isHead ? "0 0 10px rgba(74,222,128,0.55)" : undefined,
        zIndex: isHead ? 10 : total - index,
      }}
    >
      {isHead && <SnakeEyes direction={direction} />}
    </div>
  );
}

export default function GameBoard({ state, cellSize = 22 }: GameBoardProps) {
  const { snake, food, bonusFood, bonusFoodTimer, settings, status, direction } = state;
  const { gridSize } = settings;
  const boardSize = gridSize * cellSize;

  const bonusFoodFlashing = bonusFoodTimer > 0 && bonusFoodTimer < 20;

  return (
    <div
      className="relative select-none overflow-hidden rounded-lg"
      style={{ width: boardSize, height: boardSize, flexShrink: 0 }}
    >
      {/* Dark grid background */}
      <div className="absolute inset-0 bg-gray-950 rounded-lg" />
      <svg
        className="absolute inset-0"
        width={boardSize}
        height={boardSize}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
            <path
              d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Snake segments */}
      {snake.map((cell, index) => (
        <SnakeSegment
          key={index}
          cell={cell}
          index={index}
          total={snake.length}
          direction={direction}
          cellSize={cellSize}
        />
      ))}

      {/* Food (apple) */}
      <div
        style={{
          position: "absolute",
          left: food.x * cellSize + Math.round(cellSize * 0.1),
          top:  food.y * cellSize + Math.round(cellSize * 0.1),
          width:  Math.round(cellSize * 0.8),
          height: Math.round(cellSize * 0.8),
          zIndex: 5,
        }}
      >
        {/* Stem */}
        <div style={{
          position: "absolute",
          left: "44%",
          top: "-18%",
          width: "12%",
          height: "22%",
          background: "#15803d",
          borderRadius: 2,
        }} />
        {/* Apple body */}
        <div
          className="animate-bounce"
          style={{
            width: "100%",
            height: "100%",
            background: "radial-gradient(circle at 38% 33%, #fca5a5, #dc2626)",
            borderRadius: "50%",
            boxShadow: "0 0 10px rgba(220,38,38,0.65), inset 0 -4px 8px rgba(0,0,0,0.2)",
            animationDuration: "1s",
          }}
        >
          {/* Shine */}
          <div style={{
            position: "absolute",
            top: "15%",
            left: "20%",
            width: "25%",
            height: "20%",
            background: "rgba(255,255,255,0.45)",
            borderRadius: "50%",
            transform: "rotate(-30deg)",
          }} />
        </div>
      </div>

      {/* Bonus food (star) */}
      {bonusFood && (
        <div
          style={{
            position: "absolute",
            left: bonusFood.x * cellSize,
            top:  bonusFood.y * cellSize,
            width: cellSize,
            height: cellSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
            opacity: bonusFoodFlashing ? undefined : 1,
            animation: bonusFoodFlashing ? "flash 0.3s ease infinite alternate" : undefined,
          }}
        >
          <span
            style={{
              fontSize: cellSize * 0.78,
              filter: "drop-shadow(0 0 7px rgba(250,204,21,0.95))",
              lineHeight: 1,
              display: "block",
            }}
          >
            ⭐
          </span>
        </div>
      )}

      {/* PAUSED overlay */}
      {status === "PAUSED" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-black/75 backdrop-blur-sm">
          <div className="text-6xl mb-4 drop-shadow-xl">⏸</div>
          <p className="text-white text-3xl font-black tracking-widest drop-shadow">PAUSED</p>
          <p className="text-green-400 text-sm mt-3 font-medium">Press Space to resume</p>
        </div>
      )}
    </div>
  );
}
