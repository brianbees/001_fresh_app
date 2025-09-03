# Uni App - 2 Export

**Created:** 2025-09-02_09-59-35
**Package:** uni-app-2_2025-09-02_09-59-35.zip

## What's inside
- App entry & styles: \App.js\, \styles.js\
- Configs: \package.json\, \pp.json\, \abel.config.js\, \.gitignore\
- Source: \/src\ (screens, components, storage)
- Manifest: \TREE.MD\ (full tree)

## Install & run (clean machine)
\\\ash
npm install
npx expo start
\\\

> If you see a "layout probe" label on the Score screen, toggle the flag inside \src/screens/ScoreScreen.js\:
> \const PROBE_ENABLED = false;\

## Notes
- \
ode_modules/\, \_backup/\, \dist/\, \.expo/\ etc. are intentionally **excluded**.
- Player selection passes \{ playerCount: N }\ to the Score tab.
- Score screen uses a 3-layer layout (absolute header/content/footer); footer is flush with the tab bar.

## File tree
See **TREE.MD** for a browsable listing.
