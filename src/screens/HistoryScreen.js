import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../styles';
import { getSessions } from '../storage/db';

export default function HistoryScreen() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const rows = await getSessions();
      if (mounted) setItems(rows);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <SafeAreaView style={styles.appContainer} edges={['top','bottom']}>
      <View style={[styles.screen]}>
        <Text style={styles.h1}>History</Text>
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingVertical: 12 }}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.h2}>{new Date(item.created_at).toLocaleString()}</Text>
              {item?.data?.players?.map(p => (
                <Text key={p.id} style={styles.p}>• {p.name}: {p.score}</Text>
              ))}
            </View>
          )}
          ListEmptyComponent={<Text style={styles.p}>No history yet.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}
