<!-- # Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions. -->



# Apna Ghar Apni Zameen - Complete Folder Structure

```
ApnaGharApniZameen/
├── 📁 assets/                          # Static media files
│   ├── 📁 fonts/                       # Custom font files
│   │   ├── Inter-Regular.ttf
│   │   ├── Inter-Medium.ttf
│   │   ├── Inter-SemiBold.ttf
│   │   └── Inter-Bold.ttf
│   └── 📁 images/                      # App images and icons
│       ├── icon.png                    # App icon
│       ├── splash.png                  # Splash screen
│       ├── adaptive-icon.png           # Android adaptive icon
│       ├── favicon.png                 # Web favicon
│       ├── logo.png                    # Main app logo
│       ├── logo-horizontal.png         # Horizontal logo variant
│       └── placeholder-property.jpg    # Default property image
│
├── 📁 src/                             # Core application source code
│   ├── 📁 api/                         # Data handling layer
│   │   └── apiMock.tsx                 # Mock API with 20+ property objects
│   │       └── 📄 MOCK_PROPERTIES[]    # 20 diverse property listings
│   │       └── 📄 Property interface   # TypeScript interface definition
│   │
│   ├── 📁 components/                  # Reusable UI components
│   │   ├── 📁 base/                    # Fundamental components
│   │   │   ├── AppText.tsx             # Custom text component with typography
│   │   │   ├── AppButton.tsx           # Custom button with variants
│   │   │   ├── LoadingSpinner.tsx      # Reusable loading indicator
│   │   │   └── ErrorBoundary.tsx       # Global error handling
│   │   │
│   │   └── 📁 ui/                      # Complex UI components
│   │       ├── PropertyCard.tsx        # Property listing card component
│   │       ├── SearchHeader.tsx        # Search bar with logo and filters
│   │       ├── FilterModal.tsx         # Advanced filtering interface
│   │       ├── ImageCarousel.tsx       # Property image gallery
│   │       ├── PriceRangeSlider.tsx    # Custom price filter component
│   │       └── MapMarker.tsx           # Custom map pin component
│   │
│   ├── 📁 constants/                   # Global configuration
│   │   ├── Colors.tsx                  # Color palette and theme colors
│   │   ├── Typography.tsx              # Font sizes, weights, line heights
│   │   ├── Layout.tsx                  # Spacing, borders, shadows
│   │   └── Config.tsx                  # API endpoints, app settings
│   │
│   ├── 📁 context/                     # Global state management
│   │   ├── FavoritesContext.tsx        # Favorites state and actions
│   │   ├── AuthContext.tsx             # Authentication state
│   │   ├── FilterContext.tsx           # Search and filter state
│   │   └── ThemeContext.tsx            # Dark/light mode theming
│   │
│   ├── 📁 features/                    # Feature-based code organization
│   │   ├── 📁 auth/                    # Authentication feature
│   │   │   ├── LoginScreen.tsx         # User login interface
│   │   │   ├── RegisterScreen.tsx      # User registration interface
│   │   │   ├── AuthForm.tsx            # Shared auth form logic
│   │   │   └── SocialLogin.tsx         # OAuth integration components
│   │   │
│   │   ├── 📁 listings/                # Property listings feature
│   │   │   ├── ListingDetail/          # Property detail sub-feature
│   │   │   │   ├── ImageGallery.tsx    # Full-screen image viewer
│   │   │   │   ├── PropertyInfo.tsx    # Detailed property information
│   │   │   │   ├── ContactAgent.tsx    # Agent contact forms
│   │   │   │   └── SimilarListings.tsx # Recommendations component
│   │   │   │
│   │   │   └── ListingCard/            # Listing presentation
│   │   │       ├── CompactView.tsx     # Small card variant
│   │   │       ├── DetailedView.tsx    # Large card variant
│   │   │       └── GridView.tsx        # Grid layout variant
│   │   │
│   │   ├── 📁 search/                  # Search functionality
│   │   │   ├── AdvancedFilters.tsx     # Complex filter options
│   │   │   ├── SearchResults.tsx       # Results display logic
│   │   │   ├── RecentSearches.tsx      # Search history management
│   │   │   └── SearchSuggestions.tsx   # Auto-complete functionality
│   │   │
│   │   ├── 📁 profile/                 # User profile feature
│   │   │   ├── UserProfile.tsx         # Profile management
│   │   │   ├── FavoritesList.tsx       # Saved properties display
│   │   │   ├── ViewedProperties.tsx    # Browse history
│   │   │   └── AccountSettings.tsx     # User preferences
│   │   │
│   │   └── 📁 map/                     # Map functionality
│   │       ├── ClusterMap.tsx          # Property clustering
│   │       ├── MapFilters.tsx          # Map-specific filters
│   │       ├── PropertyPopup.tsx       # Map marker info windows
│   │       └── Directions.tsx          # Navigation integration
│   │
│   ├── 📁 hooks/                       # Custom React hooks
│   │   ├── useFetchProperties.tsx      # Property data fetching
│   │   ├── useFilterProperties.tsx     # Property filtering logic
│   │   ├── useAuth.tsx                 # Authentication logic
│   │   ├── useFavorites.tsx            # Favorites management
│   │   ├── useLocation.tsx             # Geolocation services
│   │   ├── useSearch.tsx               # Search functionality
│   │   ├── useMap.tsx                  # Map interactions
│   │   └── useDebounce.tsx             # Performance optimization
│   │
│   ├── 📁 navigation/                  # Navigation setup
│   │   ├── AppNavigator.tsx            # Main navigation structure
│   │   ├── BottomTabNavigator.tsx      # Tab-based navigation
│   │   ├── StackNavigators.tsx         # Screen stack navigators
│   │   ├── NavigationService.tsx       # Navigation utility functions
│   │   └── DeepLinking.tsx             # Deep link configuration
│   │
│   ├── 📁 screens/                     # Top-level screen components
│   │   ├── HomeScreen.tsx              # Main dashboard/browse screen
│   │   ├── MapScreen.tsx               # Interactive map view
│   │   ├── ProfileScreen.tsx           # User profile and settings
│   │   ├── ListingDetailScreen.tsx     # Property details full screen
│   │   ├── SearchScreen.tsx            # Dedicated search interface
│   │   ├── FavoritesScreen.tsx         # Saved properties list
│   │   ├── NotificationsScreen.tsx     # Alerts and updates
│   │   └── SettingsScreen.tsx          # App configuration
│   │
│   ├── 📁 services/                    # External service integrations
│   │   ├── apiService.tsx              # HTTP client and API calls
│   │   ├── storageService.tsx          # AsyncStorage wrapper
│   │   ├── locationService.tsx         # Geolocation services
│   │   ├── mapService.tsx              # Map-related utilities
│   │   ├── notificationService.tsx     # Push notifications
│   │   └── analyticsService.tsx        # Usage tracking and analytics
│   │
│   ├── 📁 types/                       # TypeScript type definitions
│   │   ├── property.ts                 # Property-related types
│   │   ├── user.ts                     # User and auth types
│   │   ├── navigation.ts               # Navigation types
│   │   ├── api.ts                      # API response types
│   │   └── common.ts                   # Shared utility types
│   │
│   ├── 📁 utils/                       # Utility functions
│   │   ├── formatters.tsx              # Data formatting utilities
│   │   ├── validators.tsx              # Input validation
│   │   ├── helpers.tsx                 # General helper functions
│   │   ├── constants.tsx               # App constants
│   │   └── platform.tsx                # Platform-specific utilities
│   │
│   └── 📁 styles/                      # Global styling
│       ├── theme.tsx                   # Design system theme
│       ├── globalStyles.tsx            # Global style definitions
│       └── animations.tsx              # Animation definitions
│
├── 📄 App.tsx                          # Root component with providers
├── 📄 app.json                         # Expo configuration
├── 📄 package.json                     # Dependencies and scripts
├── 📄 babel.config.js                  # Babel configuration
├── 📄 tsconfig.json                    # TypeScript configuration
├── 📄 metro.config.js                  # Metro bundler configuration
├── 📄 .env.example                     # Environment variables template
└── 📄 .gitignore                       # Git ignore rules
```

## Key Architectural Decisions:

### 1. **Feature-Based Organization**
```
features/
├── auth/           # Everything authentication-related
├── listings/       # Property listing management  
├── search/         # Search and filtering
├── profile/        # User profile and settings
└── map/            # Map functionality
```

**Benefits:**
- **Scalability**: New features can be added without disrupting existing structure
- **Maintainability**: Related code is co-located
- **Team Collaboration**: Different teams can work on different features
- **Reusability**: Features can be easily extracted or shared

### 2. **Separation of Concerns**
- **Components**: Pure UI presentation
- **Hooks**: Business logic and state management
- **Services**: External integrations and API calls
- **Utils**: Helper functions and utilities

### 3. **Type Safety**
- Comprehensive TypeScript definitions
- Interface-driven development
- Type-safe navigation and API responses

### 4. **Performance Optimization**
- FlashList for virtualized scrolling
- Custom hooks for optimized re-renders
- Debounced search inputs
- Lazy loading of heavy components

### 5. **Navigation Structure**
```
Bottom Tabs → Stack Navigators → Screens
    ↓              ↓             ↓
  Home       HomeStack        HomeScreen
  Map        MapStack         MapScreen
  Profile    ProfileStack     ProfileScreen
```

This structure provides:
- **Tab-based main navigation**
- **Stack navigation within each tab**
- **Deep linking support**
- **Type-safe navigation parameters**

### 6. **State Management Strategy**
- **React Context** for global state (auth, favorites, theme)
- **Local State** for component-specific state
- **Custom Hooks** for complex state logic
- **AsyncStorage** for persistence

### 7. **Data Layer Architecture**
```
Mock API → Services → Hooks → Components
    ↓         ↓         ↓         ↓
apiMock.ts  apiService  useFetch  PropertyCard
                            ↓
                    useFilterProperties
```

### 8. **Design System Implementation**
```
constants/
├── Colors.tsx      # Design tokens
├── Typography.tsx  # Text styles
├── Layout.tsx      # Spacing and sizing
└── Config.tsx      # App configuration
```

This folder structure follows **industry best practices** for React Native applications and is specifically optimized for:

1. **Real Estate App Complexity** - Handling diverse property types and data
2. **Team Scalability** - Multiple developers can work simultaneously
3. **Feature Growth** - Easy to add new features like mortgages, agents, etc.
4. **Performance** - Optimized for large property datasets
5. **Maintainability** - Clear separation of concerns
6. **Type Safety** - Full TypeScript coverage
7. **Testing Ready** - Easily testable component structure

The structure is **production-ready** and can scale to support millions of properties and users while maintaining excellent developer experience and code quality.