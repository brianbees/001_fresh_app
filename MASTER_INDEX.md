# Uni App – 2 Master Index

## UI & Design Rules
- Flat, solid background (no gradients) across all screens.
- All content respects device safe areas (top, bottom, sides).
- Bright gradient theme previously used is retired; current rule is flat background + accent yellow `#F9DABA`.
- Accent yellow applies to player/team bars and Save Match pill.
- Floating layout: 
  - Header and tabs pinned top.
  - Score columns in middle (with space between header/footer).
  - Save Match pill pinned bottom (absolute, with safe-area padding).

## Screens & Features
- Player Selection: buttons for 1–6 players.
- Score Screen: 2×2 grid (up to 4 players), adaptive to number of players.
- Undo and Reset buttons implemented.
- Save Match stores results to local SQLite DB.
- History tab: lists saved sessions with timestamp.
- Settings tab: app options, contact/legal info.

## Dev Version Label
- Shows on Player Selection screen during development.
- Includes app version (vX.Y.Z), dev build number, timestamp, short commit SHA or “local”.
- Updates automatically via pre-commit/pre-start script.
- Toggle off for production (`SHOW_DEV_VERSION=false`).

## Delivery QA Checklist v1.0
- Root structure must remain flat (no stray `screens/` or `theme/` folders at top level).
- Every release must include a `TREE.MD` manifest and `README` self-check.
- Versioned ZIP naming required (e.g. `uni-app-2_YYYY-MM-DD_HH-mm-ss.zip`).
- Acceptance rule: reject packages with extra/missing files.
- Safe areas tested on both phone and tablet (UI must not overlap system bars).
- Background must be flat (no gradient cruft).
- Dev version label included in dev builds, excluded in production builds.

## Cleanup / Pending Tasks
- Remove leftover gradient imports/dependencies once confirmed unused.
- Review debug/console logs — gate or remove under `__DEV__` before release.
- Future: remove verbose error JSONs for tighter security.

_Last updated: 2025-09-02_
