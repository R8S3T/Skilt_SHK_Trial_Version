import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Flashcard from './FlashCard';
import {  saveFlashcardProgress } from 'src/utils/progressUtils';
import { RootStackParamList } from 'src/types/navigationTypes';
import { useTheme } from 'src/context/ThemeContext';
import { screenWidth } from 'src/utils/screenDimensions';

type FlashCardRepeatRouteProp = RouteProp<RootStackParamList, 'FlashCardRepeat'>;

const FlashCardRepeat = () => {
    const route = useRoute<FlashCardRepeatRouteProp>();
    const navigation = useNavigation();
    const { theme, isDarkMode } = useTheme();
    const chapterId = route.params?.chapterId ?? 0;
    const [incorrectCards, setIncorrectCards] = useState<{ question: string; answer: string }[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [totalCards, setTotalCards] = useState(0);

    const PROGRESS_KEY = `flashcard_repeat_progress_${chapterId}`;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                    }}
                >
                    <Ionicons
                        name="close"
                        size={screenWidth > 600 ? 30 : 24}
                        color={theme.primaryText}
                    />
                </TouchableOpacity>
            ),
            title: `Lernfeld ${chapterId} wiederholen`,
            headerStyle: {
                backgroundColor: theme.surface,
            },
            headerTitleStyle: {
                color: theme.primaryText,
                fontSize: screenWidth > 600 ? 24 : 20, // Größere Schrift für Tablets
                fontWeight: '600',
            },
            headerTitleAlign: 'center',
        });
    }, [navigation, chapterId, theme]);


    // Load incorrect cards and progress
    useEffect(() => {
        const loadIncorrectCards = async () => {
            const key = `incorrect_cards_${chapterId}`;
            const storedCards = await AsyncStorage.getItem(key);
            if (storedCards) {
                const parsedCards = JSON.parse(storedCards);
                setIncorrectCards(parsedCards);
                setTotalCards(parsedCards.length); // Set totalCards based on initial load only
                setCurrentCardIndex(0);  // Reset to the start
            }
        };
        loadIncorrectCards();
    }, [chapterId]);

    const handleNextCard = async () => {
        const nextIndex = currentCardIndex + 1;
        if (nextIndex < incorrectCards.length) {
            setCurrentCardIndex(nextIndex);
        } else {
            // No more cards left
            setIncorrectCards([]); // Clear the incorrectCards array
            setCurrentCardIndex(0); // Reset index
            // Optionally, clear stored incorrect cards
            await AsyncStorage.removeItem(`incorrect_cards_${chapterId}`);
        }

        await saveFlashcardProgress(PROGRESS_KEY, currentCardIndex);
    };

    const currentCard = incorrectCards[currentCardIndex];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {incorrectCards.length > 0 && (
            <Text
                style={[
                    styles.counterText,
                    {
                        fontSize: screenWidth > 600 ? 22 : 18, // Größerer Text für Tablets
                        top: screenWidth > 600 ? 30 : 20, // Höher für Tablets
                        color: isDarkMode ? '#CCCCCC' : theme.primaryText,
                    },
                ]}
            >
                {`${currentCardIndex + 1} / ${totalCards}`}
            </Text>
            )}

            <View style={styles.contentContainer}>
                {incorrectCards.length > 0 && currentCard ? (
                    <Flashcard
                        key={`${currentCardIndex}-${Date.now()}`}
                        question={currentCard.question}
                        answer={currentCard.answer}
                        onNext={handleNextCard}  // Pass only "Weiter" button in repeat mode
                        isAlternateColor={currentCardIndex % 2 === 1}
                        isRepeatMode={true}
                    />
                ) : (
                    <Text style={[styles.loadingText, { color: theme.secondaryText }]}>
                        Keine Karten zum Wiederholen.
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    closeButton: {
        marginLeft: 15,
    },
    counterText: {
        position: 'absolute',
        top: 20,
        fontSize: screenWidth > 600 ? 28 : 20,
        color: '#333',
        textAlign: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 400,
    },
    loadingText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
});


export default FlashCardRepeat;

