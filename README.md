# 001_fresh_app

University Challenge Scoring App (Uni App – 2)  
Fresh baseline build — React Native + Expo

---

## Project Overview
This app is a clean rebuild of the University Challenge scoring system.  
It’s built with React Native (Expo), using a persistent SQLite database and a responsive layout that works across phones and tablets.

### Core Features
- Player Selection (1–6 players)  
- Score tab with adaptive team grid  
- Undo & Reset per player  
- Save Match (stores sessions in local DB)  
- History tab with past results  
- Settings tab (app options, contact/legal)  
- Gradient background + accent colours  
- Safe-area aware (phones & tablets)  

---

## Setup Instructions

Clone the repository:

git clone https://github.com/brianbees/001_fresh_app.git  
cd 001_fresh_app  

Install dependencies:

npm install  
npx expo install  

Run the app:

npx expo start  

---

## Git Workflow

### Create a checkpoint:

git add -A  
git commit -m "Describe your change"  
git tag v0.1.X-description-YYYY-MM-DD  
git push && git push --tags  

### Roll back to a checkpoint:

git checkout -b restore/<tagname> <tagname>  
npm ci  
npx expo install  
npx expo start -c  

---

## Project Structure

- App.js — root navigation (PlayerSelect -> MainTabs)  
- src/ — screens, components, storage  
- assets/ — images, sounds  
- scripts/ — helper scripts (e.g. version metadata)  
- TREE.MD — manifest of file structure  

---

## Tags / Checkpoints

- v0.1.0-001_fresh_app-2025-09-01 — Initial baseline commit  
- v0.1.1-gitignore-update-2025-09-01 — Updated .gitignore rules  

---

## License
Currently private use only.
