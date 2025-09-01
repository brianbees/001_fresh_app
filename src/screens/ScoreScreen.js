import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import AppHeader from "../components/AppHeader";
import { saveSession } from "../storage/db";

export default function ScoreScreen({ route, navigation }) {
  // Players A–D fallback
  const initialPlayers =
    route?.params?.players ??
    ["Player A", "Player B", "Player C", "Player D"].map((name) => ({
      name,
      score: 0,
    }));
  const [players, setPlayers] = useState(initialPlayers);

  // Measured header/footer heights for precise bounding
  const [headerH, setHeaderH] = useState(0);
  const [footerH, setFooterH] = useState(0);

  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight?.() ?? 0; // when tabs are visible

  // Scoring helpers
  const increment = (idx, delta) =>
    setPlayers((prev) => {
      const next = [...prev];
      const s = Number(next[idx].score) || 0;
      next[idx] = { ...next[idx], score: s + delta };
      return next;
    });

  const resetOne = (idx) =>
    setPlayers((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], score: 0 };
      return next;
    });

  const undoOne = (idx) =>
    setPlayers((prev) => {
      const next = [...prev];
      const s = Number(next[idx].score) || 0;
      const step = s % 10 === 5 ? 5 : 10;
      next[idx] = { ...next[idx], score: Math.max(0, s - step) };
      return next;
    });

  // Actions
  const onSaveMatch = async () => {
    try {
      const match = {
        created_at: new Date().toISOString(),
        players: players.map((p) => ({
          name: p.name,
          score: Number(p.score) || 0,
        })),
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
            try {
              navigation?.navigate?.("PlayerSelection");
            } catch {
              navigation?.goBack?.();
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // ---------------------------------------------------------------------------------
  // LAYOUT CONTRACT:
  // - Header: absolute at top; measured via onLayout -> headerH
  // - Footer: absolute at bottom; bottom = tabBarHeight (hugs tab bar with zero gap)
  // - Content: absolute middle; top = headerH; bottom = footerH + tabBarHeight
  // No magic paddings; no full-screen SafeAreaView.
  // ---------------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      {/* HEADER (absolute) */}
      <View
        style={styles.headerWrap}
        pointerEvents="box-none"
        onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}
      >
        <AppHeader
          title="Scoring"
          onBack={() => {
            try {
              navigation?.navigate?.("PlayerSelection");
            } catch {
              navigation?.goBack?.();
            }
          }}
        />
      </View>

      {/* CONTENT (absolute middle, bounded by measured header/footer + tab bar) */}
      <View
        style={[
          styles.contentWrap,
          { top: headerH, bottom: footerH + tabBarHeight },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentInner}
        >
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

      {/* FOOTER (absolute, hugs tab bar with no white strip) */}
      <View
        style={[
          styles.footerWrap,
          {
            bottom: tabBarHeight, // ← key: sit right above the tab bar (zero gap)
            paddingBottom: tabBarHeight > 0 ? 12 : Math.max(insets.bottom, 12),
          },
        ]}
        onLayout={(e) => setFooterH(e.nativeEvent.layout.height)}
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
    </View>
  );
}

const CARD_GAP = 12;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef4fa",
    position: "relative",
  },

  // Header layer
  headerWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    elevation: 20,
  },

  // Content layer
  contentWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
  },
  contentInner: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12, // only interior comfort; real bottom bound is via absolute bottom
  },

  // Cards grid (avoid RN gap bugs on some Androids; use margins)
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: CARD_GAP,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  score: { fontSize: 36, fontWeight: "800", marginBottom: 10 },

  row: { flexDirection: "row", justifyContent: "space-between" },

  actBtn: {
    flex: 1,
    backgroundColor: "#cfeef9",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  actTxt: { fontSize: 14, fontWeight: "700" },

  smallBtn: {
    flex: 1,
    backgroundColor: "#eee",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    marginTop: 8,
  },
  smallTxt: { fontSize: 14, fontWeight: "700" },

  // Footer layer
  footerWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#0f1e36", // navy strip
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 10,
    paddingHorizontal: 16,
    zIndex: 20,
    elevation: 20,
  },
  footerRow: { flexDirection: "row", justifyContent: "space-between" },
  cta: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaSave: { backgroundColor: "#2f7d31", marginRight: 8 }, // green
  ctaEnd: { backgroundColor: "#b23b2e", marginLeft: 8 },  // red
  ctaLabel: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
