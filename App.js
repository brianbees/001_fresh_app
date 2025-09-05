import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { COLORS } from "./styles";

// Screens
import PlayerSelectionScreen from "./src/screens/PlayerSelectionScreen";
import ScoreScreen from "./src/screens/ScoreScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 6); // visible safe-area strip below the tab bar

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.appBg || "#eef4fa" }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.tabBar,     // pale-blue tab bar
            borderTopWidth: 1,
            borderTopColor: "#000",
            height: 58,                          // base height only (no inset here)
          },
          tabBarLabelStyle: { fontWeight: "600" },
        }}
      >
        <Tab.Screen name="Score" component={ScoreScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </View>
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
