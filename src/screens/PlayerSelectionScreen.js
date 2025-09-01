import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles, { COLORS } from "../../styles";

export default function PlayerSelectionScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const go = (n) => navigation.replace("MainTabs", { playerCount: n });

  return (
    <View style={styles.screen}>
      <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
        <View style={styles.topRedBand}>
          <Text style={styles.topRedText}>University Challenge Scoring App</Text>
        </View>
        <View style={styles.subNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.subNavTitle}>Player Selection</Text>
          <View style={{ width: 84 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.contentWrap, { paddingBottom: 24 }]}>
        <Text style={{ color: "#fff", fontSize: 18, marginBottom: 12, fontWeight: "700" }}>
          Select number of players:
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {[1,2,3,4,5,6].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => go(n)}
              style={{
                backgroundColor: COLORS.blueBtn,
                borderColor: "#173b87",
                borderWidth: 3,
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 18,
                width: "30%",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "900" }}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
