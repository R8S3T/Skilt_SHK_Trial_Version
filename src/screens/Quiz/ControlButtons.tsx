import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { screenWidth, scaleFontSize } from 'src/utils/screenDimensions';

interface ControlButtonsProps {
    onClear: () => void;
    onSubmit: () => void;
    onContinue: () => void;
    showBackspaceButton: boolean;
    submitButtonText?: string;
    disabled: boolean;
    showClearButton?: boolean;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
    onClear,
    onSubmit,
    onContinue,
    showBackspaceButton = true,
    submitButtonText = "Bestätigen",
    disabled,
    showClearButton = true,
}) => {
    return (
        <View style={styles.buttonContainer}>
            {showClearButton && showBackspaceButton && (
                <TouchableOpacity onPress={onClear}>
                    <Image
                        source={require('../../../assets/Images/backspace.png')}
                        style={styles.backspaceIcon}
                    />
                </TouchableOpacity>
            )}
            <TouchableOpacity
                style={[styles.submitButton, disabled && styles.disabledButton]}
                onPress={submitButtonText === 'Weiter' ? onContinue : onSubmit}
                disabled={disabled}
            >
                <Text style={styles.submitButtonText}>{submitButtonText}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginTop: screenWidth > 600 ? 25 : 20,
        gap: 20,
    },
    backspaceIcon: {
        width: screenWidth > 600 ? 40 : 30, // Larger for tablets
        height: screenWidth > 600 ? 40 : 30, // Larger for tablets
        margin: 10,
        marginRight: screenWidth > 600 ? 60 : 50, // Adjust margin for tablets
        tintColor: '#e8630a',
    },

    submitButton: {
        backgroundColor: '#2b4353',
        borderWidth: 1,
        borderColor: '#e8630a',
        paddingVertical: screenWidth > 600 ? 20 : 15,
        paddingHorizontal: screenWidth > 600 ? 25 : 20,
        borderRadius: 5,
    },
    submitButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: screenWidth > 600 ? 20 : 16,
    },
    disabledButton: {
        backgroundColor: '#d3d3d3',
        borderColor: '#a9a9a9'
    },
});

export default ControlButtons;

