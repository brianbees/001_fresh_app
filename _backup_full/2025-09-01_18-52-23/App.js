import React from "react";
import { View, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

// Screens
import PlayerSelectionScreen from "./src/screens/PlayerSelectionScreen";
import ScoreScreen from "./src/screens/ScoreScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

/**
 * Paint a coloured strip behind the tab bar that
 * stops ABOVE the bottom safe-area (gesture area).
 * Adds a 1px black top border.
 */
function TabBarBackground() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: insets.bottom,     // do NOT paint into the bottom safe area
          backgroundColor: "#c0ebf9",
          borderTopWidth: 1,
          borderTopColor: "black",
          ...(Platform.OS === "android" ? { elevation: 0 } : null),
        }}
      />
    </View>
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        // Keep tab bar itself transparent; we draw background via TabBarBackground
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,  // border handled by TabBarBackground
        },
        tabBarBackground: () => <TabBarBackground />,
      }}
    >
      <Tabs.Screen name="Score" component={ScoreScreen} />
      <Tabs.Screen name="History" component={HistoryScreen} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="PlayerSelection" component={PlayerSelectionScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
