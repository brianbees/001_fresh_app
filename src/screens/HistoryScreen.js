import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { listSessions, clearSessions } from "../storage/db";

export default function HistoryScreen() {
  const [items, setItems] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const load = async () => {
    const rows = await listSessions();
    setItems(rows);
  };

  React.useEffect(() => {
    load();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  const onClear = async () => {
    Alert.alert("Clear history", "Delete all saved sessions?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await clearSessions();
          await load();
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const names = JSON.parse(item.names || "[]");
    const scores = JSON.parse(item.scores || "[]");
    return (
      <View style={styles.card}>
        <Text style={styles.title}>
          {new Date(item.started_at).toLocaleString()} — {item.players} players
        </Text>
        <Text style={styles.body}>
          {names.map((n, i) => `${n}: ${scores[i] ?? 0}`).join("   ")}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(x) => String(x.id)}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 40 }}>No sessions yet.</Text>}
      />
      <TouchableOpacity style={styles.clearBtn} onPress={onClear}>
        <Text style={styles.clearText}>Clear All</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  title: { fontWeight: "700", marginBottom: 6 },
  body: { color: "#333" },
  clearBtn: {
    margin: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#000",
    alignItems: "center",
  },
  clearText: { color: "#fff", fontWeight: "700" },
});
