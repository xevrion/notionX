# Notion Saver for X

A friction-zero Chrome extension that lets you save tweets to Notion with a single tap. No modals, no decision fatigue—just flow.

## What it does

- **Inline capture**: A native-looking save button appears inline with tweet actions on single-tweet pages.
- **Smart extraction**: Captures tweet title (first 100 chars), author handle, URL, and first image when available.
- **Fast feedback**: Subtle toast confirms success or shows a retry hint.
- **SPA-aware**: Re-injects on X/Twitter soft navigations to avoid duplicates.
- **Privacy-first**: No telemetry; Notion credentials stay in `chrome.storage.local`.

## Quick start

1) Go to `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select this folder.  
2) Click the extension icon → **Open Full Setup** (or open `setup.html` directly).  
3) Paste your Notion **Integration Token** (`secret_` or `ntn_`) and **Database ID**, then click **Connect to Notion** to validate + save.  
4) Open a tweet in its dedicated view; click the bookmark-style button beside the tweet actions; watch for the “Saved to Notion” toast.

## Configure after “Load unpacked”

- Open the popup and use **Open Full Setup** (full-page) for easiest validation.  
- The setup page pings Notion (`GET /v1/databases/{id}`) to verify your token and database before saving to `chrome.storage.local`.  
- Token must start with `secret_` or `ntn_`.  
- Database must have properties: `Title` (title), `URL` (url), `Author` (text), `Media` (url); `Saved At` (datetime) is optional but recommended.  
- Once saved, configuration is reused automatically for all tweets; you can reopen the popup anytime to update values.

## Notion setup (required)

- Create an integration at [notion.so/my-integrations](https://www.notion.so/my-integrations) with **Read content + Insert content**. Copy the token (`secret_...` or `ntn_...`).
- Create a database (full page) and ensure these properties exist exactly:
  - `Title` (title) — default Notion title property name must stay capitalized.
  - `URL` (url)
  - `Author` (text)
  - `Media` (url)
  - `Saved At` (datetime)
- Share the database with your integration (••• → Add connections).
- Copy the database ID from the URL: `https://notion.so/workspace/DATABASE_ID?v=...`

## Usage notes

- The button only appears on tweet detail pages (`/username/status/{id}`).
- If you navigate via SPA, the button re-injects automatically; duplicates are prevented.
- Missing media is fine—the save will proceed without an image.

## Troubleshooting

- **Button missing**: Ensure you’re on a single tweet, not the feed; refresh once; verify the extension is enabled.
- **“Not configured”**: Open the popup/setup page and re-save token + database ID.
- **“Database not found” (404)**: Share the DB with the integration; confirm the ID is correct.
- **“Schema mismatch” (400)**: Ensure property names/types match exactly: `Title` (title), `URL` (url), `Author` (text), `Media` (url).
- **Auth issues (401)**: Token must start with `secret_` or `ntn_`.

## Development

- No build step required; pure MV3 JS/CSS/HTML.
- Load via `chrome://extensions` → **Load unpacked** pointing to this repo.
- After changes to background/content scripts, click **Reload** in extensions page.
- Keep new deps out; prioritize lightweight DOM queries and minimal observers.

## Privacy

- Only calls made are to the Notion API with your provided token.
- No analytics or telemetry.
- Credentials are stored locally via `chrome.storage.local`.

## Roadmap

- YouTube capture
- Reddit capture
- Custom database field mapping
- Keyboard shortcuts
- Bulk export

## Contributing

See `CONTRIBUTING.md` for guidelines and how to submit issues/PRs.

---

**Made with focus and intention.** If this extension saves you time, consider starring or sharing it.
