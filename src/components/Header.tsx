import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { PauseIcon, PlayIcon, Refresh01Icon } from "@hugeicons/core-free-icons";
import { Colors } from "../styles/colors";
import AnimatedButton from "./AnimatedButton";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type HeaderProps = {
  score: number;
  isPaused: boolean;
  pauseGame: () => void;
  reloadGame: () => void;
  scoreScale: SharedValue<number>;
};

const Header = ({
  score,
  isPaused,
  pauseGame,
  reloadGame,
  scoreScale,
}: HeaderProps) => {
  const scoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));
  return (
    <View style={styles.container}>
      <View style={[styles.sideColumn, styles.leftColumn]}>
        <AnimatedButton
          onPress={reloadGame}
          icon={Refresh01Icon}
          variant="icon"
        />
      </View>
      <View style={styles.centerColumn}>
        <Animated.Text style={[styles.score, scoreStyle]}>
          {score}
        </Animated.Text>
      </View>
      <View style={[styles.sideColumn, styles.rightColumn]}>
        <AnimatedButton
          onPress={pauseGame}
          icon={isPaused ? PlayIcon : PauseIcon}
          variant="icon"
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  centerColumn: {
    alignItems: "center",
    alignSelf: "center",
  },
  sideColumn: {
    flex: 1,
  },
  leftColumn: {
    alignItems: "flex-start",
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  score: {
    fontSize: 28,
    fontWeight: 700,
    color: Colors.primary,
  },
});
