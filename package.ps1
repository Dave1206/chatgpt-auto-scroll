Param(
  [string]$Name = "chatgpt-auto-scroll",
  [string]$Manifest = "manifest.json",
  [string]$IconsDir = "icons"
)

$manifestObj = Get-Content -Raw -Path $Manifest | ConvertFrom-Json
$ver = $manifestObj.version
$zip = "$Name-v$ver.zip"

if (Test-Path $zip) { Remove-Item $zip }

# Build the list of files to include
$paths = @(
  "manifest.json",
  "content.js",
  $IconsDir,
  "README.md",
  "CHANGELOG.md",
  "LICENSE",
  "PRIVACY.md"
)

Compress-Archive -Path $paths -DestinationPath $zip -Force
Write-Host "Created $zip"
