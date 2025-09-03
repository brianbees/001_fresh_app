import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function AppHeader({ title = "Scoring", onBack }) {
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {/* Red brand band */}
      <View style={styles.brandBand}>
        <Text style={styles.brandText}>University Challenge Scoring App</Text>
      </View>

      {/* Navy toolbar */}
      <View style={styles.toolbar}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.backHit}>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={{ width: 48 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { },
  brandBand: { backgroundColor: "#CC2222", alignItems: "center", justifyContent: "center", paddingVertical: 8 },
  brandText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  toolbar: {
    height: 44,
    backgroundColor: "#0f1e36",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  backHit: { paddingVertical: 8, paddingRight: 12 },
  backLabel: { color: "#fff", fontSize: 14, fontWeight: "700" },
  title: { flex: 1, color: "#fff", textAlign: "center", fontWeight: "800", fontSize: 16 },
});
