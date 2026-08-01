# Farsh e Zameen (Apna Ghar Apni Zameen) — Project Summary

A Pakistani real-estate listing mobile app built with **Expo Router** (React Native), paired with a small **Express/MongoDB** backend for authentication. Users browse property listings (houses, apartments, commercial, industrial), filter/search them, save favorites, view details with an image gallery and contact-agent actions, and manage a profile.

- **App name**: Farsh e Zameen
- **Package/bundle id**: `com.farshezameen.app`
- **Frontend**: Expo SDK 57, React Native 0.86, React 19.2, TypeScript 6, Expo Router 6 (file-based routing)
- **Backend**: Express 5 + Mongoose 9 (MongoDB Atlas), JWT auth, deployed via Vercel
- **State/data**: Property data is served from a local mock fixture (`api/apiMock.tsx`); auth (`/signin`, `/signup`) talks to the real backend

---

## Tech stack

| Layer | Technology |
|---|---|
| Routing | `expo-router` (file-based, groups `(auth)` / `(tabs)`) |
| UI | React Native core components + a small custom design-system (`AppText`, `AppButton`, `Colors`, `Typography`, `Layout`) |
| Lists | `@shopify/flash-list` |
| Maps | `react-native-maps` (native), custom placeholder component on web |
| Icons | `@expo/vector-icons` (Ionicons) |
| HTTP | `axios` |
| Local storage | `@react-native-async-storage/async-storage` |
| Network status | `@react-native-community/netinfo` |
| Backend framework | `express` |
| Database | `mongoose` (MongoDB Atlas) |
| Auth tokens | `jsonwebtoken`, `bcryptjs` |

---

## Architecture at a glance

```
app/                  → expo-router routes (thin — most just re-export a screens/ component)
  (auth)/              → forgot-password (route group, not shown in URL)
  (tabs)/               → bottom-tab routes: Home, Explore, Search, Favorites, Profile
  listing/[id].tsx      → property detail (dynamic route)
  _layout.tsx           → root layout: providers, theme, Stack navigator, side drawer

screens/               → the actual screen implementations most app/ routes delegate to
features/              → larger composed UI blocks used inside screens (listing detail, search suggestions)
components/            → small reusable building blocks (base/ = design-system primitives, ui/ = app-specific widgets)
context/               → React Context providers (auth, favorites, network status)
hooks/                 → data-fetching and business-logic hooks
services/               → framework-agnostic service classes (API client, storage, analytics, offline queue)
constants/              → design tokens (colors, spacing, typography) + app configuration
types/                  → shared TypeScript types
api/                    → local mock property dataset used as the "backend" for browsing
backend/                → separate Express/Mongo server (auth only, deployed independently)
assets/                 → images (logos, splash, icons)
```

**Why properties come from a local fixture, not the backend**: the Express backend's `/properties` endpoint generates random mock data fresh on every request (nothing is persisted), so IDs never stayed consistent between the list screen and the detail screen — tapping a property used to 404. The whole app was unified onto `api/apiMock.tsx`'s `MOCK_PROPERTIES` array (27 realistic Karachi/Lahore/Islamabad listings) so browsing is internally consistent and works fully offline. Only sign-in/sign-up hit the real backend.

---

## Folder-by-folder, file-by-file reference

### `app/` — routes (expo-router)

| File | Route | Purpose |
|---|---|---|
| `_layout.tsx` | (root) | Wraps the whole app in `AuthProvider` → `NetworkProvider` → `FavoritesProvider` → `ThemeProvider` → a custom `DrawerProvider`, then renders the `Stack` navigator with all top-level screens registered (auth, tabs, favorites, search, map, profile, notifications, settings, edit-profile, my-listings, help, industrial-hub, modal, listing detail). Also defines the slide-in hamburger side drawer (`useDrawer()` context + `DrawerRenderer`). |
| `(auth)/forgot-password.tsx` | `/forgot-password` | Password-reset request form (email input → simulated "link sent" confirmation). Route group `(auth)` doesn't appear in the URL. |
| `(tabs)/_layout.tsx` | `/(tabs)` | Bottom tab bar definition: Home, Explore (Industrial Hub), Search (center FAB-style button), Favorites, Profile. |
| `(tabs)/index.tsx` | `/` | Re-exports `screens/HomeScreen.tsx`. |
| `(tabs)/explore.tsx` | `/(tabs)/explore` | Re-exports `screens/IndustrialHubScreen.tsx`. |
| `(tabs)/search.tsx` | `/(tabs)/search` | Re-exports `screens/SearchScreen.tsx`. |
| `(tabs)/favorites.tsx` | `/(tabs)/favorites` | Re-exports `screens/FavoritesScreen.tsx`. |
| `(tabs)/profile.tsx` | `/(tabs)/profile` | Re-exports `screens/ProfileScreen.tsx`. |
| `edit-profile.tsx` | `/edit-profile` | Standalone edit-profile form (name/email/phone), calls `useAuth().updateProfile`. |
| `favorites.tsx` | `/favorites` | Non-tab duplicate route to `screens/FavoritesScreen.tsx` (reachable from the side drawer). |
| `help.tsx` | `/help` | Re-exports `screens/HelpScreen.tsx`. |
| `industrial-hub.tsx` | `/industrial-hub` | Re-exports `screens/IndustrialHubScreen.tsx` (reachable from the side drawer). |
| `listing/[id].tsx` | `/listing/:id` | Property detail screen — looks up the property via `useFetchProperty(id)` and composes `ImageGallery`, `PropertyInfo`, `ContactAgent`, `SimilarListings`. |
| `map.tsx` | `/map` | Full-screen map view of all properties with search + property preview card. |
| `modal.tsx` | `/modal` | Placeholder "Advanced Filters" modal screen (mostly a stub). |
| `my-listings.tsx` | `/my-listings` | Re-exports `screens/MyListingScreen.tsx`. |
| `notifications.tsx` | `/notifications` | Re-exports `screens/NotificationsScreen.tsx`. |
| `profile.tsx` | `/profile` | Non-tab duplicate route to `screens/ProfileScreen.tsx`. |
| `search.tsx` | `/search` | Non-tab duplicate route to `screens/SearchScreen.tsx`. |
| `settings.tsx` | `/settings` | Re-exports `screens/SettingsScreen.tsx`. |
| `signin.tsx` | `/signin` | **The real** sign-in screen — wired to `useAuth().signIn`, hits the backend `/signin`. |
| `signup.tsx` | `/signup` | **The real** sign-up screen — wired to `useAuth().signUp`, hits the backend `/signup`. |

### `screens/` — full screen implementations

| File | Used by | Purpose |
|---|---|---|
| `FavoritesScreen.tsx` | `favorites`, `(tabs)/favorites` | Shows saved properties (filtered from `useFetchProperties()` by the favorited IDs), with guest/empty/loading states. |
| `HelpScreen.tsx` | `help` | FAQ list + contact-support (email/phone) links. |
| `HomeScreen.tsx` | `(tabs)/index` | Main landing screen: hero header with search, featured properties carousel, quick filters, full property list (`FlashList`), stats row, FAB to map view. |
| `IndustrialHubScreen.tsx` | `explore`, `industrial-hub` | Filtered view of commercial/industrial/warehouse/factory/retail properties. |
| `MyListingScreen.tsx` | `my-listings` | "My Listings" — properties owned by the current user (mocked: filters `MOCK_PROPERTIES` by owner type), "Add Listing" CTA. |
| `NotificationsScreen.tsx` | `notifications` | Notification preferences (toggles) + a mock notification feed with read/unread state. |
| `ProfileScreen.tsx` | `(tabs)/profile`, `profile` | Guest view (sign in/create account CTAs) vs. logged-in view (avatar, stats, menu, logout). |
| `SearchScreen.tsx` | `(tabs)/search`, `search` | Search bar with debounced results, recent/popular search suggestions when empty. |
| `SettingsScreen.tsx` | `settings` | Notification/privacy toggles, cache/data actions, app info, logout confirmation modal. |

### `features/` — larger composed UI blocks

| File | Purpose |
|---|---|
| `listings/ListingDetail/ContactAgent.tsx` | Call / WhatsApp / Email buttons + a "request info" modal for the listing owner/agent. |
| `listings/ListingDetail/ImageGallery.tsx` | Swipeable image carousel with thumbnail strip for a property's photos. |
| `listings/ListingDetail/PropertyInfo.tsx` | Price, specs (beds/baths/area), amenities, description, nearby landmarks section of the detail page. |
| `listings/ListingDetail/SimilarListings.tsx` | Horizontal scroll of properties similar in category/city/price to the one being viewed. |
| `search/SearchSuggestions.tsx` | Recent-searches and popular-searches chip lists shown on the empty search screen. |

### `components/base/` — design-system primitives

| File | Purpose |
|---|---|
| `AppButton.tsx` | Themed button (`primary`/`secondary`/`outline`/`ghost` variants, sizes, loading/disabled states, icon slots). |
| `AppText.tsx` | Themed text component (variant/color/weight/align props mapped to `Typography`/`Colors` tokens). |
| `ErrorBoundary.tsx` | Class component catching render errors and showing a friendly fallback UI. |
| `LoadingSpinner.tsx` | Reusable loading indicator (inline or full-screen overlay). |
| `OfflineBanner.tsx` | Banner shown when offline or when there are queued offline actions syncing. |

### `components/ui/` — app-specific widgets

| File | Purpose |
|---|---|
| `FilterModal.tsx` | Full filter sheet: price range slider, bedrooms, property type, city/area, amenities. |
| `MapMarker.tsx` | Custom map pin showing price + color-coded by listing type. |
| `MapView.tsx` | Native platform re-export of `react-native-maps`. |
| `MapView.web.tsx` | Web fallback — since interactive maps aren't available on web here, shows a placeholder card with a "View on Google Maps" external link. |
| `PropertyCard.tsx` | The property list-item card (image, badges, price, specs, favorite button) — used everywhere properties are listed. |
| `QuickFilterBar.tsx` | Horizontal scroll of quick-filter chips (listing type, property type) shown under the home header. |
| `SideDrawer.tsx` | Content of the hamburger-menu side drawer (nav links, auth state, logout). |

### `context/` — React Context providers

| File | Purpose |
|---|---|
| `AuthContext.tsx` | **The real auth provider.** Holds `user`, `signIn`, `signUp`, `signOut`, `updateProfile`; persists session to `AsyncStorage`; calls `services/apiService.tsx` under the hood. |
| `FavoritesContext.tsx` | In-memory favorited-property-ID list + add/remove/toggle/isFavorite. (Note: not persisted to storage — favorites reset on app restart.) |
| `NetworkContext.tsx` | Tracks online/offline state via `NetInfo`, drives the offline action queue (`services/offlineQueueService.tsx`) and exposes sync status. |

### `hooks/`

| File | Purpose |
|---|---|
| `useFetchProperties.tsx` | `useFetchProperties()` — loads all properties (from the local `MOCK_PROPERTIES` fixture, simulating a network delay). `useFetchProperty(id)` — looks up a single property by id from the same fixture. |
| `useFilterProperties.tsx` | Client-side filtering/sorting of a property list by listing type, category, city/area, price range, bedrooms, keywords, amenities; tracks active-filter count. |
| `useNetworkStatus.tsx` | Thin convenience wrapper around `NetworkContext` (adds an `isOffline` boolean). |

### `services/` — framework-agnostic service classes

| File | Purpose |
|---|---|
| `analyticsService.tsx` | Local event-tracking service (buffers events, persists via `storageService`) — used for lightweight in-app analytics logging, not wired to a real analytics SDK. |
| `apiService.tsx` | Axios-based API client. `login`/`register` hit the real backend (`/signin`, `/signup`); `getProperties`/`getProperty` hit the backend's mock endpoints (superseded by the local fixture for actual screen data, see note above). Auto-attaches the stored JWT to requests. |
| `notificationService.tsx` | Mocked push-notification service (price-drop alerts, cancel) — logs to console instead of sending real notifications, since Expo Go doesn't support Android push. Swap for `expo-notifications` in a dev build if real push is needed. |
| `offlineQueueService.tsx` | Persists actions performed while offline (e.g. favoriting) and replays them once back online. |
| `offlineSyncService.tsx` | Registers the actual processors (`favorites:add`, `favorites:remove`, `analytics:track`) that `offlineQueueService` runs when syncing. |
| `storageService.tsx` | Typed wrapper around `AsyncStorage` with key-prefixing and TTL-based caching (`setCache`/`getCache`). |

### `constants/`

| File | Purpose |
|---|---|
| `Colors.tsx` | The app's full color palette (green/white real-estate brand theme) — primary/secondary/status/gray scales, semantic tokens (`text`, `background`, `border`, `shadow`), helper functions. |
| `Config.tsx` | Central app configuration: API base URL/endpoints, map defaults, storage keys, feature flags, business rules (validation regexes, price/area ranges), localization, currency/area formatters. |
| `Layout.tsx` | Device dimension helpers, spacing scale, border-radius scale. |
| `Typography.tsx` | Font family/size/weight scale and `TextVariants` used by `AppText`. |

### `types/`

| File | Purpose |
|---|---|
| `property.ts` | The canonical `Property` interface (and its sub-types: `ListingType`, `PropertyCategory`, `AreaUnit`, etc.) — matches the shape of `MOCK_PROPERTIES`. |

### `api/`

| File | Purpose |
|---|---|
| `apiMock.tsx` | `MOCK_PROPERTIES` — 27 realistic property listings across Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Sialkot, Murree. This is the single source of truth for all property data in the app (list, detail, favorites, similar-listings, map). Also re-exports the `Property` type and related union types. |

### `backend/` — separate Express/Mongo server

| File | Purpose |
|---|---|
| `server.js` | Express app. Routes: `POST /signup` (validates fields, returns a mocked success — doesn't actually write to Mongo), `POST /signin` (validates fields, signs and returns a JWT — doesn't check a real password), `GET /user/:id`, `PUT /user/role/:id` (real Mongo-backed), `GET /properties` (generates random mock listings on every call — not used by the app's UI), `GET /properties/:id` (real Mongo lookup — not used by the app's UI). |
| `package.json` / `package-lock.json` | Backend dependencies: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`, `body-parser`, `axios`. |
| `.env` | Local environment variables (Mongo URI, JWT secret placeholder, port). Gitignored. |
| `atlas-credentials.env` | MongoDB Atlas onboarding output (username/password/URI). **Sensitive — now gitignored, but was previously untracked-and-unprotected; verify it was never committed.** |
| `vercel.json` | Deploys `server.js` as a Vercel serverless function. |
| `.gitignore` | Backend-specific ignore rules (node_modules, env files, logs, etc.). |

### `assets/images/`

Logos (`transparent-logo1.png` — the "Apna Ghar Apni Zameen" wordmark), app icon/splash assets (`icon.png`, `adaptive-icon-foreground.png` — generated house-glyph placeholders on brand green, pending real artwork), background imagery for the home header (`background.png`, `background1.png`), and leftover Expo starter-template assets (`react-logo*.png`, `partial-react-logo.png`, `splash-icon.png`, `android-icon-*.png` — not referenced anywhere, harmless).

### `scripts/`

| File | Purpose |
|---|---|
| `reset-project.js` | Standard Expo-starter utility script (`npm run reset-project`) that archives `app/`, `components/`, `hooks/`, `constants/`, `scripts/` into `app-example/` and scaffolds a blank starter app. **Destructive if run — not meant for this already-built project.** |

### Root config files

| File | Purpose |
|---|---|
| `package.json` | App dependencies/scripts (Expo SDK 57 / RN 0.86 / React 19.2). |
| `app.config.js` | Expo app manifest — name, bundle/package id, icons, splash, Android permissions (camera, location), plugins (`expo-router`, `expo-splash-screen`, `expo-web-browser`), EAS project id, `reactCompiler`/`typedRoutes` experiments enabled. |
| `tsconfig.json` | Extends `expo/tsconfig.base`; strict mode on; `@/*` path alias to project root. |
| `eslint.config.js` | Flat ESLint config extending `eslint-config-expo`. |
| `eas.json` | EAS Build profiles (development/preview/production). |
| `expo-env.d.ts` | Auto-generated Expo type reference (do not edit). |
| `withAROptional.js` | A custom Expo config plugin that marks the `com.google.ar.core` Android manifest metadata as `optional`. **Currently not active** — commented out in `app.config.js`'s `plugins` array. |
| `my-upload-key.jks` | Android app-signing keystore. **Sensitive — keep out of version control and back it up separately**; losing it means you can't publish updates to an existing Play Store listing under the same app. |
| `.env` | Root/app environment variables (`EXPO_PUBLIC_API_URL`, CDN URL, Mongo URIs used by scripts, port). Gitignored. |
| `README.md` | Original project README (pre-existing, not rewritten as part of this pass). |
| `.idea/`, `.vscode/` | Editor/IDE settings (JetBrains and VS Code respectively) — not part of the app. |

---

## What's *not* here (intentionally)

A large amount of leftover code from an earlier, pre-`expo-router` version of this app (a manual `navigation/` folder using `@react-navigation/native-stack`, duplicate screens, a `native-base`-dependent favorites hook, empty stub files, unused `utils/`/`styles/` folders, a disconnected mock-only login/register flow) was removed during the working-state pass — see `PROJECT_STATUS.md` for the full list and rationale. Everything documented above is what's actually reachable and running today.
