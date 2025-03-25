import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { imageMap } from 'src/utils/imageMappings';
import { scaleFontSize } from 'src/utils/screenDimensions';
import ControlButtons from './ControlButtons';
import { useMathSubchapter } from '../../context/MathSubchapterContext';
import { screenWidth } from 'src/utils/screenDimensions';

interface MathMiniQuiz {
    Question: string;
    ContentId: number;
    Options: string[];
    Answer: string[];
    Image?: string;
}

interface MathQuizSlideProps {
    quiz: MathMiniQuiz;
    onQuizComplete: (isCorrect: boolean) => void;
    onNextSlide: () => void;
    isLast: boolean;
}

// Utility function to parse the Answer field
const parseAnswer = (answer: string | string[]): string[] => {
    if (Array.isArray(answer)) {
        return answer; // Already a valid array
    }
    try {
        // Parse stringified JSON array into a proper array
        return JSON.parse(answer);
    } catch (error) {
        return []; // Return an empty array if parsing fails
    }
};

const MathQuizSlide: React.FC<MathQuizSlideProps> = ({ quiz, onQuizComplete, onNextSlide, isLast }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const { markMathQuizAsFinished } = useMathSubchapter();

    const handleAnswerSubmit = async () => {
        if (selectedOption) {
            setIsSubmitted(true);
            const normalize = (text: string) => text.trim().toLowerCase();
            const parsedAnswers = parseAnswer(quiz.Answer);
            const isCorrect = parsedAnswers.some(answer => normalize(answer) === normalize(selectedOption));

            if (isCorrect) {
                setIsAnswerCorrect(true);
                await markMathQuizAsFinished(quiz.ContentId);
            } else {
                setIsAnswerCorrect(false);
            }
        }
    };

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option); // Update the selected option
        setIsSubmitted(false);
    };

    const getButtonStyle = (option: string) => {
        let style = styles.optionButton;

        if (isSubmitted) {
            // Feedback is only shown after submission
            if (selectedOption === option) {
                if (quiz.Answer.includes(option)) {
                    style = { ...style, borderColor: '#32CD32', borderWidth: 4 }; // Green for correct
                } else {
                    style = { ...style, borderColor: '#FF6347', borderWidth: 4 }; // Red for incorrect
                }
            }
        } else if (selectedOption === option) {
            // Highlight the selected option before submission
            style = { ...style, borderColor: '#b8e1dd', borderWidth: 3 }; // Light blue border
        }

        return style;
    };

    const renderOptions = () => {
        // Ensure quiz.Options is an array and iterate over it
        return quiz.Options.map((option: string, index: number) => (
            <TouchableOpacity
                key={index}
                style={getButtonStyle(option)} // Determine the button style based on the selected option
                onPress={() => handleOptionSelect(option)} // Handle option selection
            >
                <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
        ));
    };
    
    const renderImage = () => {
        if (quiz.Image) {
            const imageSource = imageMap[quiz.Image as keyof typeof imageMap];
            if (imageSource) {
                return <Image source={imageSource} style={styles.quizImage} />;
            }
        }
        return null;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>

                <View style={styles.questionContainer}>
                    <Text style={styles.questionText}>{quiz.Question}</Text>
                </View>


                <View style={styles.imageContainer}>
                    {renderImage()}
                </View>


                <View style={styles.answerContainer}>
                    {renderOptions()}
                    {isAnswerCorrect !== null && (
                        <Text style={styles.feedbackText}>
                            {isAnswerCorrect ? 'Richtig!' : 'Falsch, bitte versuche es nochmal.'}
                        </Text>
                    )}
                </View>
                <ControlButtons
                    onClear={() => {
                        setSelectedOption(null);
                        setIsSubmitted(false); // Reset submission state
                        setIsAnswerCorrect(null); // Reset the correctness state
                    }}
                    onSubmit={handleAnswerSubmit}
                    onContinue={() => {
                        onQuizComplete(true);
                        onNextSlide();
                    }}
                    submitButtonText={isSubmitted ? (isAnswerCorrect ? 'Weiter' : 'Bestätigen') : 'Bestätigen'}
                    disabled={selectedOption === null || (isSubmitted && !isAnswerCorrect)}
                    showClearButton={!isSubmitted} // Clear button shown only if not yet submitted
                    showBackspaceButton={false}
                />
        </ScrollView>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: screenWidth > 600 ? 50 : 40,
        backgroundColor: '#3a7563',
    },
    questionContainer: {
        marginTop: screenWidth > 600 ? 70 : 40,
        alignItems: 'center',
    },
    questionText: {
        fontFamily: 'Lato-Bold',
        fontSize: scaleFontSize(16),
        textAlign: 'center',
        color: '#FFF',
        lineHeight: screenWidth > 600 ? 50 : 30,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    answerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    optionButton: {
        backgroundColor: 'transparent',
        borderColor: '#b8e1dd',
        borderWidth: 1,
        padding: screenWidth > 600 ? 25 : 15,
        marginVertical: screenWidth > 600 ? 20 : 10,
        width: '80%',
        borderRadius: 5,
        alignItems: 'center',
    },
    optionText: {
        color: '#fff',
        fontSize: screenWidth > 600 ? 22 : 18,
    },
    correctOption: {
        backgroundColor: '#32CD32',
    },
    incorrectOption: {
        backgroundColor: '#FF6347',
    },
    quizImage: {
        width: 350,
        height: 200,
        resizeMode: 'contain',
        marginTop: 10,
    },
    feedbackText: {
        fontSize: 18,
        marginVertical: 10,
        color: '#FFF',
    },
    submitButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '80%',
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    continueButton: {
        backgroundColor: '#008CBA',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        width: '80%',
        alignItems: 'center',
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});


export default MathQuizSlide;
