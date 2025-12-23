// app.config.js (Simplified and Cleaned Version)

module.exports = {
  expo: {
    "name": "Apna Ghar Apni Zameen",
    "slug": "apaz",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/logo_agaz.jpg",
    "scheme": "apaz",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "Apna.Ghar.Apni.Zameen",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/logo_agaz.jpg",
        "backgroundImage": "./assets/images/logo_agaz.png",
        "monochromeImage": "./assets/images/logo_agaz.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": true,
      "package": "com.agaz.apaz",
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
      "favicon": "./assets/images/logo_agaz.png"
    },
    // Keep your original, non-AR related plugins
    "plugins": [
      "expo-router",
      "./withAROptional",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/logo_agaz.jpg",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      "expo-web-browser"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "e871bd0b-bc88-4eeb-bc30-1e24aa621ad4"
      }
    },
    "owner": "agaz",
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/e871bd0b-bc88-4eeb-bc30-1e24aa621ad4"
    }
  }
};