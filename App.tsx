import "react-native-gesture-handler";
import React from "react";
import Game from "@/components/Game";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { globalStyles } from "@/constants/globals";

const App = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={globalStyles.container}>
        <Game />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
