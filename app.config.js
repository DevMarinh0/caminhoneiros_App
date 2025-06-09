export default {
  name: 'Caminhoneiros App',
  slug: 'caminhoneiros-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'caminhoneirosapp',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#78BBFF'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#78BBFF'
    },
    permissions: [
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ]
  },
  web: {
    bundler: 'metro',
    favicon: './assets/images/favicon.png'
  },
  plugins: [
    'expo-router'
  ],
  extra: {
    apiUrl: process.env.API_URL || 'http://192.168.0.25:3333',
    eas: {
      projectId: "your-project-id"
    }
  },
};