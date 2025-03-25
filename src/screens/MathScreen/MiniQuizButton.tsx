import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface MiniQuizButtonProps {
    label: string;
    onPress: () => void;
    disabled: boolean;
}

const MiniQuizButton: React.FC<MiniQuizButtonProps> = ({ label, onPress, disabled }) => {
    return (
        <TouchableOpacity
            style={[styles.button, disabled ? styles.disabledButton : styles.activeButton]}
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
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        alignItems: 'center',
        height: 40,
    },
    activeButton: {
        backgroundColor: '#000000',
    },
    disabledButton: {
        backgroundColor: 'grey',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MiniQuizButton;

