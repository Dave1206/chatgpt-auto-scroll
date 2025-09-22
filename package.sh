set -euo pipefail

NAME="chatgpt-auto-scroll"
MANIFEST="manifest.json"
ICONS_DIR="icons"

ver=$(grep -oP '"version"\s*:\s*"\K[^"]+' "$MANIFEST")
zipname="${NAME}-v${ver}.zip"

INCLUDE=( "manifest.json" "content.js" "$ICONS_DIR" "README.md" "CHANGELOG.md" "LICENSE" "PRIVACY.md" )

rm -f "$zipname"

if command -v zip >/dev/null 2>&1; then
  echo "Using zip to create $zipname"
  zip -r "$zipname" "${INCLUDE[@]}"
  echo "Created $zipname"
  exit 0
fi

if command -v powershell.exe >/dev/null 2>&1; then
  echo "zip not found; falling back to PowerShell Compress-Archive"

  ps_array="@( "
  for p in "${INCLUDE[@]}"; do
    sp=${p//\'/\'\'}
    ps_array="${ps_array}'${sp}', "
  done
  ps_array="${ps_array%, } )"

  tmp_ps1="$(mktemp -t pack-XXXXXX.ps1 2>/dev/null || mktemp -t pack-XXXXXX)"
  cat > "$tmp_ps1" <<EOF
\$ErrorActionPreference = 'Stop'
\$zip = '${zipname}'
if (Test-Path \$zip) { Remove-Item \$zip -Force }
\$paths = ${ps_array}
Compress-Archive -Path \$paths -DestinationPath \$zip -Force
EOF

  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$tmp_ps1"
  rm -f "$tmp_ps1"

  echo "Created $zipname"
  exit 0
fi

echo "Error: neither 'zip' nor PowerShell is available."
echo "Install 'zip' (brew/apt/dnf) or run the native PowerShell packer: npm run pack:ps"
exit 1
