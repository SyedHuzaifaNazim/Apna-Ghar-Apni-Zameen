# Project Status

_Last updated: 2026-07-30_

## Current state: ✅ Working

- `npx tsc --noEmit` → **0 errors**
- `npx expo lint` → **0 problems**
- `npx expo export --platform web` → builds successfully (25 routes, 1527 modules)
- `npx expo export --platform android` → builds successfully (Hermes bytecode produced, 1807 modules)
- Backend (`node server.js`) → starts and listens on port 8000

The app was previously **not working** (broken imports, missing packages, dead code causing build/type errors, and a core navigation flow that was silently broken). It has been brought to a genuinely working, buildable state — see "What was fixed" below.

---

## How to run it

### Backend (from `backend/`)
```bash
cd backend
npm install     # first time only
npm run dev     # auto-restarts on file changes
# or: npm start
```
Runs on `http://localhost:8000`. Only `/signin` and `/signup` are actually used by the app; both work without a live database (they're mocked — see "Known limitations" below).

### App (from the project root)
```bash
npm install      # first time only
npm start        # starts the Expo dev server
```
Then:
- Press `w` → open in a web browser
- Press `a` → open on a connected Android device/emulator
- Press `i` → open on iOS simulator (Mac only)
- Or scan the QR code with the **Expo Go** app on your phone

Shortcuts: `npm run web`, `npm run android`, `npm run ios`.

Other useful scripts (root `package.json`):
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — `expo lint`
- `npm run doctor` — `expo-doctor` (project health check)
- `npm run prebuild` — regenerate native `android/`/`ios/` projects
- `npm run backend` — runs the backend's `npm run dev` from the root, via `npm --prefix backend`

### Running on a physical Android device via Expo Go
If you see `Project is incompatible with this version of Expo Go`, your Expo Go app is older than this project's SDK (57). Update Expo Go from the Play Store, then scan the QR code again. `npx expo start --android` does **not** avoid this — it still opens through Expo Go unless a development build is already installed on the device. For a development build instead: `npx expo run:android` (requires Android Studio/SDK; if installing via USB you'll need Developer Options → USB debugging enabled on the phone — not needed for the Expo Go / QR-code path).

---

## Known limitations (by design, not bugs)

- **Property data is a local fixture, not live**: `api/apiMock.tsx` (`MOCK_PROPERTIES`, 27 listings) is the single source of truth for browsing, search, favorites, and the map. The backend's `/properties` endpoints exist but aren't used by the UI (see `PROJECT_SUMMARY.md` for why). To go live, you'd replace `hooks/useFetchProperties.tsx`'s internals with real API calls and give the backend real property persistence + a matching `id` scheme.
- **Backend auth is mocked**: `/signup` validates fields but doesn't write a user to MongoDB; `/signin` validates fields and issues a real JWT but doesn't check a password against a stored hash. Functionally you can "sign up" and "sign in" with any credentials. Wire up real `User` model reads/writes + `bcryptjs` password verification before shipping.
- **Favorites aren't persisted**: `context/FavoritesContext.tsx` keeps favorited IDs in memory only — they reset on app restart. (There's a separate, unused, `AsyncStorage`-backed favorites implementation pattern in `services/storageService.tsx`'s `getFavorites`/`setFavorites` methods that isn't currently wired to the context — an easy follow-up if persistence is wanted.)
- **Push notifications are mocked**: `services/notificationService.tsx` logs to console instead of sending real notifications (Expo Go doesn't support Android push). Swap in `expo-notifications` once the app ships as a development build / standalone binary.
- **MongoDB Atlas is unreachable from this environment**: `backend/.env`'s `MongoDB_URI_PROD` fails DNS resolution here — likely a network restriction, or the cluster is paused. Doesn't block anything the app currently uses.

---

## What was fixed (this pass)

### Dependencies
- Upgraded Expo 54 → **57**, React Native 0.81 → **0.86**, React 19.1 → **19.2**, TypeScript 5.9 → **6.0**, and every other package to latest via `expo install --fix`.
- Backend: `mongoose`, `express`, `axios`, `cors`, `dotenv`, `body-parser`, `jsonwebtoken`, `bcryptjs` all bumped to latest.
- Removed the unused native `bcrypt` package from the backend (only `bcryptjs` was actually imported; the native one just risked native-compile issues on Vercel).
- Removed `@react-navigation/*` packages from the root `package.json` — `expo-router` 56+ vendors its own fork internally and no longer allows apps to import `@react-navigation/native` directly (this was actually causing the web/Android bundle to fail outright — see below).
- Fixed essentially all `npm audit` findings; the handful that remain are inside Expo's own CLI/build tooling (dev-time only, not shipped in the app).

### Real bugs (not just types)
1. **Core browse → detail flow was completely broken.** The property list came from the backend's `/properties` endpoint, which regenerates random fake data on every request (nothing persisted) — so its IDs never matched what the detail screen (which read from a separate hardcoded fixture) was looking for. Tapping any property card always showed "Property not found." Fixed by unifying both the list and detail screens onto the same `MOCK_PROPERTIES` fixture (`hooks/useFetchProperties.tsx` rewritten).
2. **App wouldn't bundle at all post-upgrade**: `expo-router` 56+ throws `expo-router is no longer compatible with react-navigation` if any app code imports `@react-navigation/native` directly. `app/_layout.tsx` and `screens/HomeScreen.tsx` imported `ThemeProvider`/`DarkTheme`/`DefaultTheme`/`useFocusEffect` from there — migrated both to import the same APIs from `expo-router` instead (which re-exports its own fork).
3. **`FavoritesScreen`** called `propertyApi.getProperties({ include: favorites, per_page: 100 })` — a call signature the API client doesn't have and a filter the backend doesn't support. Fixed to derive favorites by filtering the already-loaded property list.
4. **Web-only crash**: `app/_layout.tsx`'s side-drawer `Modal` was unmounted two different ways at once — by React (`return null` based on reading an Animated.Value's private `_value`, an unreliable render-time read) *and* by the `Modal`'s own `visible` prop. On web both paths tried to remove the same DOM node from `document.body`, throwing `NotFoundError: Failed to execute 'removeChild'`. Fixed by removing the redundant manual unmount — `visible={isDrawerOpen}` is now the single source of truth.
5. Broken `notificationService` export (`offlineSyncService.tsx` imported a named `notificationService` that didn't exist) — rewritten as a proper class instance with the methods actually used (`schedulePriceDropAlert`, `cancelNotification`).
6. `storageService.tsx` had a real type-safety bug (TTL-wrapped cache payload typed as the raw value type) and a naming collision between an exported `interface StorageService` and a duplicate type-only re-export of the same name — both fixed.
7. Several smaller issues: missing `React` import (UMD-global error) in `forgot-password.tsx`, `StyleSheet.absoluteFillObject` (removed in this RN version, replaced with `absoluteFill`) in three files, a hook called with an argument it doesn't accept, a dangling `tsconfig.json` include pointing at a file that no longer exists.

### Dead code removed
About 50 files/folders — all unreachable leftovers from an earlier, pre-`expo-router` version of this app (confirmed via exhaustive import-graph tracing before deletion, all fully reversible via git history):

- **Entire `navigation/` folder** (`AppNavigator`, `BottomTabNavigator`, `DeepLinking`, `NavigationService`, `StackNavigators`) — manual React Navigation setup superseded by `expo-router`'s file-based routing.
- **A second, disconnected login/register flow**: `app/(auth)/login.tsx`, `app/(auth)/register.tsx`, `features/auth/LoginScreen.tsx`, `features/auth/RegisterScreen.tsx` — used entirely fake/mock auth state, not linked from anywhere in the actual UI (`SideDrawer`/`ProfileScreen` always pointed to `/signin` and `/signup`, the real ones, instead).
- Duplicate/orphaned screens: `screens/EditProfileScreen.tsx`, `screens/MapScreen.tsx`, `screens/SignInScreen.js`, `screens/SignUpScreen.js`, `screens/ListingDetailScreen.tsx` (each superseded by a real, differently-implemented route under `app/`).
- Unused hooks: `useFavorites` (depended on `native-base`, which isn't installed — dead on arrival), `useLocation`, `useMap`, `useSharedStorage`, `useDebounce`, `useSearch`, `useAuth` (there's a separate, real `context/AuthContext.tsx` that's actually used).
- Unused services: `services/index.ts` (a broken barrel file, itself unreferenced), `locationService.tsx`, `mapService.tsx`.
- Unused feature components: all of `features/profile/*`, `features/search/{RecentSearches,AdvancedFilters,SearchResults}`, all of `features/map/*`, `features/listings/ListingCard/*` (three unused card-variant components).
- Unused folders removed entirely: `utils/` (6 files), `styles/` (3 files).
- Unused components: `components/base/{SafeInput,Input}.tsx`, `components/ui/{PriceRangeSlider,ImageCarousel,SearchHeader}.tsx`.
- Duplicate/empty context & type files: `context/AuthContext.js` (a stub duplicate of the real `.tsx` one — a landmine if Metro ever resolved it instead), `context/ThemeContext.tsx` (empty, unreferenced), `context/FilterContext.tsx` (empty, unreferenced), `types/api.ts`, `types/common.ts`, `types/user.ts` (all empty), `types/navigation.ts` (stale route list from the old nav setup).
- Unused mock data file `api/wp_posts.json` and a ~2,000-line duplicated block inside `api/apiMock.tsx` itself (a second, verbatim copy of the same 25 properties under different constant names, causing a type-export conflict).
- Two accidental junk files at the project root (`android.os.Looper`, `com.facebook.react.fabric.mounting.MountItemDispatcher`) — a pasted Gradle build log and a pasted Java source file, each saved under a fully-qualified class name as the filename by mistake.

### Security
- `backend/atlas-credentials.env` (MongoDB Atlas onboarding output containing real username/password/URI, explicitly labeled "DO NOT commit" by Atlas itself) was **not gitignored**. Added it to `backend/.gitignore`. It was untracked (never committed), but double-check your git history / any prior pushes to be safe.

### UI
Most screens (Settings, Notifications, Help, Home, property cards) already used the app's green real-estate `Colors` design-token system consistently and looked reasonably modern. Did a consistency pass on the screens that were still using raw hardcoded hex colors instead of the shared tokens: `ProfileScreen.tsx`, `app/edit-profile.tsx`, `app/signin.tsx`, `app/signup.tsx`, `app/(auth)/forgot-password.tsx` (the last one was rebuilt from a "coming soon" stub into a real working form).

---

## Suggested next steps (not done, out of scope for this pass)

- Wire up real backend auth (password hashing/verification, actual user persistence) before this goes anywhere near production.
- Decide on a real property-data strategy: either build out real backend persistence for properties (so `/properties` and `/properties/:id` return consistent, matching data), or keep the local-fixture approach intentionally for now and swap it later.
- Persist favorites to `AsyncStorage` (via `storageService`) so they survive app restarts.
- Update `.env`'s `EXPO_PUBLIC_API_URL` LAN IP (`192.168.43.24`) to your current machine's IP if testing sign-in/sign-up on a physical device on the same network — see `ipconfig`.
- Consider whether the duplicate non-tab routes (`/favorites`, `/profile`, `/search`, `/industrial-hub` vs. their `(tabs)/` counterparts) are intentional (they are — reachable from the side drawer) or worth consolidating.
