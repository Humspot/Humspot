import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.humspot',
  appName: 'Humspot',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  // loggingBehavior: 'debug',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: "#7DBBA4AA",
      splashFullScreen: true,
      splashImmersive: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
