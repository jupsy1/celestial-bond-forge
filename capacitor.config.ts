import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.24f29d05cb864391871d0dd49625b4fb',
  appName: 'celestial-bond-forge',
  webDir: 'dist',
  server: {
    url: 'https://24f29d05-cb86-4391-871d-0dd49625b4fb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;