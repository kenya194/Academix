const { withAndroidManifest, withAppBuildGradle } = require('@expo/config-plugins');

const withAppAuth = (config) => {
  // First, add the manifest placeholder to build.gradle - FIXED VERSION
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      // Check if defaultConfig already exists
      if (config.modResults.contents.includes('defaultConfig {')) {
        // Add manifestPlaceholders to existing defaultConfig
        config.modResults.contents = config.modResults.contents.replace(
          /defaultConfig\s*{/,
          `defaultConfig {
        manifestPlaceholders = [appAuthRedirectScheme: 'com.astromyllc.academix']`
        );
      } else {
        // Create defaultConfig if it doesn't exist (unlikely but safe)
        config.modResults.contents = config.modResults.contents.replace(
          /android\s*{/,
          `android {
    defaultConfig {
        manifestPlaceholders = [appAuthRedirectScheme: 'com.astromyllc.academix']
    }`
        );
      }
    }
    return config;
  });

  // Then add the intent filter to AndroidManifest - FIXED VERSION
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const application = androidManifest.manifest.application[0];
    
    // Find or create MainActivity
    let mainActivity = application.activity.find(act => 
      act.$['android:name'] === '.MainActivity' || 
      act.$['android:name'] === 'com.astromyllc.academix.MainActivity'
    );
    
    if (!mainActivity) {
      mainActivity = {
        $: { 'android:name': '.MainActivity' },
        'intent-filter': []
      };
      application.activity.push(mainActivity);
    }
    
    if (!mainActivity['intent-filter']) {
      mainActivity['intent-filter'] = [];
    }
    
    // Check if intent filter already exists
    const existingIntentFilter = mainActivity['intent-filter'].find(filter =>
      filter.data && 
      filter.data.some(data => 
        data.$['android:scheme'] === 'com.astromyllc.academix' ||
        data.$['android:scheme'] === '${appAuthRedirectScheme}'
      )
    );
    
    if (!existingIntentFilter) {
      // Add the OAuth redirect intent filter using the placeholder
      mainActivity['intent-filter'].push({
        action: [
          { $: { 'android:name': 'android.intent.action.VIEW' } }
        ],
        category: [
          { $: { 'android:name': 'android.intent.category.DEFAULT' } },
          { $: { 'android:name': 'android.intent.category.BROWSABLE' } }
        ],
        data: [
          { $: { 
            'android:scheme': '${appAuthRedirectScheme}',
            'android:host': 'oauthredirect'
          } }
        ]
      });
    }
    
    return config;
  });

  return config;
};

module.exports = withAppAuth;