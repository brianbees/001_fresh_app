# Uni App – 2 Export

**Created:** 2025-09-02_09-16-33  
**Package:** uni-app-2_2025-09-02_09-16-33.zip

## What’s inside
- App entry & styles: \\App.js\\, \\styles.js\\
- Configs: \\package.json\\, \\app.json\\, \\babel.config.js\\, \\.gitignore\\
- Source: \\src\\ (screens, components, storage)
- Manifest: \\TREE.MD\\ (full tree)

## Install & run (clean machine)
\\\ash
npm install
npm start
\\\

> If you see a “layout probe” label on the Score screen, it means a dev build. (We keep probes off by default now.)

## Notes
- \\node_modules\\, \\_backup\\, \\dist\\, \\.expo\\ etc. are intentionally **excluded**.
- Player selection passes { playerCount: N } to the Score tab.
- **Safe areas:** All screens use SafeAreaView; the footer **respects the bottom safe-area** and sits above the tab bar.

## File tree
See **TREE.MD** for a browsable listing.
