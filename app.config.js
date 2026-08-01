// app.config.js (Simplified and Cleaned Version)

module.exports = {
  expo: {
    "name": "Farsh e Zameen",
    "slug": "farshezameen",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "farshezameen",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.farshezameen.app",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false,
        "NSLocationWhenInUseUsageDescription": "Farsh e Zameen uses your location to show nearby properties and center the map on you."
      }
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#2F7A34",
        "foregroundImage": "./assets/images/adaptive-icon-foreground.png",
        "monochromeImage": "./assets/images/adaptive-icon-foreground.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": true,
      "package": "com.farshezameen.app",
      "permissions": [
        "CAMERA",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ],
      // ENSURE NO "metaData" BLOCK IS PRESENT HERE!
      "UserCleartextTraffic": true
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/icon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/adaptive-icon-foreground.png",
          "imageWidth": 180,
          "resizeMode": "contain",
          "backgroundColor": "#276A2C",
          "dark": {
            "backgroundColor": "#276A2C"
          }
        }
      ],
      "expo-web-browser",
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Farsh e Zameen uses your location to show nearby properties and center the map on you."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "Farsh e Zameen uses your photo library so you can add photos to your property listings.",
          "cameraPermission": "Farsh e Zameen uses your camera so you can photograph a property to list it."
        }
      ],
      [
        "react-native-maps",
        {
          // Set GOOGLE_MAPS_API_KEY in the root .env (NOT prefixed with EXPO_PUBLIC_ —
          // this is read here at build time, not bundled into the JS).
          // Native maps render blank without a valid key restricted to this app's
          // package name (Android) / bundle id (iOS) in Google Cloud Console.
          "androidGoogleMapsApiKey": process.env.GOOGLE_MAPS_API_KEY,
          "iosGoogleMapsApiKey": process.env.GOOGLE_MAPS_API_KEY
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "owner": "syed-huzaifa-nazim",
    "extra": {
      "router": {},
      "eas": {
        "projectId": "3469a3fe-b56f-40e6-adf7-681b6416aaf3"
      }
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/3469a3fe-b56f-40e6-adf7-681b6416aaf3"
    }
  }
};