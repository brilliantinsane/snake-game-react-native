import { StyleSheet } from "react-native";
import React, { Fragment } from "react";
import { Coordinate } from "../types/types";
import { Colors } from "../styles/colors";
import Animated from "react-native-reanimated";

type SnakeProps = {
  snake: Coordinate[];
  cellSize: number;
};

const Snake = ({ snake, cellSize }: SnakeProps) => {
  return (
    <Fragment>
      {snake.map((segment, index) => {
        const segmentStyle = {
          height: cellSize,
          width: cellSize,
          transform: [
            { translateX: segment.x * cellSize },
            { translateY: segment.y * cellSize },
          ],
          transitionProperty: "transform",
          transitionDuration: 150,
          transitionTimingFunction: "linear",
        };
        return (
          <Animated.View
            key={index}
            style={[styles.snakeSegment, segmentStyle]}
          />
        );
      })}
    </Fragment>
  );
};

export default Snake;

const styles = StyleSheet.create({
  snakeSegment: {
    borderRadius: 7,
    backgroundColor: Colors.primary,
    position: "absolute",
    transformOrigin: "center",
  },
});
