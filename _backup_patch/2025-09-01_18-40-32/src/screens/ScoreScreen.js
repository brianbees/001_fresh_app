import React, { useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveSession } from "../storage/db";

export default function ScoreScreen() {
  // Four players A–D
  const initialPlayers = useMemo(() => ([
    { id: "A", name: "Player A", score: 0 },
    { id: "B", name: "Player B", score: 0 },
    { id: "C", name: "Player C", score: 0 },
    { id: "D", name: "Player D", score: 0 },
  ]), []);

  const [players, setPlayers] = useState(initialPlayers);
  const historyRef = useRef([]);

  const addPoints = (id, pts) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, score: (Number(p.score) || 0) + pts } : p));
    historyRef.current.push({ id, delta: pts });
  };

  const undo = (id) => {
    // Find last change for this player
    for (let i = historyRef.current.length - 1; i >= 0; i--) {
      const h = historyRef.current[i];
      if (h.id === id) {
        // reverse it
        setPlayers(prev => prev.map(p => p.id === id ? { ...p, score: (Number(p.score) || 0) - h.delta } : p));
        historyRef.current.splice(i, 1);
        return;
      }
    }
    Alert.alert("UNDO", "No recent change for this player.");
  };

  const resetPlayer = (id) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, score: 0 } : p));
    // purge history for this player
    historyRef.current = historyRef.current.filter(h => h.id !== id);
  };

  const saveMatch = async () => {
    try {
      const match = {
        played_at: new Date().toISOString(),
        players: players.map(p => ({ name: p.name, score: Number(p.score) || 0 })),
      };
      await saveSession(match);
      Alert.alert("Saved", "Match saved to history.");
    } catch (e) {
      Alert.alert("Save failed", String(e?.message || e));
    }
  };

  const endMatch = () => {
    Alert.alert(
      "End Match",
      "Do you want to end this match? Scores will remain on screen.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => {} },
      ]
    );
  };

  const renderPlayerCard = (p) => (
    <View key={p.id} style={styles.card}>
      <Text style={styles.playerName}>{p.name}</Text>
      <Text style={styles.scoreText}>{p.score}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => addPoints(p.id, 10)} style={[styles.btn, styles.starterBtn]}>
          <Text style={styles.btnText}>+10 Starter</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => addPoints(p.id, 5)} style={[styles.btn, styles.bonusBtn]}>
          <Text style={styles.btnText}>+5 Bonus</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => undo(p.id)} style={[styles.smallBtn, styles.undoBtn]}>
          <Text style={styles.smallBtnText}>UNDO</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => resetPlayer(p.id)} style={[styles.smallBtn, styles.resetBtn]}>
          <Text style={styles.smallBtnText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <View style={styles.row}>
          <View style={styles.col}>{renderPlayerCard(players[0])}</View>
          <View style={styles.col}>{renderPlayerCard(players[1])}</View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>{renderPlayerCard(players[2])}</View>
          <View style={styles.col}>{renderPlayerCard(players[3])}</View>
        </View>
      </View>

      {/* Anchored footer bar inside SafeArea */}
      <SafeAreaView
        edges={["bottom"]}
        style={styles.footerSafe}
      >
        <View style={styles.footerBar}>
          <TouchableOpacity onPress={saveMatch} style={[styles.footerBtn, styles.saveButton]}>
            <Text style={styles.footerBtnText}>Save Match</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={endMatch} style={[styles.footerBtn, styles.endButton]}>
            <Text style={styles.footerBtnText}>End Match</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const ACCENT = "#F9DABA"; // per Master Index
const BG_CARD = "#101317";
const BG_PAGE = "#0B0E12";
const TEXT = "#FFFFFF";
const MUTED = "#A8B0BD";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_PAGE,
  },
  grid: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 96, // leave space behind the anchored footer
  },
  row: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  col: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: BG_CARD,
    borderRadius: 16,
    padding: 12,
    borderTopWidth: 6,
    borderTopColor: ACCENT,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  playerName: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 42,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  btn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#1E2630",
  },
  starterBtn: {
    borderWidth: 1,
    borderColor: "#2C8CFF",
  },
  bonusBtn: {
    borderWidth: 1,
    borderColor: "#32D583",
  },
  btnText: {
    color: TEXT,
    fontWeight: "700",
  },
  smallBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#161B22",
    borderWidth: 1,
    borderColor: "#2A313B",
  },
  undoBtn: {},
  resetBtn: {},
  smallBtnText: {
    color: MUTED,
    fontWeight: "700",
  },

  // Anchored footer
  footerSafe: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  footerBar: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: Platform.OS === "android" ? 12 : 8,
    backgroundColor: BG_PAGE,
    borderTopWidth: 1,
    borderTopColor: "#000",
    zIndex: 999,
    elevation: 8,
  },
  footerBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 999,
  },
  saveButton: {
    backgroundColor: ACCENT,
  },
  endButton: {
    backgroundColor: "#EF4444",
  },
  footerBtnText: {
    color: "#0B0E12",
    fontWeight: "800",
  },
});
