# Search demand for the plugins — are we advertising them, and is there a market

Two questions: whether Zeffy currently buys paid search against WordPress-plugin and Wix-App intent, and how much US search demand exists to push on.

- **Sources:** Google Ads API (live, account-level), SEMrush US database, `api.wordpress.org` plugins API
- **Ads window:** 2026-04-29 to 2026-07-28 (90 days). Note this is the nonprofit summer trough.
- **Last run:** 2026-07-28
- **Notion one-pager for leadership:** [Potentiel des plugins WordPress et Wix](https://app.notion.com/p/3ab5553ff365816e8388c6ccb7699c53) (section 5)
- **Companion doc:** [INSTALL-ANALYSIS.md](./INSTALL-ANALYSIS.md)

## Headline

We already buy plugin-intent traffic at near-parity cost, and we have nothing built to receive it. Paid search is close to tapped out: about 3,300 addressable US searches a month, against roughly 9 conversions a month we already capture. The real gap is the WordPress directory listing, where we sit at 1,000 active installs against GiveWP's 100,000, under a name that describes one feature.

## 1. Are we advertising the plugins?

Not deliberately, but the traffic is flowing. The distinction matters because a keyword-level pull understates it badly.

| View | Spend | Conv | CPA |
|---|---:|---:|---:|
| Plugin/app-intent **queries** actually served (161 queries) | 1,097.29 | 8.2 | **134.47** |
| All WordPress/Wix **queries** | 3,790.95 | 27.2 | 139.32 |
| All WordPress/Wix **keywords** | 3,674.31 | 24.0 | 153.10 |
| Account benchmark | 2,142,295.82 | 18,267 | **117.28** |

Plugin intent runs at **1.14x account CPA**, not the 1.7x a keyword-only cut implies. The keyword view misses it because broad match and DSA absorb these queries with no keyword containing the string.

Ten campaigns pick up WordPress/Wix queries, none of them by design:

| Campaign | Spend | Conv |
|---|---:|---:|
| Donation (US) | 2,446.64 | 16.0 |
| Discovery (US) - Broad match | 293.75 | 3.7 |
| Generic Core (UK) | 276.27 | 3.0 |
| Discovery (CA) - Broad match | 240.59 | 0 |
| Ticketing (US) - NEW | 180.17 | 2.0 |
| Auction (US) | 120.17 | 0 |
| Payment Processing/ACH (US) | 87.69 | 0 |
| Competitors (UK) - DSA | 59.58 | 2.5 |
| PayPal (US) | 27.27 | 0 |
| Competitors (US) - DSA | 20.12 | 0 |

The queries confirm multi-solution demand, not just donations: `wordpress membership plugin` (50.96), `wordpress event plugin` (28.50), `silent auction wordpress plugin` (26.62), `wordpress auction plugin` (26.44), `event ticketing plugin wordpress` (21.40), `wix donations app` (17.65, 286 impressions, 1 conv).

**No destination exists.** Every ad in the relevant ad groups points to `/feature/donation-hub`, `/home/donate-button`, or `/home/online-donation-platform-nonprofits`. `zeffy.com/wordpress`, `/wix`, and `/integrations` all return 404. The sitemap carries one generic `/home/integration`.

### Prior attempts

Dedicated CMS-platform campaigns have been built and paused twice:

| Campaign | Period | Spend | Conv | CPA |
|---|---|---:|---:|---:|
| Nonprofit CMS (US) | Feb–May 2025 | 20,288.80 | 90 | 225.43 |
| Feature test - Website builder (US) | Dec 2025–Jan 2026 | 10,345.19 | 28.9 | 357.96 |

`Nonprofit CMS (US)` had ad groups named `Wordpress (US)`, `Wix (US)`, `Squarespace (US)`, and did include plugin keywords on broad match. A lead-scoring variant, `Nonprofit CMS (US) - LS GEN LOW PERF CMS`, is REMOVED. Both ran against a generic landing page, so these are not clean reads on plugin intent, but they are the reason a third dedicated push is a hard sell.

## 2. US search demand

SEMrush and Google Keyword Planner agree on the head terms, which is the main reason to trust the sizing:

| Term | Planner | SEMrush |
|---|---:|---:|
| wordpress donation plugin | 260 | 210 |
| wix for nonprofits | 590 | 390 |
| wix donation app | 20 | 70 |
| wix donations | – | 110 |

Volumes below are **deduped by concept**. Both tools list rewordings as separate lines (`donation plugin wordpress`, `wordpress donate plugin`, `donate wordpress plugin`), and Google treats these as one query. Raw sums run roughly 2.5x higher and are misleading. `KD` is SEMrush keyword difficulty, 0–100.

### WordPress

| Topic | Searches/mo | CPC | KD | Nonprofit audience |
|---|---:|---|---:|---|
| **GiveWP** (competitor brand) | **1,000–1,480** | 3.61 | 32 | Yes, by definition |
| Donation plugin cluster | ~500 | 4–6 | 32 | Yes |
| `wordpress for nonprofits` | ~300 | 6.29 | **21** | Yes |
| Auction / raffle plugin | ~180 | 3–5 | 47 | Mostly |
| Membership plugin | ~1,500 | 6.06 | **70** | No |
| Event / ticketing plugin | ~300 | 5 | 50 | No |
| Competitor event brands | ~2,800 | 3–8 | 42+ | No |
| Form plugin | 390 | 2.64 | – | No |

### Wix

| Topic | Searches/mo | CPC | KD | Nonprofit audience |
|---|---:|---|---:|---|
| `wix for nonprofits`, pricing, discount | ~850 | 3.72–5.00 | 29–38 | Yes |
| Donation cluster incl. how-to questions | ~450 | 0–12 | **25** | Yes |
| Events / tickets | ~450 | 7.04 | 37 | Partly |
| Members area / membership app | ~160 | 3.27 | 38 | Partly |

**Addressable total: ~3,300/mo** (~2,000 WordPress, ~1,300 Wix).

Counting the broad plugin categories would give ~8,000/mo, and it would be wrong. `wordpress membership plugin` is 1,500 searches at KD 70, and the category leader is MemberPress (2,400/mo brand search) selling subscription sites to businesses. Volume without fit.

At observed rates this is roughly **8–11 conversions/mo** if we won most of it. We already take about 9/mo from these queries. Paid search has little headroom left.

### Brand search reveals the channel truth

| Term | Searches/mo |
|---|---:|
| zeffy | **49,500** |
| zeffy wordpress | 20 |
| donorbox wordpress | 20 |
| givebutter wordpress | 20 |
| bloomerang wordpress | 20 |

Of ~49,500 monthly Zeffy searches, 20 concern our WordPress integration. Every competitor sits at the same 20. Nobody discovers these plugins through Google, so this is not a Zeffy-specific failure. It is a statement about the channel.

## 3. Where discovery actually happens

`api.wordpress.org` publishes active installs. Ours:

| Plugin | Active installs |
|---|---:|
| GiveWP (`give`) | 100,000 |
| Donations via PayPal (`paypal-donations`) | 20,000 |
| Charitable (`charitable`) | 10,000 |
| Givebutter Widget (`givebutter`) | 7,000 |
| **Zeffy Donate Button** (`zeffy-donate-button`) | **1,000** |
| Seamless Donations (sunset) | 2,000 |
| WP Crowdfunding | 2,000 |

Listing state: v1.2.3, added 2025-12-15, last updated 2026-05-20, **2 ratings**, 0 support threads, tested to 7.0.2.

Two fixable problems:

1. The listing is named **"Zeffy Donate Button"**. Donation-only. It cannot surface in directory search for event ticketing, membership, or auction plugins, all of which the plugin supports and all of which we currently pay Google for.
2. **2 ratings.** Ratings feed directory ranking and this is the cheapest lever available.

No equivalent figure exists for Wix. The App Market publishes no install counts I could retrieve, so we have no competitive benchmark there.

## 4. Recommendation

1. **Rename and re-scope the WordPress listing** to cover events, memberships, and auctions. Then work ratings and `tested up to`.
2. **Build `/wordpress` and `/wix` pages.** We are already sending paid plugin traffic to a generic donation hub. This is a prerequisite for any clean read on plugin intent, not a growth bet.
3. **Bid GiveWP.** 1,000–1,480 searches/mo, 3.61 CPC, nonprofit-qualified by definition. Current spend on it is **7.49 per quarter**. Largest untapped pool in this doc.
4. **Take the Wix how-to cluster organically.** `accept donations on wix` is KD 0, several sibling queries carry 0 CPC because nobody bids. KD 25 across the cluster.
5. **Do not launch a dedicated plugin campaign.** Demand cannot make it statistically readable, and two paused precedents exist.
6. **Cut the accidental broad-match spend** on membership and event plugin queries. Wrong audience.

## Method notes and caveats

- **`conversions` is not a signup count.** It is a blend: 61.1 % `1025_Abra - Created Account - Lead Score - 12H`, 32.6 % `HubSpot - Opportunities`, 4.7 % `Google Ads - Created account`, 1.6 % Kadabra. Sums to 18,266.75 against 18,267 reported. Fractional values throughout are lead-score weighted. CPA comparisons hold; headcount readings do not.
- **The 117.28 benchmark is brand-diluted**, blended across the whole account. A cold prospecting campaign compared against it will always look expensive.
- **Seasonality is uncontrolled.** The 90-day window is the summer trough, while SEMrush and Planner volumes are 12-month averages. The two paused campaigns also ran in different seasons from each other.
- **Planner volume is a floor, not a ceiling.** We served 2,472 impressions/mo at 55–63 % impression share, implying ~4,190/mo eligible, which exceeds the entire deduped 2,880/mo Planner universe. Close variants pull in far more than either tool lists.
- **Budget-lost impression share is 0 % everywhere.** Every IS figure sums to exactly 100 % with rank loss (42.3 + 57.7, 62.7 + 37.3, 55.5 + 44.5). Headroom in `Donation Hub Website Builder (US)` is bought with bids or Ad Rank, not budget. Its average CPA is 127.49 but the marginal CPA is worse: the three head keywords run 108.88, the remaining tail 174.44.
- **Do not draw keyword-level conclusions from this dataset.** `wix for nonprofits` runs 87.65 CPA and its spelling twin `wix for non profits` runs 243.86. Same query, one space. Between-bucket CPA spread sits inside within-bucket noise.
- **Not examined: downstream value by acquisition path.** Zeffy monetizes tips on processed volume, so a signup is not a constant. If plugin-installed orgs carry higher retained volume, CPA parity is the wrong bar and recommendation 5 should be revisited. `FCT_ORGANIZATION` plus acquisition source would settle it. This is the largest open question in this doc.
