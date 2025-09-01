import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { createSession } from "../storage/db";

function TeamCard({ name, score, onPlus10, onPlus5, onNameChange }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.score}>{score}</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.action} onPress={onPlus10}>
          <Text style={styles.actionText}>+10 Starter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={onPlus5}>
          <Text style={styles.actionText}>+5 Bonus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ScoreScreen() {
  const route = useRoute();
  const playerCount = route.params?.players ?? 2;

  const [scores, setScores] = React.useState(Array.from({ length: playerCount }, () => 0));
  const [names, setNames] = React.useState(
    Array.from({ length: playerCount }, (_, i) => `Player ${i + 1}`)
  );

  useFocusEffect(
    React.useCallback(() => {
      // Reset if we come in with a different player count
      setScores(Array.from({ length: playerCount }, () => 0));
      setNames(Array.from({ length: playerCount }, (_, i) => `Player ${i + 1}`));
    }, [playerCount])
  );

  const plus = (idx, amt) => {
    setScores((prev) => prev.map((v, i) => (i === idx ? v + amt : v)));
  };

  const resetAll = () => {
    setScores(Array.from({ length: playerCount }, () => 0));
  };

  const saveMatch = async () => {
    try {
      const total = scores.reduce((a, b) => a + b, 0);
      await createSession({
        started_at: new Date().toISOString(),
        players: playerCount,
        names: JSON.stringify(names),
        scores: JSON.stringify(scores),
        total,
      });
      Alert.alert("Saved", "Match saved to history.");
    } catch (e) {
      Alert.alert("Save failed", String(e));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.grid}>
        {scores.map((s, i) => (
          <TeamCard
            key={i}
            name={names[i]}
            score={s}
            onPlus10={() => plus(i, 10)}
            onPlus5={() => plus(i, 5)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.footerBtn, styles.reset]} onPress={resetAll}>
          <Text style={styles.footerText}>Reset All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerBtn, styles.save]} onPress={saveMatch}>
          <Text style={styles.footerText}>Save Match</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  grid: {
    padding: 16,
    gap: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#F9DABA",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#000",
  },
  name: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  score: { fontSize: 32, fontWeight: "800", marginBottom: 12 },
  row: { flexDirection: "row", gap: 10 },
  action: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, alignItems: "center" },
  actionText: { fontWeight: "600" },
  footer: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  footerBtn: { flex: 1, padding: 14, borderRadius: 12, alignItems: "center", borderWidth: 1 },
  reset: { backgroundColor: "#fff" },
  save: { backgroundColor: "#000" },
  footerText: { color: "#000", fontWeight: "700" },
});
