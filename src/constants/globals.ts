import { Platform, StyleSheet } from "react-native";
import { Directions } from "react-native-gesture-handler";

// Platform specific
export const isIos = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

// Game
export const FRUIT_EMOJIS = [
  "🍎",
  "🍌",
  "🍇",
  "🍓",
  "🍍",
  "🍒",
  "🍊",
  "🍉",
  "🥝",
  "🍑",
  "🍐",
  "🫐",
  "🍋",
  "🍈",
  "🥭",
];

export const GAME_OVER_EMOJIS = [
  "😕",
  "😭",
  "😢",
  "😔",
  "☹️",
  "😞",
  "🙁",
  "😥",
  "😓",
  "😟",
  "🤕",
  "🫤",
];

export const INITIAL_SNAKE_CELL_SIZE = 15;
export const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
export const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
export const INITIAL_MOVE_INTERVAL = 150;
export const MIN_MOVE_INTERVAL = 60;
export const SPEED_INCREMENT = 5;
export const SCORE_INCREMENT = 10;
export const OPPOSITE_DIRECTION: Partial<Record<Directions, Directions>> = {
  [Directions.RIGHT]: Directions.LEFT,
  [Directions.LEFT]: Directions.RIGHT,
  [Directions.UP]: Directions.DOWN,
  [Directions.DOWN]: Directions.UP,
};

// Styles
export const Colors = {
  primary: "#365314",
  secondary: "#84cc16",
  tertiary: "#eab308",
  background: "#ecfccb",
  white: "#ffffff",
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
