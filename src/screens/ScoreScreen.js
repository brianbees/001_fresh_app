import React, { useMemo, useState, useCallback } from "react";
import { View, Text, Pressable, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "./ScoreScreen.styles";

let db = {};
try { db = require("../storage/db"); } catch (e) {}

export default function ScoreScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const playerCount = Math.max(1, Math.min(6, Number(route?.params?.players ?? 2)));
  const labels = useMemo(() => ["Player A","Player B","Player C","Player D","Player E","Player F"].slice(0, playerCount), [playerCount]);
  const [scores, setScores] = useState(() => Array(playerCount).fill(0));
  const [history, setHistory] = useState(() => Array(playerCount).fill(null).map(() => []));

  const pushHistory = useCallback((idx, prev) => { setHistory(h => { const next = h.slice(); next[idx] = [...next[idx], prev]; return next; }); }, []);
  const handleAdd = useCallback((idx, delta) => { setScores(prev => { const next = prev.slice(); pushHistory(idx, prev[idx]); next[idx] = prev[idx] + delta; return next; }); }, [pushHistory]);
  const handleUndo = useCallback((idx) => { setHistory(h => { const nextH = h.slice(); const stack = nextH[idx]; if (!stack.length) return h; const restored = stack.pop(); setScores(prev => { const nextS = prev.slice(); nextS[idx] = restored; return nextS; }); return nextH; }); }, []);
  const handleReset = useCallback((idx) => { setScores(prev => { const next = prev.slice(); pushHistory(idx, prev[idx]); next[idx] = 0; return next; }); }, [pushHistory]);

  const numColumns = playerCount===1?1:playerCount===2?2:playerCount===3?3:playerCount===4?2:3;
  const colStyleKey = numColumns===1?"col1":numColumns===2?"col2":"col3";
  const data = useMemo(() => labels.map((l,i)=>({key:String(i),i,label:l})), [labels]);

  const handleGoBack = () => { if (navigation.canGoBack?.()) navigation.goBack(); };
  const handleEndMatch = () => { Alert.alert("End Match","Match ended (no save)."); };
  const handleSaveMatch = async () => { try { const payload={timestamp:new Date().toISOString(),players:playerCount,scores:scores.slice()}; if (db.saveSession) await db.saveSession(payload); else if (db.saveMatch) await db.saveMatch(payload); else if (db.save) await db.save(payload); setScores(Array(playerCount).fill(0)); setHistory(Array(playerCount).fill(null).map(()=>[])); Alert.alert("Saved","Match saved."); } catch(e){ Alert.alert("Save failed","Check logs."); console.error(e);} };

  const renderItem = ({ item }) => { const idx=item.i; return (
    <View style={[styles.card, styles[colStyleKey]]}>
      <Text style={styles.playerLabel}>{item.label}</Text>
      <View style={styles.scoreBox}><Text style={styles.scoreText}>{scores[idx]}</Text></View>
      <View style={styles.row}>
        <Pressable onPress={()=>handleAdd(idx,10)} style={({pressed})=>[styles.btn,styles.btnPrimary,pressed&&styles.pressed]}><Text style={styles.btnText}>+10 Starter</Text></Pressable>
        <Pressable onPress={()=>handleAdd(idx,5)} style={({pressed})=>[styles.btn,styles.btnSecondary,pressed&&styles.pressed]}><Text style={styles.btnText}>+5 Bonus</Text></Pressable>
      </View>
      <View style={styles.row}>
        <Pressable onPress={()=>handleUndo(idx)} style={({pressed})=>[styles.btnSmall,styles.btnUndo,pressed&&styles.pressed]}><Text style={styles.btnTextSmall}>UNDO</Text></Pressable>
        <Pressable onPress={()=>handleReset(idx)} style={({pressed})=>[styles.btnSmall,styles.btnReset,pressed&&styles.pressed]}><Text style={styles.btnTextSmall}>Reset</Text></Pressable>
      </View>
    </View>); };

  return (
    <SafeAreaView style={styles.safe} edges={["top","left","right","bottom"]}>
      <View style={styles.redBand}><Text style={styles.redBandText}>University Challenge Scoring App</Text></View>
      <View style={styles.backBar}>
        <Pressable onPress={handleGoBack} style={({pressed})=>[styles.backBtn,pressed&&styles.pressed]}><Text style={styles.backBtnText}>← Back</Text></Pressable>
        <Text style={styles.backBarTitle}>Scoring</Text><View style={{width:64}}/>
      </View>
      <View style={styles.container}>
        <FlatList data={data} renderItem={renderItem} key={numColumns} numColumns={numColumns} columnWrapperStyle={numColumns>1?styles.wrapRow:undefined} contentContainerStyle={styles.listPad} showsVerticalScrollIndicator={false}/>
      </View>
      <View style={styles.bottomStripWrapper} pointerEvents="box-none">
        <SafeAreaView edges={["bottom"]} style={styles.bottomStripSafe}>
          <View style={styles.bottomStrip}>
            <Pressable onPress={handleSaveMatch} style={({pressed})=>[styles.actionBtn,styles.saveBtn,pressed&&styles.pressed]}><Text style={styles.actionBtnText}>Save Match</Text></Pressable>
            <Pressable onPress={handleEndMatch} style={({pressed})=>[styles.actionBtn,styles.endBtn,pressed&&styles.pressed]}><Text style={styles.actionBtnText}>End Match</Text></Pressable>
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  ); }
