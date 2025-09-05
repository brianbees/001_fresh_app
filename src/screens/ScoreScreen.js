import React, { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import AppHeader from "../components/AppHeader";
import { saveSession } from "../storage/db";

const LETTERS = ["A","B","C","D","E","F"];
function buildPlayers(count) {
  const n = Math.max(1, Math.min(6, count || 4));
  return Array.from({ length: n }, (_, i) => ({
    name: `Player ${LETTERS[i] || i+1}`,
    score: 0
  }));
}

export default function ScoreScreen({ route, navigation }) {
  const tabBarHeight = useBottomTabBarHeight();

  const routePlayers = Array.isArray(route?.params?.players)
    ? route.params.players.map(p => ({ name: p.name ?? String(p), score: Number(p.score) || 0 }))
    : null;
  const playerCount = typeof route?.params?.playerCount === "number" ? route.params.playerCount : null;

  const initialPlayers = routePlayers ?? buildPlayers(playerCount ?? 4);
  const [players, setPlayers] = useState(initialPlayers);

  // Measure footer so content never hides beneath it
  const EST = { padTop: 10, padBot: 12, btnH: 48 };
  const [footerH, setFooterH] = useState(EST.padTop + EST.padBot + EST.btnH);

  const increment = (idx, delta) =>
    setPlayers(prev => {
      const next = [...prev];
      const s = Number(next[idx].score) || 0;
      next[idx] = { ...next[idx], score: s + delta };
      return next;
    });
  const resetOne = (idx) =>
    setPlayers(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], score: 0 };
      return next;
    });
  const undoOne = (idx) =>
    setPlayers(prev => {
      const next = [...prev];
      const s = Number(next[idx].score) || 0;
      const step = s % 10 === 5 ? 5 : 10;
      next[idx] = { ...next[idx], score: Math.max(0, s - step) };
      return next;
    });

  const onSaveMatch = async () => {
    try {
      const match = {
        created_at: new Date().toISOString(),
        players: players.map(p => ({ name: p.name, score: Number(p.score) || 0 })),
      };
      await saveSession(match);
      Alert.alert("Saved", "Match saved to history.");
      navigation?.navigate?.("History");
    } catch (err) {
      Alert.alert("Error", "Failed to save match: " + (err?.message ?? String(err)));
    }
  };

  const onEndMatch = () => {
    Alert.alert(
      "End Match",
      "Are you sure you want to end this match?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End",
          style: "destructive",
          onPress: () => {
            try { navigation?.navigate?.("PlayerSelection"); }
            catch { navigation?.goBack?.(); }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Footer floats just above tab bar with a tiny gap
  const footerBottom = tabBarHeight; // tabBarHeight excludes the outer safe-area spacer in App.js

  // Ensure the last card never hides under the floating footer
const extraBottomPadding = Math.max(footerH - tabBarHeight, 12);  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <AppHeader title="Scoring" onBack={() => {
        try { navigation?.navigate?.("PlayerSelection"); } catch { navigation?.goBack?.(); }
      }} />

      <View style={styles.content}>
        <ScrollView
          key={`${footerH}-${footerBottom}`}
          showsVerticalScrollIndicator={false}
contentContainerStyle={{
  ...styles.contentInner,
  paddingBottom: 12
}}      >
          <View style={styles.grid}>
            {players.map((p, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.name}>{p.name}</Text>
                <Text style={styles.score}>{p.score}</Text>

                <View style={styles.row}>
                  <Pressable style={[styles.actBtn, styles.btnPrimary]} onPress={() => increment(idx, 10)}>
                    <Text style={styles.actTxt}>+10 Starter</Text>
                  </Pressable>
                  <Pressable style={[styles.actBtn, styles.btnSecondary]} onPress={() => increment(idx, 5)}>
                    <Text style={styles.actTxt}>+5 Bonus</Text>
                  </Pressable>
                </View>

                <View style={styles.row}>
                  <Pressable style={[styles.smallBtn, styles.btnUndo]} onPress={() => undoOne(idx)}>
                    <Text style={styles.smallTxt}>Undo</Text>
                  </Pressable>
                  <Pressable style={[styles.smallBtn, styles.btnReset]} onPress={() => resetOne(idx)}>
                    <Text style={styles.smallTxt}>Reset</Text>
                  </Pressable>
                </View>
              </View>
            ))}

            {/* Final spacer as a failsafe on slow layout devices */}
   {/* Optional: Reduce spacer height or remove entirely */}
            {/* <View style={{ height: 24 }} /> */}          </View>
        </ScrollView>
      </View>

      <View
  style={[styles.footer, { position: "absolute", left: 0, right: 0, bottom: 0 }]}
  onLayout={e => setFooterH(e.nativeEvent.layout.height)}
>
        <Pressable style={[styles.cta, styles.ctaSave]} onPress={onSaveMatch}>
          <Text style={styles.ctaSaveText}>Save Match</Text>
        </Pressable>
        <Pressable style={[styles.cta, styles.ctaEnd]} onPress={onEndMatch}>
          <Text style={styles.ctaEndText}>End Match</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const CARD_GAP = 12;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#eef4fa" },
  content: { flex: 1 },
  contentInner: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 12 },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    width: "48%", backgroundColor: "#fff", borderRadius: 16,
    padding: 12, marginBottom: CARD_GAP, shadowColor: "#000",
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  score: { fontSize: 36, fontWeight: "800", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  actBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 6 },
  btnPrimary: { backgroundColor: "#2f58b7" },
  btnSecondary:{ backgroundColor: "#3b6fe0" },
  actTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },
  smallBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 6, marginTop: 8 },
  btnUndo:  { backgroundColor: "#2f3338" },
  btnReset: { backgroundColor: "#9ba3ae" },
  smallTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },

  // Footer bar (floating)
  footer: {
    backgroundColor: "#0f1e36",
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cta: { flex: 1, borderRadius: 18, paddingVertical: 12, alignItems: "center", justifyContent: "center" },
  ctaSave: { backgroundColor: "#F9DABA", marginRight: 8, borderWidth: 1, borderColor: "#a68050" },
  ctaEnd:  { backgroundColor: "#b23b2e", marginLeft: 8 },
  ctaSaveText: { color: "#111", fontWeight: "900", fontSize: 16 },
  ctaEndText:  { color: "#fff", fontWeight: "800", fontSize: 16 },
});
