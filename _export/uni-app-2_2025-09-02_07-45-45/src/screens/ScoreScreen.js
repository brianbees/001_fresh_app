import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import { saveSession } from "../storage/db";

// Keep probe on for one pass; set to false once verified.
const PROBE_ENABLED = true;

// Helper
const LETTERS = ["A","B","C","D","E","F"];
function buildPlayers(count) {
  const n = Math.max(1, Math.min(6, count || 4));
  return Array.from({ length: n }, (_, i) => ({ name: `Player ${LETTERS[i]}`, score: 0 }));
}

export default function ScoreScreen({ route, navigation }) {
  const routePlayers = Array.isArray(route?.params?.players)
    ? route.params.players.map(p => ({ name: p.name ?? String(p), score: Number(p.score) || 0 }))
    : null;
  const playerCount = typeof route?.params?.playerCount === "number" ? route.params.playerCount : null;

  const initialPlayers = routePlayers ?? buildPlayers(playerCount ?? 4);
  const [players, setPlayers] = useState(initialPlayers);

  const insets = useSafeAreaInsets();
  const [headerH, setHeaderH] = useState(0);
  const [footerH, setFooterH] = useState(0);

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

  const contentStyle = useMemo(
    () => [{ top: headerH, bottom: footerH }],
    [headerH, footerH]
  );

  return (
    <View style={styles.container}>
      {/* HEADER (absolute, measured) */}
      <View
        style={styles.headerWrap}
        pointerEvents="box-none"
        onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}
      >
        <AppHeader
          title="Scoring"
          onBack={() => {
            try { navigation?.navigate?.("PlayerSelection"); }
            catch { navigation?.goBack?.(); }
          }}
        />
      </View>

      {/* CONTENT (absolute middle) */}
      <View style={[styles.contentWrap, ...contentStyle]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentInner}>
          <View style={styles.grid}>
            {players.map((p, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.name}>{p.name}</Text>
                <Text style={styles.score}>{p.score}</Text>

                <View style={styles.row}>
                  <Pressable style={styles.actBtn} onPress={() => increment(idx, 10)}>
                    <Text style={styles.actTxt}>+10 Starter</Text>
                  </Pressable>
                  <Pressable style={styles.actBtn} onPress={() => increment(idx, 5)}>
                    <Text style={styles.actTxt}>+5 Bonus</Text>
                  </Pressable>
                </View>

                <View style={styles.row}>
                  <Pressable style={styles.smallBtn} onPress={() => undoOne(idx)}>
                    <Text style={styles.smallTxt}>Undo</Text>
                  </Pressable>
                  <Pressable style={styles.smallBtn} onPress={() => resetOne(idx)}>
                    <Text style={styles.smallTxt}>Reset</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* FOOTER (absolute, flush with tab bar / device bottom) */}
      <View
        style={[
          styles.footerWrap,
          { bottom: 0, paddingBottom: Math.max(insets.bottom, 12) },
        ]}
        onLayout={(e) => setFooterH(e.nativeEvent.layout.height)}
        pointerEvents="box-none"
      >
        <View style={styles.footerRow}>
          <Pressable style={[styles.cta, styles.ctaSave]} onPress={onSaveMatch}>
            <Text style={styles.ctaLabel}>Save Match</Text>
          </Pressable>
          <Pressable style={[styles.cta, styles.ctaEnd]} onPress={onEndMatch}>
            <Text style={styles.ctaLabel}>End Match</Text>
          </Pressable>
        </View>
      </View>

      {/* PROBE */}
      {PROBE_ENABLED && (
        <View style={styles.probe}>
          <Text style={styles.probeTxt}>
            hdr:{headerH.toFixed(0)}  ftr:{footerH.toFixed(0)}  insetB:{insets.bottom.toFixed(0)}
          </Text>
        </View>
      )}
    </View>
  );
}

const CARD_GAP = 12;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef4fa", position: "relative" },

  headerWrap: {
    position: "absolute", top: 0, left: 0, right: 0, zIndex: 30, elevation: 30,
  },

  contentWrap: { position: "absolute", left: 0, right: 0, zIndex: 10 },
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

  actBtn: {
    flex: 1, backgroundColor: "#cfeef9", paddingVertical: 10,
    borderRadius: 10, alignItems: "center", justifyContent: "center",
    marginRight: 6,
  },
  actTxt: { fontSize: 14, fontWeight: "700" },

  smallBtn: {
    flex: 1, backgroundColor: "#eee", paddingVertical: 10, borderRadius: 10,
    alignItems: "center", justifyContent: "center", marginRight: 6, marginTop: 8,
  },
  smallTxt: { fontSize: 14, fontWeight: "700" },

  footerWrap: {
    position: "absolute", left: 0, right: 0, backgroundColor: "#0f1e36",
    borderTopWidth: 1, borderTopColor: "#000", paddingTop: 10,
    paddingHorizontal: 16, zIndex: 30, elevation: 30,
  },
  footerRow: { flexDirection: "row", justifyContent: "space-between" },
  cta: { flex: 1, borderRadius: 18, paddingVertical: 12, alignItems: "center", justifyContent: "center" },
  ctaSave: { backgroundColor: "#2f7d31", marginRight: 8 },
  ctaEnd:  { backgroundColor: "#b23b2e", marginLeft: 8 },
  ctaLabel: { color: "#fff", fontWeight: "800", fontSize: 16 },

  probe: {
    position: "absolute", top: 6, right: 6, backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, zIndex: 100,
  },
  probeTxt: { color: "#fff", fontSize: 12, fontWeight: "700" },
});
