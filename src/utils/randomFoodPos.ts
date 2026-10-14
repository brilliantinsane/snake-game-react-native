import { Coordinate, GameBounds } from "@/types/types";

export const randomFoodPos = (
  xMax: GameBounds["xMax"],
  yMax: GameBounds["yMax"],
): Coordinate => {
  let x = Math.floor(Math.random() * xMax);
  let y = Math.floor(Math.random() * yMax);

  if (x === 0 && y === 0) {
    x += 1;
    y += 1;
  }

  if (x === xMax && y === 0) {
    x -= 1;
    y += 1;
  }

  if (x === 0 && y === yMax) {
    x += 1;
    y -= 1;
  }

  if (x === xMax && y === yMax) {
    x -= 1;
    y -= 1;
  }

  return {
    x,
    y,
  };
};
