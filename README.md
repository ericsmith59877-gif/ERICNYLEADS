# XyberMed Lead Finder

A private lead-generation web app for **XyberMed**. It finds newly opened **private** medical practices, newly registered
physicians, new labs and new clinics in New York State, removes the ones you could never win, and ranks the rest by fit with
XyberMed's services (credentialing, billing and RCM, lab billing).

## Sign in
Default login: username `eric`, password `eric911`. The login is checked on the server and the lead data is only sent to a signed-in session.
**Change it after deploying:** in Vercel open Project > Settings > Environment Variables, add `APP_USER` and `APP_PASS`, then redeploy.
The defaults are visible in `api/_auth.js`, so keep the GitHub repository **private**.

## Features
- Live data from CMS NPPES (new provider IDs) and the NYS Department of Health facility registry.
- Automatic filtering of hospital systems, universities, government, national chains, FQHCs, care homes, hospital-run clinics and dentists.
- Fit score 0-100 with tiers (Hot / Warm / Watch). **Hot requires a sign of independence** (solo practitioner, new practice entity or lab, a doctor and a new practice at the same address, or an independent clinic).
- Color-coded lead types (Doctor, Practice, Lab, Facility), plain-English reasons for every score, and a suggested pitch by specialty.
- Filters for type, time, specialty, region and tier, search, a one-click "Today's call list" (top 25 with a phone), cards or table view.
- Click a lead for details: status (New, Contacted, Meeting booked, Won, Not a fit), notes, an outreach email draft with a Copy button, and links to the official record, Google, Maps and LinkedIn.
- Star leads, a "My pipeline" tab, CSV export. Statuses, notes and stars are saved in your browser.
- Keyboard: `/` to search, `Esc` to close a lead.

## Deploy (about 5 minutes, free)
1. **Unzip** this file and open the folder so you can see `index.html`, `api`, `data`, `package.json` and `vercel.json`.
2. **GitHub:** create a new **private** repository, click *uploading an existing file*, select **everything inside the folder** (not the folder itself) and drag it in, then *Commit changes*. The repository front page must show `index.html` and `api` directly.
3. **Vercel:** sign in with GitHub, *Add New > Project*, import the repository, change nothing, click **Deploy**.
4. Open the link and sign in. The first load can take up to a minute while the latest government files are fetched.

If the repository front page shows a single folder instead of `index.html`, either re-upload the contents or set Vercel's **Root Directory** to that folder.
To update an existing deployment, replace the files in the same repository; Vercel redeploys automatically.

## Project layout
| Path | Purpose |
|---|---|
| `index.html` | The whole interface (no build step) |
| `api/leads.js` | Fetches and parses public data, classifies it, returns JSON (login required) |
| `api/session.js`, `api/_auth.js` | Sign in, sign out and session check |
| `data/sample.json` | Fictional sample data, shown only if live data cannot load |
| `vercel.json` | Function timeout and security headers |

## Customising
- Who counts as "not a client": the `BIG`, `NOTFIT` and `PRIV` patterns in `api/leads.js`.
- Scoring weights, specialties and pitch angles: `prep()`, `SPECS`, `TARGET` and `ANGLES` in `index.html`.

## Good to know
- A new provider ID usually comes before opening and payer enrollment. It is a strong signal, not proof of an open practice. Expect many resident physicians around July.
- CMS keeps about five weekly files online, so the app covers roughly the last 5 weeks of registrations.
- Public data has no email addresses. Organization records include the authorized official's name and phone.
- If live data fails, a red banner shows the exact reason and the page falls back to sample data.
- Follow Do-Not-Call, TCPA and CAN-SPAM rules when contacting leads.
