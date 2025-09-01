const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, '..', 'src', 'version-meta.json');
const devBuild = (process.env.DEV_BUILD && !isNaN(+process.env.DEV_BUILD)) ? +process.env.DEV_BUILD : 1;
const timestamp = new Date().toISOString().slice(0,16).replace('T',' ');
const commit = process.env.GIT_COMMIT_SHORT || 'local';

const meta = { devBuild, timestamp, commit };
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(meta, null, 2));
console.log(`[gen-version-meta] devBuild={devBuild} timestamp="{timestamp}" commit={commit}`);
