# Install cohort analysis — who actually installs this app

What the 178 Wix App Market installs are: net-new demand, product adoption, or reactivation.

- **Source:** Wix App Market export `App Installations (1).csv`, 178 rows, installs from 2026-05-08 to 2026-07-28
- **Joined to:** `ANALYTICS.FCT_ORGANIZATION` and `ANALYTICS.FCT_USER` (Snowflake via Metabase, `database_id: 2`)
- **Last run:** 2026-07-28
- **Notion one-pager for leadership:** [Potentiel des plugins WordPress et Wix](https://app.notion.com/p/3ab5553ff365816e8388c6ccb7699c53)

## Headline

Of the 133 traceable installs, the split between net-new demand and existing Zeffy orgs is close to 50/50. The app is doing acquisition and product adoption in roughly equal measure. It is not yet demonstrated as a win-back lever.

The Wix channel is invisible in Zeffy attribution: there is no `wix` value anywhere in `FCT_ORGANIZATION.ACQUISITION_SOURCE` across the whole warehouse, and 11 of the 34 app-led signups are currently booked as paid.

## Coverage

Matching is only as good as the keys Wix hands over. The export gives a business email and a site URL, and both are frequently missing.

| Match path | Installs |
|---|---:|
| Matched on normalized website domain | 71 |
| Matched on owner email (`FCT_USER.EMAIL`) | 32 |
| Had a real domain or email, no Zeffy org found | 30 |
| Blank Site URL **and** no email — untraceable | 42 |
| Internal / dev installs (`hector592.*`, `dev-sitex-*`) | 3 |
| **Total** | **178** |

**Traceable base: 133** (178 minus 42 untraceable minus 3 internal). All percentages below use 133.

Two structural blind spots:

- 22 installs sit on a `*.wixsite.com` or `*.wixstudio.com` subdomain. **Not one of those subdomains appears in `FCT_ORGANIZATION.DOMAIN`**, so free-tier Wix sites cannot be domain-matched at all.
- 8 rows carry Wix's placeholder `@mysite.com` email. Discarded before matching.

## Net-new demand vs existing orgs

| | Installs | % of 133 |
|---|---:|---:|
| **Net-new demand** | **64** | **48 %** |
| created their Zeffy account the same day they installed | 34 | 26 % |
| installed with no Zeffy account at all | 30 | 23 % |
| **Existing Zeffy orgs** | **69** | **52 %** |
| installed **before** collecting a first payment | 12 | 9 % |
| installed **after** already collecting payments | 32 | 24 % |
| installed, **not yet** collecting | 25 | 19 % |

## Existing orgs, split on the first payment

For existing orgs the useful reference point is `DT_FIRST_PAYMENT`, not `DT_ORG_CREATED`. It tells you whether the app arrived before or after the org started collecting money.

| Existing orgs | Orgs | Lifetime GMV (USD) | Closed won | Median timing |
|---|---:|---:|---:|---|
| 1. Install on or before first payment | 12 | 7,886 | 6 | first payment 2 d after install |
| 2. Install after first payment | 32 | 1,312,089 | 28 | install 20 months after first payment |
| 3. Not yet collecting | 25 | 0 | 0 | account created 48 d before install |

### 1. Install before first payment (12) — the activation signal

These orgs had an account but had never collected anything. They install the app, and **all 12 take their first payment within 10 days**, median 2 days, 4 on the same day. 6 of 12 are closed won.

This looks like the app unblocking activation. Treat it as correlation, not causation: these orgs were most likely building their site and their donation form in the same sitting. Small n.

**Boundary rule:** the 4 orgs whose first payment lands on the install date itself are counted here, consistent with how same-day signups are treated above. Moving them to group 2 gives 8 / 36 / 25.

### 2. Install after first payment (32) — product adoption, not win-back

Orgs that were already collecting, median 20 months between first payment and install. Nearly all of the GMV sits here. Checking each org's last payment strictly **before** its install date:

| State at install | Orgs | Lifetime GMV (USD) | What it really is |
|---|---:|---:|---|
| Still active (last payment within 60 d) | 19 | 696,441 | Product adoption |
| Soft churn (61 to 90 d) | 2 | 11,065 | Borderline |
| Hard churn (more than 90 d) | 11 | 604,583 | Genuine reactivation candidate |
| **Total** | **32** | **1,312,089** | |

The majority (19) were still collecting when they installed. Only **11 were genuinely churned**, and **2 of those 11** have taken a payment since. A 6-month gap since signup says nothing about dormancy on its own, which is why this recency check matters.

### 3. Not yet collecting (25)

Median 48 days between account creation and install, so mostly recent signups still in setup. Too early to judge.

But **8 have an account older than 6 months with zero transactions** (up to 953 days). They come back on their own after months of silence, with no prompting. Best lifecycle-trigger candidate in the dataset.

## Signups and first payments attributed to the app

The 34 same-day signups since launch:

| | Count | Rate |
|---|---:|---:|
| Signups | 34 | baseline |
| Reached a first payment | 15 | 44 % |
| Closed won | 8 | 24 % |
| Lifetime GMV | 17,281 USD | |

Plus **30 installs with a real domain or email and no Zeffy account**. Ready-made outbound list.

## Attribution gap

How the warehouse currently credits those 34 app-led signups:

| `ACQUISITION_SOURCE` | Orgs |
|---|---:|
| other | 7 |
| branded_search | 7 |
| referral | 5 |
| paid_indirect | 5 |
| product_form | 4 |
| paid_search | 4 |
| paid_social | 1 |
| paid_social_indirect | 1 |

**11 booked as paid, 0 as Wix.** Only one of the 34 typed anything about Wix into `REGISTER_REFERRAL_SOURCE_DETAILS`. Warehouse-wide that field has just 8 wix mentions (`Wix`, `wix`, `Was an available app in WIX website`, `WIX Admin Suggested you`).

Fix: append a UTM or referral value to the signup link inside the app. Without it this channel cannot be measured or defended in a budget conversation.

## Method

1. Normalize the export: strip protocol, `www.`, and path from `Site URL`; lowercase emails; drop `@mysite.com` placeholders; flag `*.wixsite.com` / `*.wixstudio.com` / `wix-development-sites.org` as having no usable domain.
2. Normalize the warehouse side the same way. `FCT_ORGANIZATION.DOMAIN` is **not** normalized in the warehouse: the same column holds `example.org`, `www.example.org`, `https://www.example.org/`, and even full Facebook URLs.

   ```sql
   SPLIT_PART(REGEXP_REPLACE(LOWER(DOMAIN), '^(https?://)?(www[.])?', ''), '/', 1)
   ```

3. Match on normalized domain, then on `LOWER(FCT_USER.EMAIL)` joined to its `ID_ORGANIZATION`. There is no email column on `FCT_ORGANIZATION`.
4. **One org per install row.** 14 install rows map to a domain or email shared by 2+ Zeffy orgs (`aztamilsangam.org` alone has 5). Pick the **earliest-created** candidate, which is the conservative choice for discovery attribution: if the nonprofit already had any Zeffy account, the app did not drive discovery.

   ```sql
   QUALIFY ROW_NUMBER() OVER (PARTITION BY IDX ORDER BY CREATED ASC, TOTAL_GMV DESC) = 1
   ```

5. For the recency check, join `FCT_TRANSACTION` with `t.DT_TRANSACTION < install_date` and take the max, per org. `FCT_ORGANIZATION.DT_LAST_PAYMENT` is the current last payment and cannot answer "was this org dormant at install time".

## Caveats

- **No install status in the export.** There is no installed/uninstalled column, so all 178 rows are treated as installs. The App Market dashboard reports ~150 active and 28 uninstalls, which does not reconcile exactly with 178. Percentages are more reliable than absolute counts here. Re-export with a status column to fix this.
- **Same-day is co-occurrence, not ordering.** Install and signup dates land on the same calendar day with no intra-day ordering. The 34 same-day signups are the best available proxy for app-led discovery, not a causal claim.
- **Email matching is one-sided.** We match the Wix business email against Zeffy user emails. Anyone who signed up with a different address is misclassified as "no Zeffy account".
- **GMV is lifetime and in USD** from `FCT_ORGANIZATION.TOTAL_GMV`, not GMV since install.
- **Fraudulent orgs were not excluded.** None appeared in the matched set (`DT_FRAUDULENT` null throughout).
- **WordPress has no equivalent.** WordPress.org reports active installs only (1,000+, already net of uninstalls) with no per-site email or domain, so none of this split can be reproduced there. Applying the Wix ratio to WP is an unverifiable estimate, not a measurement.

## Re-running this

Nothing is scheduled. To refresh: re-export from the App Market, then repeat the method above. Install volume is accelerating (2 in May, 56 in June, 120 in July with 3 days still to run), so a monthly pull is worth more than a one-off.

Worth adding next: an uninstall rate over time, which the current export cannot support.
