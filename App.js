import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator, BottomTabBar } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

// Screens (unchanged)
import PlayerSelectionScreen from "./src/screens/PlayerSelectionScreen";
import ScoreScreen from "./src/screens/ScoreScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

/**
 * Custom wrapper around the default BottomTabBar:
 * - Renders a coloured layer ONLY above the bottom system inset.
 * - Leaves the Android gesture area fully transparent.
 * - Adds a 1px black top border.
 * - Keeps all default tab behaviour (labels, icons, animations).
 */
function MyTabBar(props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.tabWrapper} pointerEvents="box-none">
      {/* Background layer: fill bar area EXCLUDING the bottom inset */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "transparent",
          },
        ]}
      >
        {/* Top border */}
        <View style={styles.topBorder} />

        {/* Coloured strip — stops at the top of the system inset */}
        <View
          style={[
            styles.colourFill,
            {
              position: "absolute",
              top: 1,
              left: 0,
              right: 0,
              bottom: insets.bottom, // do NOT paint into gesture area
            },
          ]}
        />
      </View>

      {/* The real tab bar (kept transparent so our background shows through) */}
      <BottomTabBar
        {...props}
        style={[
          props.style,
          {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            ...(Platform.OS === "android" ? { elevation: 0 } : null),
          },
        ]}
      />
    </View>
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator
      // Use our wrapper; keep defaults otherwise.
      tabBar={(tabProps) => <MyTabBar {...tabProps} />}
      screenOptions={{
        headerShown: false,
        // Make sure nothing behind the tabs peeks through as white.
        sceneContainerStyle: { backgroundColor: "transparent" },
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

const styles = StyleSheet.create({
  tabWrapper: {
    // Wrapper is transparent; we draw the strip in our own background layer.
    backgroundColor: "transparent",
  },
  topBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "black",
  },
  colourFill: {
    backgroundColor: "#c0ebf9",
  },
});
