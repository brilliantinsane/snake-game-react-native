import { Coordinate } from "../types/types";

export const checkGameOver = (
  snake: Coordinate[],
  snakeHead: Coordinate,
  boundaries: any,
): boolean => {
  const isOutOfBounds =
    snakeHead.x < boundaries.xMin ||
    snakeHead.x > boundaries.xMax ||
    snakeHead.y > boundaries.yMax ||
    snakeHead.y < boundaries.yMin;

  const collision = snake.some(
    (s) => s.x === snakeHead.x && s.y === snakeHead.y,
  );

  return isOutOfBounds || collision;
};
