import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { isIos, Colors } from "@/constants/globals";
import { FullWindowOverlay } from "react-native-screens";

const LoadingContent = () => {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const Loading = () => {
  if (isIos)
    return (
      <FullWindowOverlay>
        <LoadingContent />
      </FullWindowOverlay>
    );
  return <LoadingContent />;
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Colors.background,
    fontSize: 24,
  },
});
