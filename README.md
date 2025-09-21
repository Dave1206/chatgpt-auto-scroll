# ChatGPT Auto-Scroll Extension

A lightweight, open-source Chrome extension that keeps your ChatGPT conversation automatically scrolled to the bottom, **but only if you were already at the bottom**. If you scroll up, it respects your position and stops pinning until you return to the bottom.

---

## Features
- Tiny toggle button (`AS`) in the corner, out of the way.
- Remembers your preference (on/off) across sessions.
- Only scrolls if you’re already near the bottom — no forced lock.
- Zero tracking, zero ads, zero extra bloat.
- Open source under the [MIT License](LICENSE).

---

## Installation

### From the Chrome Web Store (Recommended)
➡️ [Chrome Web Store Link](https://chrome.google.com/webstore/detail/chatgpt-auto-scroll/EXTENSION_ID)  
*(link will work once published)*

### Manual Installation (Developer mode)
1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer Mode** (top right).
4. Click **Load unpacked** and select the folder.
5. The `AS` toggle will now appear when you visit ChatGPT.

---

## 🛡️ Privacy
- This extension **does not collect or share any data**.
- It only stores your toggle preference (`enabled`/`disabled`) using Chrome’s `storage` API.
- For details, see [PRIVACY.md](PRIVACY.md).

---

## Screenshots
*(Add screenshots or a short GIF demo here once ready)*

---

## For Contributors

We welcome pull requests and suggestions!  

### Local Development
1. Clone the repo:
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/chatgpt-auto-scroll.git
   cd chatgpt-auto-scroll
   ```
2. Open Chrome → `chrome://extensions` → **Load unpacked** → select the repo folder.
3. Make your changes in `content.js` or `manifest.json`.
4. Reload the extension in `chrome://extensions` to test.

---

### Packaging for Release

Use the included script to create a versioned ZIP for Chrome Web Store upload.

#### Option A — npm script (recommended)
Add a minimal `package.json` to the project root:

```json
{
  "name": "chatgpt-auto-scroll",
  "private": true,
  "scripts": {
    "pack": "bash package.sh"
  }
}
```

Then run:
```bash
npm run pack
```

This reads the version from `manifest.json` and produces `chatgpt-auto-scroll-vX.Y.Z.zip` in the project root.

> Note: You need a Bash shell available (macOS/Linux by default; on Windows use Git Bash or WSL).

#### Option B — run the shell script directly
```bash
chmod +x package.sh
./package.sh
```

#### Option C — Windows PowerShell alternative
If you don’t have Bash on Windows, you can use `package.ps1`:

```powershell
$manifest = Get-Content -Raw -Path manifest.json | ConvertFrom-Json
$ver = $manifest.version
$zip = "chatgpt-auto-scroll-v$ver.zip"
if (Test-Path $zip) { Remove-Item $zip }
Compress-Archive -Path manifest.json, content.js, icons, README.md, CHANGELOG.md, LICENSE, PRIVACY.md -DestinationPath $zip
Write-Host "Created $zip"
```

Run it with:
```powershell
pwsh -File .\package.ps1
```

**Tips**
- Keep `package.sh`/`package.ps1` in the repo, but they are **not** included in the ZIP produced by `package.sh`.
- Always bump `"version"` in `manifest.json` before packaging, or the Chrome Web Store will reject the update.

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).
