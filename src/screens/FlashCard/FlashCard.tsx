import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { screenWidth } from 'src/utils/screenDimensions';
import { useTheme } from 'src/context/ThemeContext';
import { lightenColor } from 'src/components/theme';
import { updateStreak } from 'src/utils/streakUtils';

const Flashcard = ({
    question,
    answer,
    onMarkCorrect,
    onMarkIncorrect,
    onNext,
    isAlternateColor,
    isRepeatMode = false,
}: {
    question: string;
    answer: string;
    onMarkCorrect?: () => void;
    onMarkIncorrect?: () => void;
    onNext?: () => void;
    isAlternateColor: boolean;
    isRepeatMode?: boolean;
}) => {
    const { theme, isDarkMode } = useTheme();

    // Create a slightly lighter background color for dark mode
    const lighterSurface = lightenColor(theme.surface, 10);

    return (
        <View style={styles.cardWrapper}>
            <FlipCard
                style={styles.flipCard}
                flipHorizontal
                flipVertical={false}
                clickable
            >
                {/* Front side of the card */}
                <View
                    style={[
                        styles.front,
                        isAlternateColor
                            ? { borderColor: isDarkMode ? '#525C6B' : styles.alternateBorder.borderColor }
                            : { borderColor: isDarkMode ? '#3E4653' : styles.defaultBorder.borderColor },
                    ]}
                >
                    <Text style={[styles.questionText, { color: theme.primaryText }]}>
                        {question}
                    </Text>
                </View>
    
                {/* Back side of the card */}
                <View
                    style={[
                        styles.back,
                        isAlternateColor
                            ? { backgroundColor: isDarkMode ? '#636F81' : styles.alternateBack.backgroundColor } // Dark mode: lighter blue-gray, light mode: original alternate back color
                            : { backgroundColor: isDarkMode ? '#454D5A' : styles.defaultBack.backgroundColor }, // Dark mode: soft gray, light mode: original default back color
                    ]}
                >
                    <View
                        style={[
                            styles.answerBox,
                            { backgroundColor: isDarkMode ? theme.surface : '#ffffff' },
                        ]}
                    >
                        <Text style={[styles.answerText, { color: theme.secondaryText }]}>
                            {answer}
                        </Text>
                    </View>
    
                    {isRepeatMode ? (
                        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
                            <Text style={styles.buttonText}>Weiter</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.incorrectButton,
                                    { backgroundColor: isDarkMode ? '#5585b5' : '#f46134' },
                                ]}
                                onPress={async () => {
                                    if (onMarkIncorrect) onMarkIncorrect();
                                    await updateStreak('flashcard'); // Streak für Lernkarten aktualisieren
                                }}
                            >
                                <Text style={styles.buttonText}>Wusste ich nicht</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.correctButton,
                                    { backgroundColor: isDarkMode ? '#f46134' : '#385170' },
                                ]}
                                onPress={async () => {
                                    if (onMarkCorrect) onMarkCorrect();
                                    await updateStreak('flashcard'); // Streak für Lernkarten aktualisieren
                                }}
                            >
                                <Text style={styles.buttonText}>Gewusst</Text>
                            </TouchableOpacity>

                        </View>
                    )}
                </View>
            </FlipCard>
        </View>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        width: screenWidth > 600 ? 450 : 400,
        height: screenWidth > 600 ? 550 : 500,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flipCard: {
        width: screenWidth > 600 ? 450 : 380,
        height: screenWidth > 600 ? 550 : 480,
    },
    front: {
        width: '100%',
        height: '100%',
        borderWidth: 18,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    defaultBorder: {
        borderColor: '#85a6b1',
    },
    alternateBorder: {
        borderColor: '#77628c',
    },
    back: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    defaultBack: {
        backgroundColor: '#85a6b1',
    },
    alternateBack: {
        backgroundColor: '#77628c',
    },
    questionText: {
        fontFamily: 'Lato-Bold',
        fontSize: screenWidth > 600 ? 28 : 22,
        textAlign: 'center',
        paddingHorizontal: screenWidth > 600 ? 10 : 8,
        lineHeight: 30,

    },
    answerBox: {
        width: '95%',
        height: '65%',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        padding: screenWidth > 600 ? 15 : 5,
        marginBottom: screenWidth > 600 ? 30 : 25,
    },
    answerText: {
        fontFamily: 'OpenSans-Semibold',
        fontSize: screenWidth > 600 ? 22 : 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
    },
    incorrectButton: {
        paddingVertical: screenWidth > 600 ? 20 : 10,
        paddingHorizontal: screenWidth > 600 ? 25 : 20,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    correctButton: {
        paddingVertical: screenWidth > 600 ? 20 : 10,
        paddingHorizontal: screenWidth > 600 ? 25 : 20,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    nextButton: {  // Add this style for the "Weiter" button
        backgroundColor: '#385170',
        padding: 10,
        borderRadius: 5,
        width: '50%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: screenWidth > 600 ? 18 : 16,
    },
});

export default Flashcard;
