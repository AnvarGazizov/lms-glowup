---
name: open-and-test
description: Opens Chrome with the LMS Glowup extension loaded via the Chrome DevTools MCP and drives testing only through that MCP. Never uses Cursor’s built-in IDE browser. Use when the user wants to open Chrome for extension testing, validate behavior in a real browser, or follow a consistent MCP-based test flow after extension changes.
---

# Open and test (Chrome DevTools MCP + extension)

## Do not use the IDE browser

**Do not** use the **cursor-ide-browser** MCP (Simple Browser / embedded browser tools such as `browser_navigate`, `browser_snapshot`, etc.) for this workflow. It does not load this repo’s extension and is not a substitute for Chrome.

If Chrome DevTools MCP calls fail, **fix the Chrome DevTools MCP session** (see [Troubleshooting](#troubleshooting)) or use [manual Chrome](#optional-manual-chrome-with-the-same-unpacked-extension) with the unpacked extension—then keep using **`project-0-lms-glowup-chrome-devtools`** tools only for automated debugging.

## How Chrome is opened in this repo

There is no separate MCP tool whose only job is “launch Chrome.” **Chrome is started by `chrome-devtools-mcp` when the agent uses its browser tools** (for example `list_pages` or `new_page`), using the flags in [`.cursor/mcp.json`](../../mcp.json).

That configuration is the single source of truth for “Chrome + this extension”:

- **`--ignore-default-chrome-arg=--disable-extensions`** — the MCP’s default launch disables extensions; this turns that off so extensions can load.
- **`--chrome-arg=--load-extension=…/apps/extension/build/chrome-mv3-dev`** — loads the Plasmo dev build of this workspace’s extension.

`${workspaceFolder}` in `mcp.json` is expanded by Cursor to the repo root. Do not change the load path unless the extension output directory changes.

## Prerequisites (before using MCP)

1. **Extension dev build must exist** at `apps/extension/build/chrome-mv3-dev` (Plasmo `dev` output).

   From the repository root:

   ```bash
   pnpm dev:extension
   ```

   Leave this running while iterating so the unpacked extension stays built and hot-reloaded.

2. **Chrome DevTools MCP must be enabled** in Cursor so `chrome-devtools-mcp` runs with the args above. If the build folder was missing when the MCP server first started, **restart the Chrome DevTools MCP server** (or reload the window) after the first successful `pnpm dev:extension` so launches pick up a real `--load-extension` path.

## Consistent agent workflow

1. Confirm or start `pnpm dev:extension` so `apps/extension/build/chrome-mv3-dev` is present and up to date.
2. Read the schema under `mcps/project-0-lms-glowup-chrome-devtools/tools/` before calling tools (required for correct parameters).
3. **Open / attach to the session** by invoking a browser tool on server **`project-0-lms-glowup-chrome-devtools`**, for example:
   - `list_pages` — see open tabs (often enough to trigger launch if nothing is running).
   - `new_page` — open a tab with a `url` (use the target site or `about:blank` as needed).
4. Continue with navigation, snapshots, console, network, script evaluation, or other **Chrome DevTools MCP** tools as needed for the test. Stay on server **`project-0-lms-glowup-chrome-devtools`** until the task is done.

## Brightspace demo sign-in

When a protected page on **heimpel.brightspacedemo.com** redirects to D2L login (or you need to sign in before testing), use this **demo account** only for this environment:

| Field | Value |
|--------|--------|
| **Username** | `anvarg` |
| **Password** | `Testing` |

**Agent steps (Chrome DevTools MCP):**

1. `take_snapshot` on the login page and use the returned **uids** (they change each load).
2. `fill` the **Username** textbox uid with `anvarg`.
3. `fill` the **Password** textbox uid with `Testing`.
4. `click` the **Log In** button uid.
5. Wait for navigation (retry `take_snapshot` or use `wait_for` if needed), then continue testing on the target URL.

Example entry URL: `https://heimpel.brightspacedemo.com/d2l/home` or a specific course home path under `/d2l/home/…`.

## Optional: manual Chrome with the same unpacked extension

For debugging outside MCP, from the repo root after the dev build exists:

```bash
open -na "Google Chrome" --args \
  --load-extension="$(pwd)/apps/extension/build/chrome-mv3-dev"
```

This does not guarantee the same user profile as MCP (the MCP server uses its own Chrome profile under the cache path documented in the upstream `chrome-devtools-mcp` README). Use this only when you need a quick manual window.

## Troubleshooting

**Error: “The browser is already running for …/chrome-devtools-mcp/chrome-profile”** (often affects `list_pages`, `new_page`, and other tools):

- Several **Chrome DevTools MCP** server processes can be running at once (e.g. multiple Cursor windows or stale servers). They all default to the same **user data dir** (`~/.cache/chrome-devtools-mcp/chrome-profile`), so a second server cannot attach and tools fail.
- **Fix:** Disable or restart the **chrome-devtools** MCP in Cursor until only one instance is active, **Command+Q quit** the Chrome window that is using `--user-data-dir=…/chrome-devtools-mcp/chrome-profile`, then retry. As a last resort, restart Cursor.
- **Do not** switch to the IDE browser when this happens; extension behavior cannot be validated there.

**Still stuck after cleanup:** Confirm `pnpm dev:extension` is running and the load path in [`.cursor/mcp.json`](../../mcp.json) matches `apps/extension/build/chrome-mv3-dev`. Suggest the user restart the **chrome-devtools** MCP server from Cursor settings, then retry `list_pages` → `new_page` or `navigate_page`.

## Related

- For verifying a specific fix on Brightspace demo after login, see [.cursor/skills/verify-change/SKILL.md](../verify-change/SKILL.md).
