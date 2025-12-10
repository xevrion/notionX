# Notion Saver for X

A friction-zero Chrome extension that lets you save tweets to Notion with a single tap. No modals, no decision fatigue—just flow.

## Features

- **One-tap capture**: Save button appears inline with native tweet actions
- **Zero friction**: No popups, no forms—just click and save
- **Graceful toast**: Subtle confirmation animation that fades away
- **Smart extraction**: Captures tweet text, author, URL, and first image
- **SPA-aware**: Works seamlessly with X's single-page navigation
- **Privacy-first**: No telemetry, no analytics, credentials stored locally

## Installation

### 1. Load the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select the `notion-saver-x` folder

### 2. Configure Notion Integration

1. Click the extension icon in Chrome toolbar
2. Enter your **Notion Integration Token** and **Database ID**
3. Click **"Save Configuration"**

The extension will verify your credentials and confirm when ready.

## Notion Setup

### Create Integration

1. Visit [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Name it: `X Tweet Saver`
4. Select capabilities: Read content + Insert content
5. Copy the integration token (starts with `secret_...`)

### Create Inbox Database

1. Create a new full-page database in Notion
2. Add these properties:
   - **Title** (default title property)
   - **URL** (URL type)
   - **Author** (Text type)
   - **Media** (URL type)
   - **Saved At** (Created time type)
3. Click **"•••"** → **"Add connections"** → Select your integration
4. Copy the database ID from the URL

**Database ID location:**  
`https://notion.so/workspace/DATABASE_ID?v=...`

## Usage

1. Open any tweet in its dedicated view (click to expand a tweet)
2. Look for the bookmark icon next to like/retweet/share
3. Click once
4. Toast appears: "Saved to Notion"
5. Check your inbox database—tweet is archived!

## Troubleshooting

### Button doesn't appear
- Ensure you're viewing a single tweet (not the feed)
- Refresh the page
- Check that the extension is enabled in `chrome://extensions/`

### Save fails with "Not configured"
- Open extension popup and enter credentials
- Verify token starts with `secret_`
- Verify database ID is 32 characters

### Save fails with "Database not found"
- Ensure database is shared with your integration
- Go to database → "•••" → "Add connections" → Select integration

### Save fails with "Schema mismatch"
- Check that your database has all required properties
- Property names must match exactly: Title, URL, Author, Media
- Property types must match: Title (title), URL (url), Author (text), Media (url)

## Architecture

```
notion-saver-x/
├── manifest.json          # Extension configuration
├── src/
│   ├── background/
│   │   └── background.js  # Notion API handler
│   ├── content/
│   │   ├── content.js     # DOM injection + capture
│   │   └── content.css    # X-styled UI
│   └── popup/
│       ├── popup.html     # Settings interface
│       ├── popup.js       # Config logic
│       └── popup.css      # Settings styling
└── assets/icons/          # Extension icons
```

## Privacy

- No data leaves your browser except Notion API calls
- No telemetry, no tracking, no analytics
- Credentials stored locally via Chrome's `storage.local`
- Source code is fully auditable

## Roadmap

- [ ] YouTube video capture
- [ ] Reddit post capture
- [ ] Custom database field mapping
- [ ] Keyboard shortcuts
- [ ] Bulk export

## License

MIT

## Contributing

Pull requests welcome! Please ensure:
- Code follows existing style
- No external dependencies added
- Performance impact remains negligible

---

**Made with focus and intention.**  
If this extension saves you time, consider starring the repo or sharing it with others who'd benefit from friction-zero capture.