const withAppAuth = require('./plugins/withAppAuth');

module.exports = {
  expo: {
    name: "Academix",
    slug: "Academix",
    owner: "astromy_admin",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    scheme: "com.astromyllc.academix",
    jsEngine: "jsc",
    splash: {
      image: "./assets/icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    platforms: ["ios", "android", "web"],
    ios: {
      supportsTablet: true,
      jsEngine: "hermes",
      bundleIdentifier: "com.astromyllc.academix",
      buildNumber: "1.0.2", 
      infoPlist: {
        // PURPOSE STRINGS (REQUIRED for permissions)
        NSCameraUsageDescription: "This app uses the camera to capture pictures to replace the user profile picture of users.",
        NSPhotoLibraryUsageDescription: "This app needs access to your photo library so you can choose a profile picture or upload media.",

        // DEEP LINKING (Equivalent to Android's intentFilters)
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: ["com.astromyllc.academix"] // Your custom scheme
            // Note: For deep linking, you usually use a reverse domain OR a simple name.
            // Using your full bundle ID as a scheme is unusual but technically possible.
            // You might want to change this to just "academix" for simplicity.
          }
        ],
        LSApplicationQueriesSchemes: ["https"], // Often needed if you link to websites

        // OTHER COMMON SETTINGS
        ITSAppUsesNonExemptEncryption: false, // Required if you use any encryption
        UIBackgroundModes: [] // You likely don't need this unless you play audio in the background, etc.
      }
    },
    android: {
      package: "com.astromyllc.academix",
      versionCode: 1,
      versionName: "1.0.2",
      permissions: [
        "android.permission.INTERNET",
        "android.permission.CAMERA",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_MEDIA_VIDEO",
        "android.permission.READ_MEDIA_AUDIO",
        "android.permission.READ_EXTERNAL_STORAGE"
      ],
      usesFeatures: [
        {
          name: "android.hardware.camera",
          required: false
        }
      ],
      intentFilters: [
        {
          action: "VIEW",
          data: [
            {
              scheme: "com.astromyllc.academix",
              host: "oauthredirect"
            }
          ],
          category: ["BROWSABLE", "DEFAULT"]
        }
      ]
    },
    plugins: [
      "expo-secure-store",
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static"
          }
        }
      ],
      "expo-asset",
      "expo-web-browser",
      withAppAuth 
    ],
    runtimeVersion: {
      policy: "sdkVersion"
    },
    extra: {
      eas: {
        projectId: "27f28cea-8c7d-4059-b312-150b61f7f1b6"
      }
    }
  }
};