import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isDarkMode, theme } = useTheme();  // Access theme properties

    useEffect(() => {
    }, [isDarkMode]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ThemeWrapper;
