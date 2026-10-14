import { Coordinate } from "@/types/types";

export const checkEatsFood = (head: Coordinate, food: Coordinate): boolean => {
  const distanceX = Math.abs(head.x - food.x);
  const distanceY = Math.abs(head.y - food.y);

  return distanceX === 0 && distanceY === 0;
};
