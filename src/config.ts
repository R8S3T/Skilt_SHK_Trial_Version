import Constants from "expo-constants";

export const databaseMode = Constants.manifest.extra.DATABASE_MODE || "production";

console.log("Datenbankmodus:", databaseMode);
