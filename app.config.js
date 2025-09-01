const { withAndroidManifest } = require('@expo/config-plugins');

// Define the plugin inline
const withAppAuth = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    
    const application = androidManifest.manifest.application[0];
    
    // Add the appAuthRedirectScheme meta-data
    if (!application['meta-data']) {
      application['meta-data'] = [];
    }
    
    application['meta-data'].push({
      $: {
        'android:name': 'appAuthRedirectScheme',
        'android:value': 'com.astromyllc.academix'
      }
    });
    
    return config;
  });
};

module.exports = {
  expo: {
    name: "Academix",
    slug: "Academix",
    owner: "astromyllc",
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
      "supportsTablet": true,
      "jsEngine": "hermes",
      "bundleIdentifier": "com.astromyllc.academix",
      "infoPlist": {
        "CFBundleURLTypes": [
          {
            "CFBundleURLSchemes": ["com.astromyllc.academix"]
          }
        ],
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    android: {
      package: "com.astromyllc.academix",
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
      manifestPlaceholders: {
        appAuthRedirectScheme: "com.astromyllc.academix"
      },
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
      withAppAuth // Add the plugin here
    ],
    runtimeVersion: {
      policy: "sdkVersion"
    },
    extra: {
      eas: {
        "projectId": "27f28cea-8c7d-4059-b312-150b61f7f1b6"
      }
    }
  }
};