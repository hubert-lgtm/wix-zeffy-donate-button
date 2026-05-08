# Zeffy Donation Widget for Wix

Wix App Market app — a Custom Element Site Widget that lets nonprofits embed Zeffy donation forms on their Wix sites. Two display modes: inline iframe or button-to-popup modal.

- **App ID:** `5b8486fa-5c74-41f1-a0cf-db8ab3cb7f1f`
- **Dev site:** Dev Sitex 1616027752
- **Linear:** [MAR-20](https://linear.app/zeffy/issue/MAR-20)

## Live demos (mobile-friendly)

### Polished standalone demos (Vercel)
Deployed at **https://zeffy-donate-demo.vercel.app**

| URL | What it shows |
|---|---|
| `/pto` | Lincoln Elementary PTO — full hero + mission + programs + events + Zeffy form embedded inline |
| `/shelter` | Maple Ridge Animal Rescue — full hero + stats + featured pets + Zeffy form via button-modal |
| `/pto-embed` | PTO content sections (no hero, no widget) — designed for iframe embed inside Wix |
| `/shelter-embed` | Shelter content sections (no hero, no widget) — designed for iframe embed inside Wix |

The standalone demos load `widget.js` (the production `element.js`) and render `<zeffy-donation-widget>` for real with the canonical Zeffy demo donation form.

### Live Wix dev site
**https://dev-sitex-1616027752.wix-development-sites.org/**

This is the Wix App actually installed on a published Wix Studio Harmony site, with v1.1.0 of the Zeffy Donation Widget. The form renders, the panel opens, the install flow works.

## Repo layout

```
src/site/widgets/custom-elements/zeffy-donation-widget/
  element.js     vanilla custom element (the widget itself)
  element.json   widget metadata (size, presets, autoAddToSite)
  panel.tsx      React settings panel using @wix/editor SDK
  presets/       thumbnail
test/qa.html     headless-browser harness, 10 scenarios, 0 fails
public/          Vercel deploy artifacts (mirror of test/ + widget.js)
HANDOFF.md       fix narrative + remaining work for App Market submission
```

## Local development

```bash
npm install            # or bun install
npx wix login          # one-time, browser device-login
npx wix app dev        # local dev with editor tunnel
npx wix app build      # production bundle
npx wix app release    # publish to dev site
```

## QA harness

```bash
python3 -m http.server 8744 --bind 127.0.0.1
# open http://127.0.0.1:8744/test/qa.html
```

10 scenarios covering: onboarding state, error states (non-Zeffy URL, malformed URL), inline render, URL transform across locales, button mode, modal lifecycle, dimension overrides, color customization. Should always show 10 PASS / 0 FAIL.

## Redeploy the demo site

```bash
cd public
vercel deploy --prod
```

## Settings panel — current behavior

Settings panel uses the `@wix/editor` SDK with `widget.getProp` / `widget.setProp` and the Wix Design System. Fields: display mode, Zeffy form URL (with sign-up link), embed width/unit/height (inline), button label/colors (button mode).

See `HANDOFF.md` for the root-cause and fix narrative on the previous "Couldn't load actions" issue.
