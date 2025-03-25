import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { screenWidth, scaleFontSize } from 'src/utils/screenDimensions';

interface OptionButtonProps {
    option: string;
    onSelect: (option: string) => void;
    isSelected: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({ option, onSelect, isSelected }) => {
    return (
        <TouchableOpacity
            style={styles.option}
            onPress={() => onSelect(option)}
            disabled={isSelected}
        >
            <Text style={styles.optionText}>
                {isSelected ? '' : option}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    option: {
        backgroundColor: '#2b4353',
        minWidth: screenWidth > 600 ? '90%' : '90%',
        minHeight: screenWidth > 600 ? 100 : 60,
        padding: screenWidth > 600 ? 25 : 15,
        marginVertical: screenWidth > 600 ? 20 : 10,
        marginHorizontal: screenWidth > 600 ? 25 : 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#8fc2c2',
        alignItems: 'center',
    },
    optionText: {
        color: '#FFF',
        fontFamily: 'OpenSans-Regular',
        fontSize: screenWidth > 600 ? 24 : 18,
        textAlign: 'center',
    },
});

export default OptionButton;


