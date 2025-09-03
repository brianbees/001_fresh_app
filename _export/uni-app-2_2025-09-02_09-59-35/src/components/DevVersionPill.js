import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles';
import versionMeta from '../version-meta.json';
import Constants from 'expo-constants';

export default function DevVersionPill() {
  const show = Constants?.expoConfig?.extra?.SHOW_DEV_VERSION ?? true;
  if (!__DEV__ || !show) return null;
  const { devBuild, timestamp, commit } = versionMeta || {};
  return (
    <View style={styles.devPill} pointerEvents="none">
      <Text style={styles.devPillText}>
        v1.0.1 • dev.{devBuild || 1} • {timestamp || 'now'} • {commit || 'local'}
      </Text>
    </View>
  );
}
