import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Using Ionicons from Expo
import { RootStackParamList } from 'src/types/navigationTypes';
import { useTheme } from 'src/context/ThemeContext';
import { screenWidth } from 'src/utils/screenDimensions';

interface FlashcardsSectionProps {
    onButtonPress: (title: string) => void;
}

const FlashcardsSection: React.FC<FlashcardsSectionProps> = ({ onButtonPress }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { theme, isDarkMode } = useTheme();

    const handlePress = () => {
        onButtonPress("Lernkarten pressed");
        navigation.navigate('FlashCardChapters');
    };

    return (
        <TouchableOpacity onPress={handlePress} style={[styles.container, { backgroundColor: theme.background }]}
>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.primaryText }]}>Lernkarten</Text>
                <Ionicons
                    name="book-outline"
                    size={screenWidth > 600 ? 60 : 40}
                    color={theme.primaryText} 
                    style={styles.icon} />
            </View>
            <Text style={[styles.subheader, { color: theme.secondaryText }]}>Teste dein Wissen hier</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#eeeeee',
        width: screenWidth > 600 ? '95%' : '90%',
        height: screenWidth > 600 ? 200 : 120,
        borderColor: '#497285',
        borderWidth: 1,
        borderRadius: 8,
        padding: screenWidth > 600 ? 30 : 20,
        marginVertical: screenWidth > 600 ? 15 : 10,
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: screenWidth > 600 ? 24 : 20,
        fontWeight: '600',
    },
    icon: {
        marginRight: 10,
    },
    subheader: {
        marginTop: 8,
        fontSize: screenWidth > 600 ? 22 : 18,
        color: '#4a4a4a',
    },
});

export default FlashcardsSection;
