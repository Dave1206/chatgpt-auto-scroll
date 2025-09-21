set -euo pipefail

NAME="chatgpt-auto-scroll"
MANIFEST="manifest.json"
ICONS_DIR="icons"

ver=$(grep -oP '"version"\s*:\s*"\K[^"]+' "$MANIFEST")
zipname="${NAME}-v${ver}.zip"
rm -f "$zipname"

zip -r "$zipname" \
  manifest.json \
  content.js \
  "$ICONS_DIR" \
  README.md \
  CHANGELOG.md \
  LICENSE \
  PRIVACY.md

echo "Created $zipname"
