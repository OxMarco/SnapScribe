import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "pics.snapscrie",
  appName: "SnapScribe",
  webDir: "dist",
  plugins: {
    LiveUpdates: {
      appId: '36ebbe0a',
      channel: 'Production',
      autoUpdateMethod: 'background',
      maxVersions: 2
    }
  }
};

export default config;
