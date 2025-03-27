import 'dotenv/config'; // Load environment variables from .env file

export default {
  expo: {
    name: "Skilt Demoversion",
    slug: "skilt-shk-demo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/Images/skilt_logo.png",
      resizeMode: "native", // native for Android, contain for IOS
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      newArchEnabled: true,
      bundleIdentifier: "com.skilt.shk.trial", // Change for new app project
    },
    android: {
      package: "com.skilt.shk.trial",
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",// Change for new app project
        backgroundColor: "#ffffff"
      },
      permissions: [
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.INTERNET"
      ],
      newArchEnabled: true
    },
    androidStatusBar: {
      hidden: false,
      translucent: true
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    assetBundlePatterns: [
      "assets/fonts/**/*",
      "assets/images/**/*",
      "assets/icons/**/*",
      "assets/*.db"
    ],
    plugins: [
      "expo-font"
    ],
    extra: {
      eas: {
        projectId: "skilt-shk-demo"
      },
      DATABASE_MODE: process.env.DATABASE_MODE || "production"
    }
  }
};
