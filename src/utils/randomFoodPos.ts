import { Coordinate } from "../types/types";

export const randomFoodPos = (maxX: number, maxY: number): Coordinate => {
  let x = Math.floor(Math.random() * maxX);
  let y = Math.floor(Math.random() * maxY);

  if (x === 0 && y === 0) {
    x += 1;
    y += 1;
  }

  if (x === maxX && y === 0) {
    x -= 1;
    y += 1;
  }

  if (x === 0 && y === maxY) {
    x += 1;
    y -= 1;
  }

  if (x === maxX && y === maxY) {
    x -= 1;
    y -= 1;
  }

  return {
    x,
    y,
  };
};
