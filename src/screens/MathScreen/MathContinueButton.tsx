import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { screenWidth } from 'src/utils/screenDimensions';

interface ContinueButtonProps {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    style?: any;
    isDarkMode?: boolean;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ label, onPress, disabled = false, style, isDarkMode }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                disabled
                    ? { backgroundColor: isDarkMode ? '#555555' : 'grey' }
                    : styles.activeButton,
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={styles.buttonText}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: screenWidth > 600 ? 20 : 10, 
        paddingVertical: screenWidth > 600 ? 12 : 8, 
        paddingHorizontal: screenWidth > 600 ? 20 : 12,
        borderRadius: 5,
        alignItems: 'center',
        height: screenWidth > 600 ? 60 : 40,
    },
    activeButton: {
        backgroundColor: '#e8630a',
    },
    buttonText: {
        color: 'white',
        fontSize: screenWidth > 600 ? 22 : 18,
    },
});

export default ContinueButton;
