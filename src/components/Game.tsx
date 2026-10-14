import {
  Dimensions,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../styles/colors";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { Coordinate } from "../types/types";
import Snake from "./Snake";
import { checkGameOver } from "../utils/checkGameOver";
import Loading from "./Loading";
import Food from "./Food";
import { checkEatsFood } from "../utils/checkEatsFood";
import { randomFoodPos } from "../utils/randomFoodPos";
import Header from "./Header";
import { scheduleOnRN } from "react-native-worklets";
import { fruitEmojis } from "../constants/globals";
import Animated, {
  BounceIn,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import AnimatedButton from "./AnimatedButton";

const INITIAL_SNAKE_CELL_SIZE = 15;
const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const INITIAL_MOVE_INTERVAL = 150;
const MIN_MOVE_INTERVAL = 60;
const SPEED_INCREMENT = 5;
const SCORE_INCREMENT = 10;
const OPPOSITE_DIRECTION: Partial<Record<Directions, Directions>> = {
  [Directions.RIGHT]: Directions.LEFT,
  [Directions.LEFT]: Directions.RIGHT,
  [Directions.UP]: Directions.DOWN,
  [Directions.DOWN]: Directions.UP,
};

const Game = () => {
  const direction = useRef<Directions>(Directions.RIGHT);
  const lastMoveDirection = useRef<Directions>(Directions.RIGHT);
  const [snake, setSnake] = useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
  const [food, setFood] = useState<Coordinate>(FOOD_INITIAL_POSITION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameBounds, setGameBounds] = useState({
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
  });
  const [boardHeight, setBoardHeight] = useState(0);
  const [snakeCellSize, setSnakeCellSize] = useState(INITIAL_SNAKE_CELL_SIZE);
  const [score, setScore] = useState<number>(0);
  const fruitIndex = useRef(Math.floor(Math.random() * fruitEmojis.length));
  const [isLoading, setIsLoading] = useState(true);
  const scoreScale = useSharedValue(1);
  const eatenFoodCount = snake.length - SNAKE_INITIAL_POSITION.length;
  const moveInterval = Math.max(
    MIN_MOVE_INTERVAL,
    INITIAL_MOVE_INTERVAL - eatenFoodCount * SPEED_INCREMENT,
  );

  useEffect(() => {
    if (isLoading || isGameOver || isPaused) return;

    const intervalId = setInterval(() => {
      moveSnake();
    }, moveInterval);

    return () => clearInterval(intervalId);
  }, [snake, isLoading, isGameOver, isPaused, moveInterval]);

  const setDirection = (nextDirection: Directions) => {
    if (nextDirection === OPPOSITE_DIRECTION[lastMoveDirection.current]) return;
    direction.current = nextDirection;
  };
  const updateFruitIndex = () =>
    (fruitIndex.current = Math.floor(Math.random() * fruitEmojis.length));

  const moveSnake = () => {
    const snakeHead = snake[0];
    const newHead = { ...snakeHead }; // copy of snake head

    lastMoveDirection.current = direction.current;

    switch (direction.current) {
      case Directions.UP:
        newHead.y -= 1;
        break;
      case Directions.DOWN:
        newHead.y += 1;
        break;
      case Directions.LEFT:
        newHead.x -= 1;
        break;
      case Directions.RIGHT:
        newHead.x += 1;
        break;
      default:
        break;
    }

    const eatsFood = checkEatsFood(newHead, food);
    const bodyToCheck = eatsFood ? snake : snake.slice(0, -1);

    if (checkGameOver(bodyToCheck, newHead, gameBounds)) {
      setIsGameOver(true);
      return;
    }

    // if eats food grow snake
    if (eatsFood) {
      updateFruitIndex();
      const { x, y } = randomFoodPos(gameBounds.xMax, gameBounds.yMax);
      setFood({ x, y });
      setSnake([newHead, ...snake]);
      // get another position for the food
      setScore((previousScore) => previousScore + SCORE_INCREMENT);
      scoreScale.value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withTiming(1, { duration: 150 }),
      );
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);
    }
  };

  const panGesture = Gesture.Pan().onUpdate((e) => {
    if (isPaused) return;
    const { translationX, translationY } = e;

    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0) {
        // moving right
        scheduleOnRN(setDirection, Directions.RIGHT);
      } else {
        scheduleOnRN(setDirection, Directions.LEFT);
        // moving left
      }
    } else {
      if (translationY > 0) {
        scheduleOnRN(setDirection, Directions.DOWN);
        // moving down
      } else {
        scheduleOnRN(setDirection, Directions.UP);
        // moving up
      }
    }
  });

  const measureBoard = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    const horizontalCells = Math.floor(width / INITIAL_SNAKE_CELL_SIZE);
    const cellSize = width / horizontalCells;
    const verticalCells = Math.floor(height / cellSize);
    const xMax = horizontalCells - 1;
    const yMax = verticalCells - 1;
    setGameBounds((prev) => ({
      ...prev,
      xMax,
      yMax,
    }));
    updateFruitIndex();
    const { x, y } = randomFoodPos(horizontalCells, verticalCells);
    setFood({ x, y });
    setSnakeCellSize(cellSize);
    setBoardHeight(verticalCells * cellSize);
    setTimeout(setIsLoading, 1000);
  };

  const pauseGame = () => setIsPaused((prev) => !prev);

  const reloadGame = () => {
    setSnake(SNAKE_INITIAL_POSITION);
    const foodPos = randomFoodPos(gameBounds.xMax, gameBounds.yMax);
    setFood(foodPos);
    setIsGameOver(false);
    setScore(0);
    direction.current = Directions.RIGHT;
    lastMoveDirection.current = Directions.RIGHT;
    setIsPaused(false);
  };

  return (
    <Fragment>
      <GestureDetector gesture={panGesture}>
        <SafeAreaView style={styles.container}>
          <View style={{ flex: 1, gap: 30 }}>
            <Header
              score={score}
              scoreScale={scoreScale}
              isPaused={isPaused}
              pauseGame={pauseGame}
              reloadGame={reloadGame}
            />
            <View style={styles.boundaries} onLayout={measureBoard}>
              {isLoading ? (
                <Loading />
              ) : (
                <View
                  style={{
                    height: boardHeight,
                    backgroundColor: Colors.background,
                  }}
                >
                  <Snake snake={snake} cellSize={snakeCellSize} />
                  <Food
                    pos={{ x: food.x, y: food.y }}
                    cellSize={snakeCellSize}
                    fruitIndex={fruitIndex.current}
                  />
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </GestureDetector>
      {isGameOver ? (
        <Animated.View style={styles.cover}>
          <Animated.View
            entering={BounceIn.duration(300)}
            style={styles.gameOver}
          >
            <View style={styles.gameOverContent}>
              <Text style={{ fontSize: 40 }}>😕</Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                Game over!
              </Text>
            </View>
            <AnimatedButton onPress={reloadGame} title="Play again" />
          </Animated.View>
        </Animated.View>
      ) : null}
    </Fragment>
  );
};

export default Game;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
  },
  boundaries: {
    flex: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  cover: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  gameOver: {
    padding: 20,
    backgroundColor: Colors.background,
    alignItems: "center",
    gap: 16,
    minWidth: 280,
  },
  gameOverContent: {
    gap: 4,
    alignItems: "center",
  },
});
