import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Flashcard from './FlashCard';
import { fetchFlashcardsForChapter } from 'src/database/databaseServices';
import { NavigationProp, RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'src/types/navigationTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadFlashcardProgress, saveFlashcardProgress } from 'src/utils/progressUtils';
import { screenWidth } from 'src/utils/screenDimensions';
import { useTheme } from 'src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const INCORRECT_CARDS_KEY = 'incorrect_cards';

type FlashcardScreenRouteProp = RouteProp<RootStackParamList, 'FlashcardScreen'>;

const FlashcardScreen = () => {
    const route = useRoute<FlashcardScreenRouteProp>();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { chapterId } = route.params;
    const [flashcards, setFlashcards] = useState<{ Question: string; Answer: string }[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [totalCards, setTotalCards] = useState(0);
    const { theme, isDarkMode } = useTheme();

    useLayoutEffect(() => {
        const headerFontSize = screenWidth > 600 ? 28 : 22; // Larger font size for tablets
        const backIconSize = screenWidth > 600 ? 35 : 28; // Larger back icon size for tablets
    
        navigation.setOptions({
            headerTitle: '', // Remove automatic title
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                    }}
                    >
                    <Ionicons
                        name="arrow-back"
                        size={backIconSize}
                        color={theme.primaryText}
                    />
                    <Text
                        style={{
                        color: theme.primaryText,
                        fontSize: headerFontSize,
                        fontWeight: '600', // Bold title text
                        marginLeft: 5, // Spacing between icon and title
                        }}
                    >
                        Lernfelder
                    </Text>
                </TouchableOpacity>
            ),

            headerStyle: {
                backgroundColor: theme.surface,
                elevation: 0, // Remove shadow on Android
                shadowOpacity: 0,
            },
            headerTintColor: theme.primaryText,
        });
    }, [navigation, theme]);

    // Load flashcard progress
    useEffect(() => {
        const getFlashcards = async () => {
            const cards = await fetchFlashcardsForChapter(chapterId);
            setFlashcards(cards);
            setTotalCards(cards.length); // Update total cards here
        };
        getFlashcards();
    }, [chapterId]);

    // handleNextCard to save the current index
    const handleNextCard = () => {
        const newIndex = currentCardIndex + 1;
        setCurrentCardIndex(newIndex);

        // Save the current index after moving to the next card
        saveFlashcardProgress(chapterId, newIndex);
    };

    useEffect(() => {
        const loadProgress = async () => {
            const progress = await loadFlashcardProgress(chapterId);
            setCurrentCardIndex(progress.currentIndex || 0);
            const cards = await fetchFlashcardsForChapter(chapterId);
            setFlashcards(cards);
            setTotalCards(cards.length);
        };
        loadProgress();
    }, [chapterId]);

    const markCardAsCorrect = async () => {
        await saveFlashcardProgress(chapterId, currentCardIndex + 1); // Save progress
        handleNextCard();
    };

    const markCardAsIncorrect = async () => {
        const currentCard = flashcards[currentCardIndex];
        const key = `incorrect_cards_${chapterId}`; // Unique key per chapter

        try {
            const storedCards = await AsyncStorage.getItem(key);
            const incorrectCards = storedCards ? JSON.parse(storedCards) : [];

            // Add card only if it's not already saved
            const exists = incorrectCards.some(
                (savedCard: { question: string; answer: string }) =>
                    savedCard.question === currentCard.Question && savedCard.answer === currentCard.Answer
            );

            if (!exists) {
                incorrectCards.push({ question: currentCard.Question, answer: currentCard.Answer });
                await AsyncStorage.setItem(key, JSON.stringify(incorrectCards));
            }
        } catch (error) {
        }

        await saveFlashcardProgress(chapterId, currentCardIndex + 1);
        handleNextCard();
    };

    const resetChapterCards = () => {
        setCurrentCardIndex(0);
    };

    const repeatIncorrectCards = () => {
        navigation.navigate('FlashCardRepeat', { chapterId });

    };

    useEffect(() => {
        return () => {
            saveFlashcardProgress(chapterId, currentCardIndex);
        };
    }, [currentCardIndex, chapterId]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Sticky Header for "Lernfeld {chapterId}" */}
            <View style={[styles.header, { backgroundColor: theme.surface }]}>
                <Text style={[styles.headerText, { color: theme.primaryText }]}>{`Lernfeld ${chapterId}`}</Text>
            </View>
    
            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {currentCardIndex < totalCards && (
                    <Text
                        style={[
                            styles.counterText,
                            { color: isDarkMode ? '#CCCCCC' : '#333' }, // Bright gray for dark mode, original dark gray for light mode
                        ]}
                    >
                        {`${currentCardIndex + 1} / ${totalCards}`}
                    </Text>
                )}
    
                <View style={styles.contentContainer}>
                    {currentCardIndex < flashcards.length ? (
                        <Flashcard
                            key={currentCardIndex}
                            question={flashcards[currentCardIndex].Question}
                            answer={flashcards[currentCardIndex].Answer}
                            onMarkCorrect={markCardAsCorrect}
                            onMarkIncorrect={markCardAsIncorrect}
                            isAlternateColor={currentCardIndex % 2 === 1}
                        />
                    ) : (
                        <Text style={styles.loadingText}>Keine weiteren Karten</Text>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.reviewButton,
                            {
                                borderColor: isDarkMode ? '#CCCCCC' : '#24527a',
                                backgroundColor: isDarkMode ? 'transparent' : '#f5f5f5',
                            },
                        ]}
                        onPress={resetChapterCards}
                    >
                        <Text
                            style={[
                                styles.buttonContainerText,
                                { color: isDarkMode ? '#CCCCCC' : '#24527a' }, // Use isDarkMode for text color
                            ]}
                        >
                            Alle Karten wiederholen
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.reviewButton,
                            {
                                borderColor: isDarkMode ? '#CCCCCC' : '#24527a',
                                backgroundColor: isDarkMode ? 'transparent' : '#f5f5f5',
                            },
                        ]}
                        onPress={repeatIncorrectCards}
                    >
                        <Text
                            style={[
                                styles.buttonContainerText,
                                { color: isDarkMode ? '#CCCCCC' : '#24527a' },
                            ]}
                        >
                            Nicht-gewusst Karten wiederholen
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: screenWidth > 600 ? 15 : 5,
        alignItems: 'center',
    },
    headerText: {
        fontFamily: 'Lato-Bold',
        fontSize: screenWidth > 600 ? 36 : 24,
    },
    counterText: {
        fontSize: screenWidth > 600 ? 28 : 20,
        color: '#333',
        textAlign: 'center',
        marginTop: screenWidth > 600 ? 25 : 20,
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: screenWidth > 600 ? 600 : 400,
        marginVertical: screenWidth > 600 ? 80 : 60,
    },
    loadingText: {
        fontSize: screenWidth > 600 ? 22 : 18,
        color: '#666',
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: screenWidth > 600 ? 25 : 20,
        alignItems: 'center',
        paddingHorizontal: screenWidth > 600 ? 15 : 10,
    },
    reviewButton: {
        borderColor: '#24527a',
        paddingVertical: screenWidth > 600 ? 16 : 12,
        paddingHorizontal: screenWidth > 600 ? 25 : 20,
        borderRadius: 10,
        borderWidth: 1,
        marginVertical: 10,
        alignItems: 'center',
        width: '80%',
    },
    buttonContainerText: {
        color: '#24527a',
        fontSize: screenWidth > 600 ? 20 : 16,
        textAlign: 'center',
    },
    scrollContent: {
        alignItems: 'center',
        paddingBottom: 10,
    },
});

export default FlashcardScreen;
