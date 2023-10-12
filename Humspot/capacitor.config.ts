import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hum-spot',
  appName: 'Humspot',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "598830997052-ocvgr72soka88ocpidvi3neu0ho6c819.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
