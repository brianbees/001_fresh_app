import React from "react";
import { View, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

// Screens (unchanged; assumed present)
import PlayerSelectionScreen from "./src/screens/PlayerSelectionScreen";
import ScoreScreen from "./src/screens/ScoreScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

/**
 * TabBarBackground stops at the bottom safe-area inset:
 * - We draw the coloured background ONLY from the top of the tab bar
 *   down to (bottom - insets.bottom), leaving the gesture area untouched.
 * - 1px black top border per spec.
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
          // Leave the bottom inset area unpainted:
          bottom: insets.bottom,
          backgroundColor: "#c0ebf9",
          borderTopWidth: 1,
          borderTopColor: "black",
          ...(Platform.OS === "android" ? { elevation: 0 } : null),
        }}
      />
    </View>
  );
}

/**
 * Simple, compliant setup:
 * - Do NOT alter headers or other UI.
 * - tabBarStyle is transparent; background is drawn via TabBarBackground,
 *   which respects safe areas.
 */
function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          {
            backgroundColor: "transparent", // background drawn by TabBarBackground
            borderTopWidth: 0,              // border handled by TabBarBackground
          },
        ],
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
        <Stack.Navigator>
          <Stack.Screen
            name="PlayerSelection"
            component={PlayerSelectionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
