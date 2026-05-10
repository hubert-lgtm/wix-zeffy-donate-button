# Zeffy PTO Test Site (Wix)

Hubert's test site for the Zeffy Donation Widget Wix App, built from a Wix Communities template and personalized via Wix AI.

## Site identifiers

| Field | Value |
|---|---|
| Site name | My Site 1 (display: Zeffy Hubert Test PTO) |
| Meta site ID | `bc28cf8f-cf6e-488c-bba9-bc842e3ed385` |
| Editor doc ID | `75ba0a1f-d9c4-4ade-b7a4-f7b1521543ba` |
| Owner | hector592 / hector@zeffy.com |

## URLs

- **Published site:** https://hector592.wixsite.com/my-site-1
- **Editor:** https://hector592-my-site-1.editor.wix.com/html/editor/web/renderer/edit/75ba0a1f-d9c4-4ade-b7a4-f7b1521543ba?metaSiteId=bc28cf8f-cf6e-488c-bba9-bc842e3ed385
- **Dashboard:** https://manage.wix.com/dashboard/bc28cf8f-cf6e-488c-bba9-bc842e3ed385/home

## What this site is for

Demonstrating the Zeffy Donation Widget Wix App running on a polished, real-feeling nonprofit homepage — for the Wix App Market submission screenshots and as a reference install.

Built from a Wix nonprofit/community template, personalized with Wix's AI generator using a Lincoln Elementary PTO context prompt (501(c)(3), classroom funding, parent-volunteer-run, Zeffy for donations).

## How it relates to the dev site

The original `Dev Sitex 1616027752` (meta site ID `be6e118b-3e9b-4f51-bb83-507e9809e717`) is the **app's primary dev site** — auto-installed via `wix app release` for testing the widget in isolation.

This new site (`bc28cf8f-cf6e-488c-bba9-bc842e3ed385`) is a **separate user-built site** where the widget is installed manually to demonstrate it in a real designed context.

When deploying widget updates via `npx wix app release`, both sites receive the new version once they refresh.

## Widget placement on this site

The Zeffy Donation Widget should be placed in the donate section of the homepage. Recommended configuration:

- `display-mode`: `inline`
- `form-url`: `https://www.zeffy.com/en-US/donation-form/zeffy-demo-donation-form` (or a real Zeffy form once one is set up)
- `embed-width`: `100`
- `embed-width-unit`: `%`
- `embed-height`: `700`

Or button-modal mode in any header CTA:
- `display-mode`: `button`
- `button-text`: `Donate`
- `button-bg-color`: `#c44536` (brick red, matches template)
- `button-text-color`: `#ffffff`
