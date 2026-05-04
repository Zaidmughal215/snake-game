import { useState, useEffect, useCallback, useRef } from "react";

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type Cell = { x: number; y: number };
export type GameStatus = "IDLE" | "RUNNING" | "PAUSED" | "GAME_OVER";

export interface GameSettings {
  gridSize: number;
  wallsEnabled: boolean;
  initialSpeed: number; // ms per tick
}

export interface GameState {
  snake: Cell[];
  food: Cell;
  bonusFood: Cell | null;
  bonusFoodTimer: number;
  direction: Direction;
  status: GameStatus;
  score: number;
  highScore: number;
  level: number;
  speed: number;
  settings: GameSettings;
}

const DEFAULT_SETTINGS: GameSettings = {
  gridSize: 20,
  wallsEnabled: false,
  initialSpeed: 180,
};

function randomCell(gridSize: number, exclude: Cell[]): Cell {
  let cell: Cell;
  do {
    cell = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  } while (exclude.some((c) => c.x === cell.x && c.y === cell.y));
  return cell;
}

function getInitialState(settings: GameSettings): GameState {
  const center = Math.floor(settings.gridSize / 2);
  const snake: Cell[] = [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];
  const food = randomCell(settings.gridSize, snake);
  return {
    snake,
    food,
    bonusFood: null,
    bonusFoodTimer: 0,
    direction: "RIGHT",
    status: "IDLE",
    score: 0,
    highScore: Number(localStorage.getItem("snakeHighScore") || 0),
    level: 1,
    speed: settings.initialSpeed,
    settings,
  };
}

const SPEED_INCREASE_PER_LEVEL = 10; // ms faster per level
const MIN_SPEED = 60; // fastest possible
const SCORE_PER_FOOD = 10;
const SCORE_PER_BONUS = 30;
const LEVEL_THRESHOLD = 50; // score points per level
const BONUS_FOOD_CHANCE = 0.2;
const BONUS_FOOD_DURATION = 80; // ticks

export function useSnakeGame(initialSettings: GameSettings = DEFAULT_SETTINGS) {
  const [state, setState] = useState<GameState>(() => getInitialState(initialSettings));
  const stateRef = useRef(state);
  stateRef.current = state;

  const pendingDirectionRef = useRef<Direction | null>(null);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTick = () => {
    if (tickRef.current) {
      clearTimeout(tickRef.current);
      tickRef.current = null;
    }
  };

  const tick = useCallback(() => {
    setState((prev) => {
      if (prev.status !== "RUNNING") return prev;

      const dir = pendingDirectionRef.current ?? prev.direction;
      pendingDirectionRef.current = null;

      // Prevent reversing
      const validDir =
        (dir === "UP" && prev.direction === "DOWN") ||
        (dir === "DOWN" && prev.direction === "UP") ||
        (dir === "LEFT" && prev.direction === "RIGHT") ||
        (dir === "RIGHT" && prev.direction === "LEFT")
          ? prev.direction
          : dir;

      const head = prev.snake[0];
      let newHead: Cell = { ...head };

      switch (validDir) {
        case "UP":    newHead.y -= 1; break;
        case "DOWN":  newHead.y += 1; break;
        case "LEFT":  newHead.x -= 1; break;
        case "RIGHT": newHead.x += 1; break;
      }

      const { gridSize, wallsEnabled } = prev.settings;

      // Wall collision
      if (wallsEnabled) {
        if (
          newHead.x < 0 || newHead.x >= gridSize ||
          newHead.y < 0 || newHead.y >= gridSize
        ) {
          const highScore = Math.max(prev.score, prev.highScore);
          localStorage.setItem("snakeHighScore", String(highScore));
          return { ...prev, status: "GAME_OVER", highScore, direction: validDir };
        }
      } else {
        // Wrap around
        newHead.x = (newHead.x + gridSize) % gridSize;
        newHead.y = (newHead.y + gridSize) % gridSize;
      }

      // Self collision (skip last segment because it will move)
      const bodyToCheck = prev.snake.slice(0, -1);
      if (bodyToCheck.some((c) => c.x === newHead.x && c.y === newHead.y)) {
        const highScore = Math.max(prev.score, prev.highScore);
        localStorage.setItem("snakeHighScore", String(highScore));
        return { ...prev, status: "GAME_OVER", highScore, direction: validDir };
      }

      // Check food
      const ateFood = newHead.x === prev.food.x && newHead.y === prev.food.y;
      const ateBonusFood =
        prev.bonusFood &&
        newHead.x === prev.bonusFood.x &&
        newHead.y === prev.bonusFood.y;

      let newSnake = [newHead, ...prev.snake];
      if (!ateFood && !ateBonusFood) {
        newSnake = newSnake.slice(0, -1); // remove tail unless ate food
      } else if (ateFood && ateBonusFood) {
        // Ate both (extremely rare, but handle it)
        newSnake = [newHead, ...prev.snake]; // keep tail
      }

      let newScore = prev.score;
      let newFood = prev.food;
      let newBonusFood = prev.bonusFood;
      let newBonusFoodTimer = prev.bonusFoodTimer;

      if (ateFood) {
        newScore += SCORE_PER_FOOD;
        newFood = randomCell(gridSize, newSnake);
        // Maybe spawn bonus food
        if (!newBonusFood && Math.random() < BONUS_FOOD_CHANCE) {
          newBonusFood = randomCell(gridSize, [...newSnake, newFood]);
          newBonusFoodTimer = BONUS_FOOD_DURATION;
        }
      }

      if (ateBonusFood) {
        newScore += SCORE_PER_BONUS;
        newBonusFood = null;
        newBonusFoodTimer = 0;
      }

      // Tick down bonus food timer
      if (newBonusFood && !ateBonusFood) {
        newBonusFoodTimer -= 1;
        if (newBonusFoodTimer <= 0) {
          newBonusFood = null;
          newBonusFoodTimer = 0;
        }
      }

      // Level up
      const newLevel = Math.floor(newScore / LEVEL_THRESHOLD) + 1;
      const speedReduction = (newLevel - 1) * SPEED_INCREASE_PER_LEVEL;
      const newSpeed = Math.max(
        MIN_SPEED,
        prev.settings.initialSpeed - speedReduction
      );

      const highScore = Math.max(newScore, prev.highScore);
      if (highScore > prev.highScore) {
        localStorage.setItem("snakeHighScore", String(highScore));
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        bonusFood: newBonusFood,
        bonusFoodTimer: newBonusFoodTimer,
        direction: validDir,
        score: newScore,
        highScore,
        level: newLevel,
        speed: newSpeed,
      };
    });
  }, []);

  // Schedule ticks
  useEffect(() => {
    if (state.status !== "RUNNING") {
      clearTick();
      return;
    }
    clearTick();
    tickRef.current = setTimeout(() => {
      tick();
    }, state.speed);
    return clearTick;
  }, [state.status, state.speed, state.snake, tick]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const { status } = stateRef.current;

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (status === "IDLE" || status === "GAME_OVER") {
          startGame();
        } else if (status === "RUNNING") {
          pauseGame();
        } else if (status === "PAUSED") {
          resumeGame();
        }
        return;
      }

      if (e.key === "Escape") {
        if (status === "RUNNING") pauseGame();
        return;
      }

      const dirMap: Record<string, Direction> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        s: "DOWN",
        a: "LEFT",
        d: "RIGHT",
        W: "UP",
        S: "DOWN",
        A: "LEFT",
        D: "RIGHT",
      };

      const newDir = dirMap[e.key];
      if (newDir) {
        e.preventDefault();
        if (status === "RUNNING") {
          pendingDirectionRef.current = newDir;
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const startGame = useCallback(() => {
    pendingDirectionRef.current = null;
    setState((prev) => ({
      ...getInitialState(prev.settings),
      highScore: prev.highScore,
      status: "RUNNING",
    }));
  }, []);

  const pauseGame = useCallback(() => {
    setState((prev) =>
      prev.status === "RUNNING" ? { ...prev, status: "PAUSED" } : prev
    );
  }, []);

  const resumeGame = useCallback(() => {
    setState((prev) =>
      prev.status === "PAUSED" ? { ...prev, status: "RUNNING" } : prev
    );
  }, []);

  const updateSettings = useCallback((settings: Partial<GameSettings>) => {
    setState((prev) => {
      const newSettings = { ...prev.settings, ...settings };
      return {
        ...getInitialState(newSettings),
        highScore: prev.highScore,
      };
    });
  }, []);

  const setDirection = useCallback((dir: Direction) => {
    if (stateRef.current.status === "RUNNING") {
      pendingDirectionRef.current = dir;
    }
  }, []);

  return {
    state,
    startGame,
    pauseGame,
    resumeGame,
    updateSettings,
    setDirection,
  };
}
