import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "xyz.snapscrie",
  appName: "SnapScribe",
  webDir: "dist",
  plugins: {
    LiveUpdates: {
      appId: "36ebbe0a",
      channel: "Production",
      autoUpdateMethod: "background",
      maxVersions: 2,
    },
    CapacitorHttp: {
      enabled: true
    },
  },
};

export default config;
