import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { isIos } from "../constants/globals";
import { FullWindowOverlay } from "react-native-screens";
import { Colors } from "../styles/colors";

const LoadingContent = () => {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <Text style={{ color: Colors.background, fontSize: 24 }}>Loading...</Text>
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
});
