#!/usr/bin/env bash
set -euo pipefail

ver=$(grep -oP '"version"\s*:\s*"\K[^"]+' manifest.json)
name="chatgpt-auto-scroll"
zipname="${name}-v${ver}.zip"

rm -f "$zipname"
zip -r "$zipname" \
  manifest.json \
  content.js \
  icons \
  README.md \
  CHANGELOG.md \
  LICENSE \
  PRIVACY.md

echo "Created $zipname"
