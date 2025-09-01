import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../../styles";
import { saveSession } from "../storage/db";

const PLAYER_NAMES = ["Player A", "Player B", "Player C", "Player D"];

function PlayerCard({ name, score, onAdd10, onAdd5, onUndo, onReset }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{name}</Text>

      <View style={styles.scoreTile}>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      <View style={styles.rowBtns}>
        <TouchableOpacity style={[styles.bigBtn, styles.bigBtnBlue]} onPress={onAdd10}>
          <Text style={styles.bigBtnText}>+10{"\n"}Starter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bigBtn, styles.bigBtnBlue]} onPress={onAdd5}>
          <Text style={styles.bigBtnText}>+5 Bonus</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.smallRow}>
        <TouchableOpacity style={[styles.smallBtn, styles.smallUndo]} onPress={onUndo}>
          <Text style={styles.smallText}>UNDO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.smallBtn, styles.smallReset]} onPress={onReset}>
          <Text style={styles.smallText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ScoreScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [players, setPlayers] = useState(
    PLAYER_NAMES.map((n) => ({ name: n, score: 0, history: [] }))
  );

  // We measure the real footer height on device and feed that back into ScrollView padding.
  const [footerH, setFooterH] = useState(0);
  const bottomPad = footerH + insets.bottom + 16; // 16 = a little breathing room

  const add = (idx, val) => {
    setPlayers((prev) => {
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        score: next[idx].score + val,
        history: [...next[idx].history, val],
      };
      return next;
    });
  };

  const undo = (idx) => {
    setPlayers((prev) => {
      const next = [...prev];
      const last = next[idx].history.pop();
      if (last) next[idx].score -= last;
      return next;
    });
  };

  const reset = (idx) => {
    setPlayers((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], score: 0, history: [] };
      return next;
    });
  };

  const handleSave = async () => {
    try {
      const match = {
        created_at: new Date().toISOString(),
        players: players.map((p) => ({ name: p.name, score: Number(p.score) || 0 })),
      };
      await saveSession(match);
      Alert.alert("Saved", "Match saved to history.");
    } catch (e) {
      Alert.alert("Error", String(e?.message || e));
    }
  };

  return (
    <View style={styles.screen}>
      {/* Top red band */}
      <View style={styles.topRedBand}>
        <Text style={styles.topRedText}>University Challenge Scoring App</Text>
      </View>

      {/* Navy sub-nav with centered title + Back */}
      <View style={styles.subNav}>
        <TouchableOpacity onPress={() => navigation.replace("PlayerSelection")} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.subNavTitle}>Scoring</Text>
        <View style={{ width: 84 }} />
      </View>

      {/* Scrollable player grid. Bottom padding = real measured footer height + safe-area */}
      <ScrollView
        contentContainerStyle={[styles.contentWrap, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {players.map((p, i) => (
            <PlayerCard
              key={p.name}
              name={p.name}
              score={p.score}
              onAdd10={() => add(i, 10)}
              onAdd5={() => add(i, 5)}
              onUndo={() => undo(i)}
              onReset={() => reset(i)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating footer bar (above tab bar), measured for padding. Keep on top via zIndex/elevation. */}
      <View
        style={[
          styles.footerWrap,
          { bottom: insets.bottom, zIndex: 20, elevation: 8 }
        ]}
        onLayout={(e) => setFooterH(e.nativeEvent.layout.height)}
      >
        <View style={styles.footerRow}>
          <TouchableOpacity style={[styles.footerPill, styles.footerSave]} onPress={handleSave}>
            <Text style={styles.footerText}>Save Match</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.footerPill, styles.footerEnd]}
            onPress={() => {
              setPlayers(PLAYER_NAMES.map((n) => ({ name: n, score: 0, history: [] })));
            }}
          >
            <Text style={styles.footerText}>End Match</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
