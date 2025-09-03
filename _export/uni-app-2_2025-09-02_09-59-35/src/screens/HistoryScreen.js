import React, { useCallback, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { getSessions } from "../storage/db";

export default function HistoryScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const refresh = useCallback(() => {
    let canceled = false;

    (async () => {
      try {
        setErrorText("");
        setLoading(true);
        const rows = await getSessions(100);
        const mapped = (rows || []).map((r) => {
          const data = r?.data || {};
          const ts = data?.created_at || r?.created_at;
          const players = Array.isArray(data?.players) ? data.players : [];
          return {
            id: r?.id ?? String(ts),
            timestamp: ts,
            playersCount: players.length,
            players,
          };
        });
        if (!canceled) setItems(mapped);
      } catch (err) {
        if (!canceled) setErrorText(err?.message || "Failed to load history.");
      } finally {
        if (!canceled) setLoading(false);
      }
    })();

    return () => { canceled = true; };
  }, []);

  useFocusEffect(refresh);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.when}>
        {formatWhen(item.timestamp)} · {item.playersCount ?? (item.players?.length ?? 0)} players
      </Text>
      {Array.isArray(item.players) && item.players.length > 0 ? (
        <View style={styles.row}>
          {item.players.map((p, idx) => (
            <View key={String(idx)} style={styles.pill}>
              <Text style={styles.pillText}>
                {safeText(p?.name)}: {Number.isFinite(p?.score) ? p.score : "-"}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.muted}>No player details</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top","right","left","bottom"]}>
      <View style={styles.container}>
        <Text style={styles.title}>History</Text>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text style={styles.muted}>Loading.</Text>
          </View>
        )}

        {!loading && !!errorText && (
          <View style={styles.center}>
            <Text style={styles.error}>{errorText}</Text>
          </View>
        )}

        {!loading && !errorText && (
          <FlatList
            data={items}
            keyExtractor={(item, index) => String(item?.id ?? index)}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
            contentContainerStyle={items.length === 0 && styles.centerList}
            ListEmptyComponent={<Text style={styles.muted}>No saved sessions yet.</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function formatWhen(iso) {
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day} ${hh}:${mm}`;
  } catch {
    return String(iso ?? "");
  }
}

function safeText(s) { if (s === null || s === undefined) return ""; return String(s); }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  center: { alignItems: "center", justifyContent: "center", paddingVertical: 24 },
  centerList: { flexGrow: 1, alignItems: "center", justifyContent: "center", paddingVertical: 48 },
  error: { color: "#b00020", fontSize: 14, textAlign: "center" },
  muted: { color: "#6b7280", fontSize: 14 },
  card: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
  },
  when: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  row: { flexDirection: "row", flexWrap: "wrap" },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#eef6ff",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#cfe3ff",
    marginRight: 8,
    marginBottom: 8,
  },
  pillText: { fontSize: 13, fontWeight: "600" },
  sep: { height: 12 },
});
