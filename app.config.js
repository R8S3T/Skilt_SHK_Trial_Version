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
      resizeMode: "contain", // native for Android, contain for IOS
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      newArchEnabled: true,
      bundleIdentifier: "com.skilt.shk.trial",
      icon: "./assets/Images/dark_icon.png",
      "splash": {
        "image": "./assets/Images/skilt_logo.png",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      }
    },
    android: {
      package: "com.skilt.shk.trial",
      adaptiveIcon: {
        foregroundImage: "./assets/dark_icon.png",
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
        projectId: "709c4b4b-3466-4884-be1d-0dabaa12b936"
      },
      DATABASE_MODE: process.env.DATABASE_MODE || "production"
    }
  }
};
