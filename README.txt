Uni App – 2 (v1.0.1 • Guarded + Safe Areas + BACK BUTTON)
Built: 2025-09-01 12:39

WHAT CHANGED
------------
• Restored **Stack header** on the tabbed screens (per Master Index):
    Back  →  Match title  →  Settings button
• Back button now returns to Player Selection (Stack back action).
• Tabs remain: Score | History | Settings (no duplicate headers).
• Safe-area handling unchanged and verified.

HOW THE HEADER WORKS
--------------------
• The header belongs to the **Stack** screen that wraps the Tabs.
• Back button is rendered by the Stack (no custom code required).
• The "Settings" button simply navigates to the Settings tab.

SAFE-SCREEN COMPLIANCE
----------------------
1) Root <SafeAreaProvider> wraps entire app.
2) <SafeAreaView> with edges per screen.
3) Floating Save button uses useSafeAreaInsets().bottom.
4) No absolute element ignores insets.
5) No gradient background (plain per spec).

INSTALL / RUN (PowerShell)
--------------------------
# Replace your app with this package
# Install deps only if you see 'module not found' errors:
npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-get-random-values expo-sqlite

npm start

EXPECTED QUICK TEST
-------------------
- PlayerSelection shows 1–6 buttons.
- Choose 4 → Tabs view opens with a **header** showing Back • Match • Settings.
- Tapping Back returns to Player Selection.
- Press Settings in header switches to Settings tab.
- Save Match pill sits above Android system bar.

FILE TREE
---------
/
├─ App.js
├─ index.js
├─ styles.js
├─ package.json
├─ app.json
├─ babel.config.js
├─ README.txt
├─ scripts/
│  └─ gen-version-meta.js
└─ src/
   ├─ version-meta.json
   ├─ components/
   │  └─ DevVersionPill.js
   ├─ screens/
   │  ├─ PlayerSelectionScreen.js
   │  ├─ ScoreScreen.js
   │  ├─ HistoryScreen.js
   │  └─ SettingsScreen.js
   └─ storage/
      └─ db.js
