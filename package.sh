set -euo pipefail

NAME="chatgpt-auto-scroll"
MANIFEST="manifest.json"
ICONS_DIR="icons"

ver=$(grep -oP '"version"\s*:\s*"\K[^"]+' "$MANIFEST")
zipname="${NAME}-v${ver}.zip"

INCLUDE=( manifest.json content.js "$ICONS_DIR" README.md CHANGELOG.md LICENSE PRIVACY.md )

rm -f "$zipname"

if command -v zip >/dev/null 2>&1; then
  echo "Using zip to create $zipname"
  zip -r "$zipname" "${INCLUDE[@]}"
  echo "Created $zipname"
  exit 0
fi

if command -v powershell.exe >/dev/null 2>&1; then
  echo "zip not found; falling back to PowerShell Compress-Archive"
  ps_includes=$(printf "'%s'," "${INCLUDE[@]}")
  ps_includes="[string[]]@(${ps_includes%,})"
  powershell.exe -NoProfile -Command "
    \$ErrorActionPreference = 'Stop';
    \$zip = '${zipname}';
    if (Test-Path \$zip) { Remove-Item \$zip -Force }
    Compress-Archive -Path ${ps_includes} -DestinationPath \$zip -Force
  "
  echo "Created $zipname"
  exit 0
fi

echo "Error: neither 'zip' nor PowerShell's Compress-Archive is available."
echo "Install 'zip' (brew/apt/dnf) OR run 'npm run pack:ps' with the PowerShell script."
exit 1
