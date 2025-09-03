import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function PlayerSelectionScreen({ navigation }) {
  const go = (n) => {
    // Navigate to the Score tab through the Tabs navigator with nested params
    navigation.navigate("MainTabs", {
      screen: "Score",
      params: { playerCount: n },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Number of Players</Text>
      <View style={styles.grid}>
        {[1,2,3,4,5,6].map((n) => (
          <Pressable key={n} onPress={() => go(n)} style={styles.choice}>
            <Text style={styles.choiceTxt}>{n} Player{n>1 ? "s" : ""}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef4fa", alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 20, fontWeight: "800", marginBottom: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  choice: {
    width: 130, paddingVertical: 14, margin: 8, borderRadius: 12,
    backgroundColor: "#0f1e36", alignItems: "center", justifyContent: "center",
  },
  choiceTxt: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
