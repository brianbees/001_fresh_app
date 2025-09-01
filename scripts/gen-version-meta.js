// scripts/gen-version-meta.js
// Generates src/version.json with dev build metadata.
const fs = require("fs");
const path = require("path");

function now() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const meta = {
  version: "1.0.0",
  devBuild: process.env.DEV_BUILD || "dev.local",
  timestamp: now(),
  commit: process.env.GIT_COMMIT || "local",
};

const out = path.join(__dirname, "..", "src", "version.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(meta, null, 2));
console.log("[gen-version-meta] wrote", out, meta);
