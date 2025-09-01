const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Generate build metadata
const devBuild = process.env.DEV_BUILD || Date.now();
const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
let commit = "local";

try {
  commit = execSync("git rev-parse --short HEAD").toString().trim();
} catch (err) {
  // fallback remains 'local'
}

const meta = { devBuild, timestamp, commit };

// Save to version.json
const outPath = path.join(__dirname, "..", "version.json");
fs.writeFileSync(outPath, JSON.stringify(meta, null, 2));

console.log(`[gen-version-meta] devBuild=${devBuild} timestamp="${timestamp}" commit=${commit}`);