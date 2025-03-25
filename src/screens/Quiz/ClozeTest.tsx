import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import ControlButtons from './ControlButtons';
import SentenceWithBlanks from './SentenceWithBlanks';
import OptionButton from './OptionButton';
import { Quiz, AnswerStatus } from 'src/types/contentTypes';
import { screenWidth, scaleFontSize } from 'src/utils/screenDimensions';

interface ClozeTestProps {
    quiz: Quiz;
    options: string[];
    correctAnswers: (string | null)[];
    onAnswerSubmit: (isCorrect: boolean) => void;
    onContinue: () => void;
}

const ClozeTest: React.FC<ClozeTestProps> = ({ quiz, options, correctAnswers, onAnswerSubmit, onContinue }) => {
    // Split the question into parts for the blanks
    const sentenceParts = useMemo(() => quiz.Question.split('_'), [quiz.Question]);

    const [selectedOptions, setSelectedOptions] = useState<AnswerStatus[]>(
        Array(sentenceParts.length - 1).fill({ answer: null, isCorrect: null })
    );
    const [submitButtonText, setSubmitButtonText] = useState('Bestätigen');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [answerFeedback, setAnswerFeedback] = useState<string | null>(null);

    useEffect(() => {
        // Reset state when a new quiz is loaded
        setSelectedOptions(Array(sentenceParts.length - 1).fill({ answer: null, isCorrect: null }));
        setSubmitButtonText('Bestätigen');
        setIsButtonDisabled(true);
    }, [sentenceParts]);

    const handleOptionSelect = (option: string) => {
        const newSelectedOptions = [...selectedOptions];
        const emptyIndex = newSelectedOptions.findIndex(opt => opt.answer === null);
        if (emptyIndex !== -1) {
            newSelectedOptions[emptyIndex] = { answer: option, isCorrect: null };
            setSelectedOptions(newSelectedOptions);
            setIsButtonDisabled(false);
        }
    };

    const handleSubmit = () => {
        if (submitButtonText === 'Weiter') {
            onAnswerSubmit(true);
            onContinue();
            return;
        }

        // Check correctness for each blank individually
        const newSelectedOptions = selectedOptions.map((opt, index) => ({
            ...opt,
            isCorrect: opt.answer === correctAnswers[index],
        }));

        setSelectedOptions(newSelectedOptions);

        // Determine overall correctness
        const isOverallCorrect = newSelectedOptions.every(opt => opt.isCorrect);

        if (isOverallCorrect) {
            setSubmitButtonText('Weiter');
            setAnswerFeedback('Richtig! Gut gemacht.');
        } else {
            setAnswerFeedback('Falsch. Bitte überprüfe deine Antworten.');
        }

        setIsButtonDisabled(!isOverallCorrect);
    };

    const handleClear = () => {
        const lastFilledIndex = selectedOptions.findIndex(opt => opt.answer !== null);
        if (lastFilledIndex !== -1) {
            const newSelectedOptions = [...selectedOptions];
            newSelectedOptions[lastFilledIndex] = { answer: null, isCorrect: null };
            setSelectedOptions(newSelectedOptions);
            setSubmitButtonText('Bestätigen');
            setIsButtonDisabled(true);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.sentenceContainer}>
                <SentenceWithBlanks
                    sentenceParts={sentenceParts}
                    filledAnswers={selectedOptions}
                />
            </View>
            <View style={styles.optionsContainer}>
                {options.map((option, idx) => (
                    <OptionButton
                        key={idx}
                        option={option}
                        onSelect={() => handleOptionSelect(option)}
                        isSelected={selectedOptions.some(opt => opt.answer === option)}
                    />
                ))}
            </View>
            {/* Feedback Container*/}
            <View style={styles.feedbackContainer}>
                {answerFeedback && <Text style={styles.answerFeedback}>{answerFeedback}</Text>}
            </View>
            <ControlButtons
                onSubmit={handleSubmit}
                onClear={handleClear}
                onContinue={onContinue} // Ensure this is passed
                submitButtonText={submitButtonText}
                disabled={isButtonDisabled}
                showBackspaceButton={true} // Ensure this is passed
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: screenWidth > 600 ? 15 : 5,
        backgroundColor: '#2b4353',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        marginVertical: screenWidth > 600 ? 50 : 30,
        padding: screenWidth > 600 ? 15 : 10,
    },
    sentenceContainer: {
        marginBottom: screenWidth > 600 ? 50 : 15,
    },
/*     controlButtonsContainer: {
        marginTop: screenWidth > 600 ? 60 : 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    }, */
    feedbackContainer: {
        height: screenWidth > 600 ? 100 : 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 0,
    },
    answerFeedback: {
        color: '#FFF',
        fontSize: screenWidth > 600 ? 22 : 18,
        textAlign: 'center',
        marginVertical: screenWidth > 600 ? 20 : 4,
        fontWeight: 'bold',
    },
});


export default ClozeTest;
