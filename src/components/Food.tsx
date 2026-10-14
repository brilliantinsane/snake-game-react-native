import { StyleSheet, Text } from "react-native";
import React from "react";
import { Coordinate } from "@/types/types";
import { FRUIT_EMOJIS } from "@/constants/globals";

type FoodProps = {
  pos: Coordinate;
  cellSize: number;
  fruitIndex: number;
};

const Food = ({ pos, cellSize, fruitIndex }: FoodProps) => (
  <Text
    style={[
      styles.foodSegment,
      {
        top: pos.y * cellSize,
        left: pos.x * cellSize,
      },
    ]}
  >
    <Text>{FRUIT_EMOJIS[fruitIndex]}</Text>
  </Text>
);

export default Food;

const styles = StyleSheet.create({
  foodSegment: {
    height: 20,
    width: 20,
    borderRadius: 7,
    position: "absolute",
  },
});
