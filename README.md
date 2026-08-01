# Farsh e Zameen (Apna Ghar Apni Zameen)

A real estate marketplace app built with Expo (React Native + TypeScript) and an Express/MongoDB backend. Browse, search, and compare properties; contact agents directly; post and manage your own listings.

## Tech stack

- **App**: Expo SDK 57, React Native, TypeScript, `expo-router` (file-based routing)
- **Maps**: OpenStreetMap via Leaflet (WebView on native, `react-leaflet` on web) — no API key required
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Auth**: JWT + bcrypt, role-based (`buyer` / `agent` / `admin`)

## Project structure

```
apaz/
├── app/                      # expo-router routes (file-based)
│   ├── (auth)/               # forgot-password
│   ├── (tabs)/               # bottom tab navigator: home, explore, search, favorites, profile
│   ├── agent/[id].tsx        # public agent profile
│   ├── listing/[id].tsx      # property detail
│   ├── onboarding.tsx, signin.tsx, signup.tsx
│   ├── post-listing.tsx      # create/edit a listing
│   ├── compare.tsx, saved-searches.tsx, map.tsx, my-listings.tsx, ...
│   └── _layout.tsx           # root stack, providers, animated splash
├── screens/                  # screen components rendered by app/ routes
├── components/               # base/ (AppText, AppButton, ...) + ui/ (PropertyCard, MapView, FilterModal, ...)
├── features/                 # feature-scoped components (listing detail, search)
├── context/                  # Auth, Favorites, Compare, Network providers
├── hooks/                    # useFetchProperties, useFilterProperties, useSavedSearches, ...
├── services/                 # apiService (the only HTTP boundary), storageService, notificationService
├── lib/                      # format, contactLinks (dialer/SMS/WhatsApp/email), imagePicker
├── constants/                # Colors, Typography, Layout, Config (API base URL, endpoints)
├── types/                    # Property, PropertyDraft, etc.
├── assets/images/            # icons, splash, logo, property placeholders
└── backend/                  # Express API (separate Node project — see below)
    ├── server.js
    ├── config/db.js
    ├── models/                # User, Property, Counter
    ├── controllers/           # authController, propertyController
    ├── routes/                # authRoutes, propertyRoutes
    ├── middleware/             # auth (JWT), errorHandler
    └── utils/                 # mockPropertyGenerator (seeded demo listings), toClientProperty
```

## Running the app

**1. Install dependencies (repo root and backend, separately):**

```bash
npm install
cd backend && npm install && cd ..
```

**2. Configure environment variables:**

Root `.env` (copy from `.env.example`):
```
EXPO_PUBLIC_API_URL=http://<your-machine-LAN-IP>:8000
GOOGLE_MAPS_API_KEY=
```
> On a physical device, `localhost` won't reach your dev machine — use your computer's LAN IP. Not needed for `GOOGLE_MAPS_API_KEY` right now (maps run on free OpenStreetMap tiles); fill it in later if you switch back to native Google Maps.

`backend/.env`:
```
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=30d
PORT=8000
```

**3. Start the backend:**

```bash
cd backend
npm start
```

**4. Start the app (in a separate terminal, from the repo root):**

```bash
npx expo start
```

Then press `a` for Android, `i` for iOS, or `w` for web — or scan the QR code with Expo Go on a physical device.

## Building the app / creating an APK

This project uses [EAS Build](https://docs.expo.dev/build/introduction/) (cloud builds — no local Android Studio/Xcode setup required).

**1. Install the EAS CLI and log in (one-time):**

```bash
npm install -g eas-cli
eas login
```

**2. Build an installable `.apk` (for direct install/testing, not the Play Store):**

```bash
eas build --platform android --profile preview
```

This uses the `preview` profile in `eas.json`, which is already configured to output an `.apk`. When the build finishes, EAS prints a download link (also visible on your [expo.dev dashboard](https://expo.dev)) — download the `.apk` directly to a device to install it.

**3. Production builds:**

```bash
eas build --platform android --profile production
```

(Also outputs an `.apk` per the current `eas.json`; switch `buildType` to `"app-bundle"` in `eas.json` if you need an `.aab` for the Play Store.)

```bash
eas build --platform ios --profile production
```

(Requires an active Apple Developer account, configured the first time you run it.)

**4. Development build** (a custom dev client with native modules included, for use with `npx expo start`):

```bash
eas build --platform android --profile development
```

## Notes

- The backend is deployed separately (see `backend/DEPLOY.md`) — the app talks to it purely over HTTP via `EXPO_PUBLIC_API_URL`; nothing in the app imports backend code directly.
- Demo/browse listings are deterministically generated (`backend/utils/mockPropertyGenerator.js`) so the same id always returns the same property. Real, user-posted listings (via "Post New Property") are persisted in MongoDB and blended into the same feed.
