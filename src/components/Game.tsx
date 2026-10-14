import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  globalStyles,
  Colors,
  FOOD_INITIAL_POSITION,
  INITIAL_MOVE_INTERVAL,
  INITIAL_SNAKE_CELL_SIZE,
  MIN_MOVE_INTERVAL,
  OPPOSITE_DIRECTION,
  SCORE_INCREMENT,
  SNAKE_INITIAL_POSITION,
  SPEED_INCREMENT,
  FRUIT_EMOJIS,
  GAME_OVER_EMOJIS,
} from "@/constants/globals";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { Coordinate, GameBounds } from "@/types/types";
import Snake from "./Snake";
import { checkGameOver } from "@/utils/checkGameOver";
import { checkEatsFood } from "@/utils/checkEatsFood";
import { randomFoodPos } from "@/utils/randomFoodPos";
import Loading from "./Loading";
import Food from "./Food";
import Header from "./Header";
import { scheduleOnRN } from "react-native-worklets";
import Animated, {
  BounceIn,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import AnimatedButton from "./AnimatedButton";

const Game = () => {
  const direction = useRef<Directions>(Directions.RIGHT);
  const lastMoveDirection = useRef<Directions>(Directions.RIGHT);
  const [snake, setSnake] = useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
  const [food, setFood] = useState<Coordinate>(FOOD_INITIAL_POSITION);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameBounds, setGameBounds] = useState<GameBounds>({
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
  });
  const [boardHeight, setBoardHeight] = useState<number>(0);
  const [snakeCellSize, setSnakeCellSize] = useState<number>(
    INITIAL_SNAKE_CELL_SIZE,
  );
  const [score, setScore] = useState<number>(0);
  const [fruitIndex, setFruitIndex] = useState<number>(
    Math.floor(Math.random() * FRUIT_EMOJIS.length),
  );
  const [gameOverIndex, setGameOverIndex] = useState<number>(
    Math.floor(Math.random() * GAME_OVER_EMOJIS.length),
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    setFruitIndex(Math.floor(Math.random() * FRUIT_EMOJIS.length));
  const updateGameOverIndex = () =>
    setGameOverIndex(Math.floor(Math.random() * GAME_OVER_EMOJIS.length));

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
    updateFruitIndex();
    updateGameOverIndex();
    setIsPaused(false);
  };

  return (
    <Fragment>
      <GestureDetector gesture={panGesture}>
        <SafeAreaView style={[globalStyles.container, styles.screen]}>
          <View style={[globalStyles.container, styles.gameContainer]}>
            <Header
              score={score}
              scoreScale={scoreScale}
              isPaused={isPaused}
              pauseGame={pauseGame}
              reloadGame={reloadGame}
            />
            <View
              style={[globalStyles.container, styles.boundaries]}
              onLayout={measureBoard}
            >
              {isLoading ? (
                <Loading />
              ) : (
                <View
                  style={[
                    styles.board,
                    {
                      height: boardHeight,
                    },
                  ]}
                >
                  <Snake snake={snake} cellSize={snakeCellSize} />
                  <Food
                    pos={{ x: food.x, y: food.y }}
                    cellSize={snakeCellSize}
                    fruitIndex={fruitIndex}
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
              <Text style={styles.gameOverEmoji}>
                {GAME_OVER_EMOJIS[gameOverIndex]}
              </Text>
              <Text style={styles.gameOverTitle}>Game over!</Text>
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
  screen: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
  },
  gameContainer: {
    gap: 30,
  },
  boundaries: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  board: {
    backgroundColor: Colors.background,
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
  gameOverEmoji: {
    fontSize: 40,
  },
  gameOverTitle: {
    fontSize: 24,
    fontWeight: 700,
  },
});
