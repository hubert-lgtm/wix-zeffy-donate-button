# Handoff — Settings Panel Fix (MAR-20)

## Root cause

Wix Studio editor showed "Couldn't load actions due to an issue on our end" and the
right-hand settings panel never opened when clicking the widget.

`panel.js` referenced a `$panel` global (`$panel.onPropsChanged`, `$panel.set`,
`$panel.updateProps`). That API does not exist in the current Wix CLI app
runtime — it appears to be a hallucinated or legacy-Velo identifier. When the
editor loaded the panel module, it threw on the first reference, which broke
the editor's actions registry and produced the persistent banner.

Verified against the canonical templates at
`github.com/wix/cli-app-templates` (`chart-widget`, `inventory-countdown`).
The current API is **React + `@wix/editor`** with `widget.getProp(key)` and
`widget.setProp(key, value)` (string only). The widget API binds prop name
directly to the HTML attribute on the custom element.

## What changed

| File | Change |
|---|---|
| `src/site/widgets/custom-elements/zeffy-donation-widget/panel.tsx` | New — React functional component, `widget.getProp/setProp` API, Wix Design System UI. |
| `src/site/widgets/custom-elements/zeffy-donation-widget/panel.js` | Removed (legacy `$panel`-based file). |
| `src/site/widgets/custom-elements/zeffy-donation-widget/element.js` | `observedAttributes` switched from `data-*` prefixed names to canonical kebab-case (`display-mode`, `form-url`, …). The panel writes via `widget.setProp(name, value)` which sets the attribute by exact name. |
| `package.json` | Added `react`, `react-dom`, `@wix/editor`, `@wix/design-system`, `@wix/wix-ui-icons-common`, `typescript`, type defs. Mirrors `chart-widget` template. |
| `tsconfig.json` | New — extends `@wix/cli-app/tsconfig.app.json`. |
| `src/env.d.ts` | New — Wix CLI client types. |
| `test/qa.html` | Attribute names mirrored (`data-form-url` → `form-url`, etc.). Local test harness still passes 10/10 scenarios. |

## Verification done locally

- `npx tsc --noEmit` — clean
- `npx wix app build` — green (panel bundle ~590 KB, element bundle ~7 KB)
- `test/qa.html` — 10 PASS / 0 FAIL via local server + browser run (5/8/2026)

## Deploy steps (run on this machine)

```bash
cd ~/code/wix-zeffy-donate-button

# 1. Authenticate the CLI (one-time, opens browser device-login flow)
npx wix login

# 2. Push a new released version of the app
npx wix app release

# 3. (optional) Run dev with hot reload while iterating in the editor
npx wix app dev
```

After `wix app release`, in Wix Studio editor for **Dev Sitex 1616027752**:

1. Open the dev site editor.
2. The "Couldn't load actions" banner should be gone after a hard refresh.
3. The Zeffy Donation Widget should already be on the page (`autoAddToSite: true`).
4. Click the widget → the right-hand settings panel should open.
5. Paste a Zeffy form URL (e.g. `https://www.zeffy.com/en-US/donation-form/zeffy-demo-donation-form`) → widget renders the embedded form.
6. Toggle Display mode to "Button" → reconfigure button label/colors → widget renders a CTA button that opens a modal on click.

## Why I didn't deploy from this session

`wix login` requires an interactive TTY (raw stdin) and crashed on first attempt
in the non-interactive shell. Hector needs to run `wix login` once interactively
in his terminal — after that, every `wix app release` will work non-interactively.

## What still needs Hector's attention after deploy

From the original Linear ticket's "Remaining Work" list:

1. **Visual verification** of the panel + full flow in the Wix Studio editor (steps above).
2. **Decision on `autoAddToSite`** — currently `true` (widget auto-lands on the page after install). Keep for low-friction onboarding, or flip to `false` so the widget only appears when the user explicitly drags it from the Add panel.
3. **Complete App Market listing** — name, description, icon, screenshots in Dev Center (`dev.wix.com/apps/5b8486fa-5c74-41f1-a0cf-db8ab3cb7f1f`).
4. **Submit for review.**
