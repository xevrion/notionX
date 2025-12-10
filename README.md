# Notion Saver for X

A friction-zero Chrome extension that lets you save tweets to Notion with a single tap. No modals, no decision fatigue—just flow.

## What it does (at a glance)

- Inline save button on tweets (feed and detail pages), styled like X actions.
- Captures title (first 100 chars), author handle, URL, and first image if present.
- Subtle toast feedback; lightweight DOM observers; credentials stay local.

## Install & configure

1) **Get the code**  
   - Clone: `git clone https://github.com/<your-org-or-user>/notionX.git`  
   - Or download the ZIP and unzip.
2) **Load unpacked**  
   - Open `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select the folder.
3) **Prepare Notion**  
   - Create integration: [notion.so/my-integrations](https://www.notion.so/my-integrations) with **Read content + Insert content**. Token must start with `secret_` or `ntn_`.  
   - Create a database with properties: `Title` (title), `URL` (url), `Author` (text), `Media` (url). `Saved At` (datetime) optional.  
   - Share the database with the integration (••• → Add connections) and copy the database ID (`https://notion.so/workspace/DATABASE_ID?v=...`).
4) **Configure**  
   - Click the extension icon → **Open Full Setup** (or open `setup.html` directly).  
   - Paste token + database ID → **Connect to Notion**. The popup no longer accepts credentials; configuration lives in the full-page setup.
5) **Use it**  
   - Open X/Twitter (feed or tweet detail).  
   - Click the Notion icon next to tweet actions. Toast shows success/error. Missing images are fine.

## Troubleshooting

- Button missing: ensure extension enabled; refresh once.  
- Not configured / auth: re-run setup; token must start `secret_` or `ntn_`.  
- 404 database: share DB with integration; verify ID.  
- Schema mismatch (400): property names/types must match exactly (`Title`, `URL`, `Author`, `Media`).  

## Development

- No build step; MV3 JS/CSS/HTML only.  
- After edits to background/content, click **Reload** on the extension in `chrome://extensions`.  
- Prefer minimal observers and lightweight selectors.

## Privacy

- Only calls are to Notion with your token.  
- No telemetry/analytics; credentials live in `chrome.storage.local`.

## Contributing

See `CONTRIBUTING.md` for guidelines and templates.

---
**Made with focus and intention.** If this saves you time, consider starring or sharing.
