import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function PlayerSelectionScreen() {
  const nav = useNavigation();
  const go = (players) => {
    nav.navigate("MainTabs", { screen: "Score", params: { players } });
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Select Players</Text>
      <View style={styles.grid}>
        {[1,2,3,4,5,6].map((n) => (
          <Pressable
            key={n}
            onPress={() => go(n)}
            style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
          >
            <Text style={styles.btnText}>{n}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", padding: 16 },
  title: { fontSize: 22, fontWeight: "900", marginBottom: 16 },
  grid: { width: "86%", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  btn: {
    width: "30%",
    aspectRatio: 1.2,
    backgroundColor: "#1565C0",
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  btnText: { color: "#FFF", fontSize: 22, fontWeight: "900" },
  pressed: { opacity: 0.85 },
});
