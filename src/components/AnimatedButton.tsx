import { Pressable, StyleSheet, Text } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { HugeiconsIcon, HugeiconsProps } from "@hugeicons/react-native";
import { Colors } from "@/constants/globals";

type Variant = "primary" | "icon";

type AnimatedButtonProps = {
  onPress: () => void;
  icon?: HugeiconsProps["icon"];
  title?: string;
  variant?: Variant;
};

type TextProps = {
  title: string;
  variant: Variant;
};

const ButtonText = ({ title, variant }: TextProps) => (
  <Text style={[styles.title, textStyles[variant]]}>{title}</Text>
);

const AnimatedButton = ({
  onPress,
  title,
  icon,
  variant = "primary",
}: AnimatedButtonProps) => {
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  const pressStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        opacity.value = withTiming(0.8, { duration: 100 });
        translateY.value = withTiming(4, { duration: 100 });
      }}
      onPressOut={() => {
        opacity.value = withTiming(1, { duration: 150 });
        translateY.value = withSpring(0, {
          stiffness: 400,
          damping: 20,
          mass: 0.5,
        });
      }}
      {...(variant !== "icon" && {
        style: styles[variant],
      })}
    >
      {icon ? (
        <Animated.View style={pressStyle}>
          <HugeiconsIcon
            icon={icon}
            size={24}
            color={Colors.primary}
            strokeWidth={3.5}
          />
        </Animated.View>
      ) : null}
      {title ? <ButtonText title={title} variant={variant} /> : null}
    </Pressable>
  );
};

export default AnimatedButton;

const styles = StyleSheet.create({
  primary: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
  },
});

const textStyles = StyleSheet.create({
  primary: {
    color: Colors.background,
  },
  icon: {
    color: Colors.primary,
  },
});
