import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import MultipleChoice from './MultipleChoice';
import ClozeTest from './ClozeTest';
import { fetchQuizByContentId, fetchMultipleChoiceOptionsByQuizId, fetchClozeTestOptionsByQuizId } from 'src/database/databaseServices';
import { Quiz, MultipleChoiceOption } from 'src/types/contentTypes';
import { useSubchapter } from 'src/context/SubchapterContext';
import { saveContentSlideIndex, loadContentSlideIndex } from 'src/utils/progressUtils';

const isClozeTestOptions = (
    options: MultipleChoiceOption[] | { options: string[]; correctAnswers: (string | null)[] }
): options is { options: string[]; correctAnswers: (string | null)[] } => {
    return (options as { options: string[] }).options !== undefined;
};

interface QuizSlideProps {
    contentId: number;
    onContinue: () => void;
    subchapterId: number; 
    style?: ViewStyle;
    setShowQuiz: (show: boolean) => void;
}

const QuizSlide: React.FC<QuizSlideProps> = ({ contentId, onContinue, style, setShowQuiz, subchapterId }) => {
    const navigation = useNavigation();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [options, setOptions] = useState<MultipleChoiceOption[] | { options: string[]; correctAnswers: (string | null)[] }>([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { markQuizAsFinished } = useSubchapter();

    // Ensure quizzes are loaded before accessing currentQuiz
    const currentQuiz = quizzes.length > 0 ? quizzes[currentQuizIndex] : null;

    // Safeguard sentenceParts calculation
    const sentenceParts = useMemo(() => {
        return currentQuiz && isClozeTestOptions(options)
            ? currentQuiz.Question.split('_')
            : [];
    }, [currentQuiz, options]);

    // Ensure filledAnswers is only calculated when sentenceParts and options are valid
    const [filledAnswers, setFilledAnswers] = useState<
        { answer: string | null; isCorrect: boolean | null }[]
    >([]);

    useEffect(() => {
        if (sentenceParts.length > 1) { // Ensure there are blanks to fill
            setFilledAnswers(
                Array(sentenceParts.length - 1).fill({ answer: null, isCorrect: null })
            );
        } else {
            setFilledAnswers([]); // Clear if no blanks
        }
    }, [sentenceParts]);

    const handleOptionSelect = (selectedOption: string) => {
        const updatedAnswers = [...filledAnswers];
        const firstEmptyIndex = updatedAnswers.findIndex(answer => answer.answer === null);
        if (firstEmptyIndex !== -1) {
            updatedAnswers[firstEmptyIndex] = { answer: selectedOption, isCorrect: null };
            setFilledAnswers(updatedAnswers);
        } else {
            console.warn("All blanks are filled. Cannot add more answers.");
        }
    };


    const loadQuizOptions = async (quiz: Quiz) => {
        try {
            let fetchedOptions: MultipleChoiceOption[] | { options: string[]; correctAnswers: (string | null)[] };
            if (quiz.QuizType === 'multiple_choice') {
                fetchedOptions = await fetchMultipleChoiceOptionsByQuizId(quiz.QuizId);
            } else if (quiz.QuizType === 'cloze_test') {
                fetchedOptions = await fetchClozeTestOptionsByQuizId(quiz.QuizId);
            } else {
                throw new Error('Unsupported quiz type');
            }
            setOptions(fetchedOptions);
        } catch (err) {
            setError('Failed to load quiz options.');
        }
    };

    useEffect(() => {
        const loadQuizData = async () => {
            try {
                const fetchedQuizzes = await fetchQuizByContentId(contentId);
                if (fetchedQuizzes.length > 0) {
                    setQuizzes(fetchedQuizzes);
                    loadQuizOptions(fetchedQuizzes[0]);
                } else {
                    setError('No quiz found for this content.');
                }
            } catch (err) {
                setError('Failed to fetch quiz data.');
            } finally {
                setLoading(false);
            }
        };
        loadQuizData();
    }, [contentId]);

    const handleContinue = async () => {
        if (currentQuiz) {
            const existingDate = await AsyncStorage.getItem(`finishedQuiz_${currentQuiz.QuizId}`);
            if (existingDate !== new Date().toISOString().split('T')[0]) {
                markQuizAsFinished(currentQuiz.QuizId);
            } else {
            }
        }
    
        const nextIndex = currentQuizIndex + 1;
        if (nextIndex < quizzes.length) {
            setOptions([]);
            setCurrentQuizIndex(nextIndex);
            loadQuizOptions(quizzes[nextIndex]);
        } else {
    
            // Lade den letzten gespeicherten Wert
            const previousIndex = await loadContentSlideIndex(subchapterId);
    
            // **Speichere den maximalen Fortschritt**
            const newIndex = Math.max(previousIndex, currentQuizIndex + 1);
            await saveContentSlideIndex(subchapterId, newIndex);
    
            // Lade nochmal zum Überprüfen
            const updatedLastVisitedIndex = await loadContentSlideIndex(subchapterId);

            setShowQuiz(false);
            onContinue();
        }
    };
    

    if (loading) {
        return <View style={{ flex: 1, backgroundColor: '#2b4353' }} />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    if (quizzes.length === 0) {
        return <Text>Hier scheint es wohl kein Quiz zu geben...</Text>;
    }

    if (!currentQuiz) {
        return <Text>Fehler: Quiz konnte nicht geladen werden.</Text>;
    }

    return (
        <View style={[styles.slide, style]}>
   
            {currentQuiz.QuizType === 'multiple_choice' && Array.isArray(options) && (
                <MultipleChoice
                    key={`multiple-choice-${currentQuizIndex}`}
                    quiz={currentQuiz}
                    options={options}
                    onAnswerSubmit={(isCorrect) => {
                        if (isCorrect) {
                            handleContinue();
                        }
                    }}
                    onContinue={handleContinue}
                />
            )}
    
            {/* Render Cloze Test */}
            {currentQuiz.QuizType === 'cloze_test' &&
            !Array.isArray(options) &&
            isClozeTestOptions(options) && (
                <ClozeTest
                    key={`cloze-test-${currentQuizIndex}`}
                    quiz={currentQuiz}
                    options={options.options}
                    correctAnswers={options.correctAnswers}
                    onAnswerSubmit={(isCorrect) => {
                        if (isCorrect) {
                            handleContinue();
                        }
                    }}
                    onContinue={handleContinue}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40, // Adjust vertical padding
        backgroundColor: '#2b4353',
    },
});

export default QuizSlide;
