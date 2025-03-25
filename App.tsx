import React, { useEffect, useState } from "react";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from "src/navigation/AppNavigator";
import { loadFonts } from "src/utils/fonts";
import { ActivityIndicator, Text, Button, View, StyleSheet } from "react-native";
import { ThemeProvider } from "src/context/ThemeContext";
import { initializeDatabase } from "src/database/initializeLocalDatabase";
import { fetchVersionNumber } from "src/database/initializeLocalDatabase";
import { DATABASE_MODE } from "@env";
import { SafeAreaView } from 'react-native-safe-area-context';


const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbVersion, setDbVersion] = useState<number | null>(null);

  // Prepare the app
  const prepare = async () => {
    try {
      // Clear previous errors
      setError(null);

      // Load fonts
      await loadFonts();

      // Initialize the database
      await initializeDatabase();

      // Fetch the database version
      const version = await fetchVersionNumber();
      console.log("Database Version Retrieved:", version);
      setDbVersion(version); // Save version to state

      // Mark app as ready
      setIsReady(true);
    } catch (e) {
  
    }
  };

  useEffect(() => {
    prepare(); // Call the prepare function on mount
  }, []);

  if (!isReady) {
    return (
      <View style={styles.container}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Button
              title="Retry"
              onPress={prepare} // Reuse the prepare function
            />
          </View>
        ) : (
          <ActivityIndicator size="large" />
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  versionText: {
    position: "absolute",
    bottom: 10,
    left: 10,
    fontSize: 14,
    color: "gray",
  },
});

export default App;