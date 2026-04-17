# Bonoro

**Discover the best restaurant promotions near you — the right deal, at the right place, on the right day.**

Bonoro is a mobile-first app for Mexico that connects food lovers with time-bound restaurant promotions. Users browse deals by city, day, category, and promo type. Restaurants self-manage their promotions through a built-in business dashboard.

---

## Features

**For users**
- Browse today's promotions with a rotating featured carousel (refreshes every 30 min)
- Filter by day, food category (Pizza, Sushi, Tacos, etc.), and promo type (2×1, 50% OFF, free drink, etc.)
- Interactive map with custom pins — gold for restaurants with active promos today
- Save favorites and get them segmented by "has promo today" vs "not today"
- Auto-detects your city via GPS or lets you pick from 6 Mexican cities

**For restaurants**
- Register your business and publish promotions in minutes
- 9 promotion types: 2×1, 50% OFF, free drink, free dessert, happy hour, birthday deal, group discount, student discount, daily special
- AI-generated promo labels (powered by Claude)
- Basic analytics dashboard (views, saves, directions clicks)

**Cities supported**
Monterrey · Ciudad de México · Guadalajara · Cancún · Puebla · Tijuana

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Mobile | Capacitor (iOS + Android) |
| Maps | Leaflet.js + OpenStreetMap |
| Landmark data | Overpass API |
| AI labels | Anthropic Claude API |
| Storage (current) | localStorage |
| Storage (planned) | Supabase |
| Auth (planned) | Supabase Auth (OTP via email/SMS) |
| Web hosting | Vercel |
| CI/CD | GitHub Actions |

---

## Getting Started

### Prerequisites
- Node.js 20+
- For iOS: Xcode 15+ (macOS only)
- For Android: Android Studio

### Run on localhost

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

### Build for web

```bash
npm run build
```

### Open on iOS simulator

```bash
npm run ios
# Builds the web app, syncs to Xcode project, opens Xcode
# Press ▶ in Xcode to run on simulator
```

### Open on Android emulator

```bash
npm run android
# Builds the web app, syncs to Android Studio project, opens Android Studio
# Press ▶ in Android Studio to run on emulator
```

### Sync web changes to native projects

```bash
npm run sync
# Runs build + cap sync — use this after every code change before testing on device
```

---

## Project Structure

```
bonoro/
├── .github/
│   └── workflows/
│       └── ci.yml          # Build on every push, deploy to Vercel on main
├── src/
│   ├── App.jsx             # Main application (single-file, ~2,400 lines)
│   ├── main.jsx            # React root
│   └── index.css           # Minimal CSS reset
├── ios/                    # Xcode project (Capacitor)
├── android/                # Android Studio project (Capacitor)
├── capacitor.config.json   # Capacitor: appId, appName, webDir
├── index.html
├── package.json
└── vite.config.js
```

---

## Deployment

### Web (Vercel)
The app auto-deploys to Vercel on every push to `main` via GitHub Actions.

**Required GitHub secrets:**

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | API token from vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `team_E7o9tRTosxX8G30eTnDDkCs1` |
| `VERCEL_PROJECT_ID` | `prj_mKZKiAFwG3V6Ej7TCU1RfmOsrvHf` |

### Mobile (Capacitor)
Build and distribute via Xcode (App Store) and Android Studio (Google Play).

```bash
# After code changes:
npm run sync

# iOS release: open Xcode → Product → Archive
# Android release: open Android Studio → Build → Generate Signed Bundle
```

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — auto-deploys to Vercel |
| `develop` | Integration branch for features |
| `feature/*` | Individual feature branches |

Always branch off `develop`, open a PR back into `develop`, then merge `develop → main` for releases.

---

## Roadmap

- [ ] Supabase integration (real database + auth)
- [ ] Real OTP via email / SMS (replacing demo mode)
- [ ] Push notifications ("Your favorite Sushi Kai has a promo today")
- [ ] Restaurant photo uploads
- [ ] Real analytics tracking
- [ ] Deep links and social sharing
- [ ] PWA support (offline-capable)
- [ ] More cities

---

## License

Private — all rights reserved.
