// ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, lightenColor } from 'src/components/theme';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    theme: typeof lightTheme;
    fontSize: number;
    setFontSize: (size: number) => void;
    lightenColor: (color: string, percent: number) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<number>(16);

    // Lade Dark Mode Einstellung aus AsyncStorage
    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('darkMode');
            if (savedTheme !== null) {
                setIsDarkMode(savedTheme === 'true');
            }
        };
        loadTheme();
    }, []);

    // Speichere Dark Mode Einstellung in AsyncStorage
    const toggleDarkMode = async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        await AsyncStorage.setItem('darkMode', newMode.toString());
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ 
            isDarkMode, 
            toggleDarkMode, 
            theme, 
            fontSize, 
            setFontSize,
            lightenColor,
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
