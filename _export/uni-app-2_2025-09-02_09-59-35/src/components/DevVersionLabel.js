import React from "react";
import { View, Text, StyleSheet } from "react-native";
import meta from "../version.json";

export default function DevVersionLabel() {
  if (!__DEV__) return null;
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>
        v{meta.version} • {meta.devBuild} • {meta.timestamp} • {meta.commit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
  },
  text: { fontSize: 12, fontWeight: "600" },
});
