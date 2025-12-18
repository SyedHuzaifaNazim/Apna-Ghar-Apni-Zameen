const { withAndroidManifest } = require('@expo/config-plugins');

const withAROptional = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application[0];

    // Ensure meta-data exists
    if (!mainApplication['meta-data']) {
      mainApplication['meta-data'] = [];
    }

    // Find existing AR Core entry
    const arCoreMetadataIndex = mainApplication['meta-data'].findIndex(
      (item) => item.$['android:name'] === 'com.google.ar.core'
    );

    // If it exists, update it. If not, add it as optional.
    if (arCoreMetadataIndex > -1) {
      mainApplication['meta-data'][arCoreMetadataIndex].$['android:value'] = 'optional';
    } else {
      mainApplication['meta-data'].push({
        $: {
          'android:name': 'com.google.ar.core',
          'android:value': 'optional',
        },
      });
    }

    return config;
  });
};

module.exports = withAROptional;