# Contributing to Notion Saver for X

Thanks for helping make friction-zero capture better. Please follow these guidelines to keep the project lean and maintainable.

## Principles
- Keep it lightweight: no new dependencies unless absolutely necessary.
- Respect performance: mutation observers should stay narrow and scoped to tweet detail contexts.
- Match style: plain JavaScript/HTML/CSS, MV3-friendly patterns, minimal globals.
- Privacy first: never add telemetry or third-party analytics.

## Getting started
1. Enable Developer Mode in Chrome at `chrome://extensions`.
2. Click **Load unpacked** and select the repo folder.
3. After changes to background/content scripts, click **Reload** on the extension card.

## Development workflow
- Content script: `src/content/` handles DOM detection, button inject, and toast.
- Background: `src/background/` handles Notion API calls and storage access.
- Popup/setup: `src/popup/` and `setup.html` manage configuration.
- Keep selectors resilient; prefer data attributes (`data-testid`) and defensive checks.

## Testing checklist
- Button appears only on tweet detail pages and not in feeds.
- Button is injected once per tweet view (no duplicates on SPA nav).
- Saving succeeds with valid token/database; toast shows success.
- Error toasts are informative: auth, schema, missing config.
- Missing media still saves without failure.

## Code style
- Use plain ES modules/JS; avoid transpilation.
- Keep comments minimal and purposeful.
- Match existing naming and casing (`Title` property for Notion).

## Submitting a PR
- Fill out the PR template.
- Describe user-impacting changes and any behavioral differences.
- Include reproduction steps for bugs and how you validated the fix.
- Avoid unrelated formatting churn.

## Reporting issues
- Use the issue templates.
- Include browser version, repro steps, expected vs actual, and console errors if available.

## Security & privacy
- Never log or persist the Notion token beyond `chrome.storage.local`.
- Do not add analytics, trackers, or remote logging.

