import fs from 'fs';

const MANIFEST = 'manifest.json';
const BUMP = (process.argv[2] || 'patch').toLowerCase();

if (!fs.existsSync(MANIFEST)) {
  console.error(`Error: ${MANIFEST} not found.`);
  process.exit(1);
}

const raw = fs.readFileSync(MANIFEST, 'utf8');
const manifest = JSON.parse(raw);

const current = manifest.version;
if (!/^\d+\.\d+\.\d+$/.test(current)) {
  console.error(`Error: manifest.json version must be MAJOR.MINOR.PATCH. Found: ${current}`);
  process.exit(1);
}

let [major, minor, patch] = current.split('.').map(Number);

switch (BUMP) {
  case 'major': major++; minor = 0; patch = 0; break;
  case 'minor': minor++; patch = 0; break;
  case 'patch': patch++; break;
  case 'none':  break;
  default:
    console.error(`Unknown bump type: ${BUMP} (use major|minor|patch|none)`);
    process.exit(1);
}

const newver = (BUMP === 'none') ? current : `${major}.${minor}.${patch}`;
manifest.version = newver;

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

console.log(`Version: ${current} -> ${newver}`);
