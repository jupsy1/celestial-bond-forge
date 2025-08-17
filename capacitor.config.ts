import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.24f29d05cb864391871d0dd49625b4fb',
  appName: 'celestial-bond-forge',
  webDir: 'dist',
  server: {
    url: 'https://www.starsignstudio.com',  // 👈 your live domain
    cleartext: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
