# Privacy Policy — ChatGPT Auto-Scroll

_Last updated: September 2025_

This extension is designed with privacy in mind. It does not collect, transmit, or share any personal information.

## What the extension does
- Displays a small toggle button (`AS`) on ChatGPT pages.
- When enabled, the extension automatically scrolls the conversation to the bottom **only if you were already at the bottom** before new content appeared.
- If you scroll up, the extension respects your position and does not force you back down.

## Data storage
- The extension uses Chrome’s `storage` API to remember whether auto-scroll is **enabled or disabled**.
- This setting is synced across Chrome if you are signed into a Google account (depending on your Chrome sync settings).
- No other data is stored.

## Data collection
- **No data is collected.**
- The extension does not log, track, or send any information outside your browser.
- There are no analytics, ads, or remote servers involved.

## Permissions
The extension requests:
- **`storage`** — to save your toggle preference.
- **Content script access** to `chat.openai.com` and `chatgpt.com` — required to add the toggle and perform scrolling on ChatGPT’s website.

These are the minimum permissions required for functionality.

## Contact
For questions, issues, or contributions, please visit the project’s [GitHub repository](https://github.com/YOUR_GITHUB_USERNAME/chatgpt-auto-scroll).
