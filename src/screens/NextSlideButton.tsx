import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from 'src/context/ThemeContext';
import { screenWidth } from 'src/utils/screenDimensions';

interface NextSlideButtonProps {
    onPress: () => void;
    isActive: boolean;
    style?: StyleProp<ViewStyle>;
    label?: string;
}

const NextSlideButton: React.FC<NextSlideButtonProps> = ({ onPress, isActive, style, label = 'Weiter' }) => {
    const { theme, isDarkMode } = useTheme(); 
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.button,
                {
                    backgroundColor: isActive
                        ? '#e8630a' // Updated active color
                        : isDarkMode
                        ? '#444444' // Muted inactive color in dark mode
                        : 'gray', // Muted inactive color in light mode
                },
                style,
            ]}
            disabled={!isActive}
        >
            <Text
                style={[
                    styles.text,
                    {
                        color: isDarkMode ? '#E0E0E0' : 'white',
                        fontSize: screenWidth > 600 ? 20 : 18, 
                    },
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>


    );
};

const styles = StyleSheet.create({
    button: {
        minWidth: 100,
        paddingVertical: screenWidth > 600 ? 15 : 10,
        paddingHorizontal: screenWidth > 600 ? 20 : 10,
        borderRadius: 5,
        alignSelf: 'center',
        marginVertical: 20,
    },
    active: {
        backgroundColor: '#343A40',
    },
    inactive: {
        backgroundColor: 'gray',
    },
    text: {
        textAlign: 'center',
    },
});

export default NextSlideButton;

