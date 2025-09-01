 // scripts/gen-version-meta.js
 // Generates version.json with build metadata.
 //
 // Improvements in this version:
 // 1) Normalizes devBuild to a consistent Number (env → parsed int; fallback → prior + 1 or 1)
 // 2) Uses execSync with explicit UTF-8 encoding for git output
 // 3) Ensures a trailing newline at EOF

 const fs = require("fs");
 const path = require("path");
 const { execSync } = require("child_process");

 const ROOT = process.cwd();
 const VERSION_PATH = path.join(ROOT, "version.json");

 function readJSONIfExists(file) {
   try {
     if (fs.existsSync(file)) {
       const raw = fs.readFileSync(file, "utf8");
       return JSON.parse(raw);
     }
   } catch {
     // ignore parse / read errors
   }
   return null;
 }

 function getShortCommitOrLocal() {
   try {
     const out = execSync("git rev-parse --short HEAD", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
     const sha = (out || "").trim();
     return sha || "local";
   } catch {
     return "local";
   }
 }

 function formatTimestampYYMMDD_HHMM(date = new Date()) {
   const pad = (n) => String(n).padStart(2, "0");
   const yyyy = date.getFullYear();
   const mm = pad(date.getMonth() + 1);
   const dd = pad(date.getDate());
   const HH = pad(date.getHours());
   const MM = pad(date.getMinutes());
   return `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
 }

 const prior = readJSONIfExists(VERSION_PATH);

 const envDevBuildRaw = process.env.DEV_BUILD;
 const envDevBuildNum = Number(envDevBuildRaw);
 let devBuild;

 if (Number.isFinite(envDevBuildNum)) {
   devBuild = envDevBuildNum;
 } else if (prior && Number.isFinite(Number(prior.devBuild))) {
   devBuild = Number(prior.devBuild) + 1;
 } else {
   devBuild = 1;
 }

 const commit = getShortCommitOrLocal();
 const timestamp = formatTimestampYYMMDD_HHMM(new Date());

 const version = { devBuild, commit, timestamp };

 fs.writeFileSync(VERSION_PATH, JSON.stringify(version, null, 2) + "\n", "utf8");

 console.log(`[gen-version-meta] devBuild=${devBuild} timestamp="${timestamp}" commit=${commit}`);
