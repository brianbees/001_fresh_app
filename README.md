# Uni App - 2 (Clean Package)

This is the clean, verified package matching our **Master Index** and current plan.

## Quick Start

1. **Install deps (one-time if not yet done):**  
```
npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-get-random-values expo-sqlite
```

2. **Run (cache clear):**  
```
npx expo start -c
```

3. **Dev Version Label**  
Shows at the bottom of the **Player Selection** screen in dev, reading from `src/version.json`.

4. **Regenerate version meta (optional):**  
```
node scripts/gen-version-meta.js
```

## What’s Inside

- `App.js` — Stack (PlayerSelect → MainTabs) + tabs (Score | History | Settings), DB init.
- `src/screens/PlayerSelectionScreen.js` — 1–6 players entry + dev version label.
- `src/screens/ScoreScreen.js` — dynamic 1–6 teams, Reset All, Save Match → SQLite.
- `src/screens/HistoryScreen.js` — list/refresh/clear sessions.
- `src/screens/SettingsScreen.js` — placeholder.
- `src/components/DevVersionLabel.js` — reads `src/version.json`, only in dev.
- `src/storage/db.js` — modern async expo-sqlite with safe fallbacks.
- `src/version.json` — generated meta (v1.0.0, dev.4, timestamp, commit local).
- `scripts/gen-version-meta.js` — helper to regenerate `src/version.json`.
- `TREE.MD` — exact file manifest for QA.

Generated: 2025-09-01 06:32
