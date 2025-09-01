import React from 'react';
import { View, Text, Linking, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../styles';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.appContainer} edges={['top','bottom']}>
      <View style={[styles.screen]}>
        <Text style={styles.h1}>Settings</Text>
        <Text style={[styles.p, { marginTop: 8 }]}>
          Send feedback or suggestions so we can improve the app.
        </Text>
        <Pressable onPress={() => Linking.openURL('mailto:developer@example.com?subject=Uni%20App%202%20Feedback')} style={[styles.pillButton, { marginTop: 12 }]}>
          <Text style={styles.pillText}>Email Feedback</Text>
        </Pressable>

        <View style={{ height: 20 }} />

        <Text style={styles.h2}>Legal</Text>
        <Text style={styles.p}>© 2025 Uni App – 2. All rights reserved.</Text>
      </View>
    </SafeAreaView>
  );
}
