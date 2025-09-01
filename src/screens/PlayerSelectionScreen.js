import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import DevVersionLabel from "../components/DevVersionLabel";

const counts = [1, 2, 3, 4, 5, 6];

export default function PlayerSelectionScreen({ navigation }) {
  const onPick = (n) => {
    navigation.replace("MainTabs", { screen: "Score", params: { players: n } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How many players?</Text>
      <FlatList
        data={counts}
        keyExtractor={(x) => String(x)}
        numColumns={3}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.btn} onPress={() => onPick(item)}>
            <Text style={styles.btnText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <DevVersionLabel />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, gap: 16 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 10 },
  btn: {
    flex: 1,
    minWidth: 90,
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { fontSize: 20, fontWeight: "700" },
});
