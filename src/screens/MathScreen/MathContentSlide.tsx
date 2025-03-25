import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, LayoutChangeEvent, FlatList } from 'react-native';
import { MathMiniQuiz, GenericContent } from 'src/types/contentTypes';
import NextSlideButton from '../NextSlideButton';
import ContinueButton from './MathContinueButton';
import { useTheme } from 'src/context/ThemeContext';
import MathContentHandler from 'src/components/MathContentHandler';

interface MathContentSlideProps {
    contentData: GenericContent;
    mathMiniQuizzes: MathMiniQuiz[];
    onQuizComplete: (isCorrect: boolean) => void;
    onQuizLayout: (event: LayoutChangeEvent) => void;
    completedQuizzes: boolean[];
    onNextSlide: () => void;
}

const MathContentSlide: React.FC<MathContentSlideProps> = ({
    contentData,
    onNextSlide,
    }) => {
        const { theme, isDarkMode } = useTheme();
        const { ContentData } = contentData;
        const [currentPartIndex, setCurrentPartIndex] = useState<number>(0);
        const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
        const flatListRef = useRef<FlatList>(null);
    
        const parts = ContentData.split(/\[continue\]/);
    
        useEffect(() => {
        setCurrentPartIndex(0);
        setQuizAnswered(false);
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, [contentData]);

        useEffect(() => {
        }, [contentData]);
        
        const handleContinue = () => {
        const nextPartIndex = currentPartIndex + 1;

        if (nextPartIndex < parts.length) {
            setCurrentPartIndex(nextPartIndex);
            setQuizAnswered(false);
            setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: nextPartIndex, animated: true, viewPosition: 0.1 });
            }, 100);
        }
        };


        const handleQuizComplete = (isCorrect: boolean) => {
            setQuizAnswered(true);
            // Wenn der aktuelle Part der letzte ist, navigiere direkt weiter:
            if (currentPartIndex === parts.length - 1) {
                onNextSlide();
            }
        };
        return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
            ref={flatListRef}
            data={parts.slice(0, currentPartIndex + 1)}
            keyboardShouldPersistTaps="always"
            renderItem={({ item, index }) => (
                <View key={index} style={styles.partContainer}>
                <MathContentHandler 
                    part={item} 
                    index={index}
                    onQuizComplete={handleQuizComplete}
                    onNextSlide={onNextSlide}
                    isLast={currentPartIndex === parts.length - 1}
                />
                {index === currentPartIndex &&
                    currentPartIndex < parts.length - 1 &&
                    !quizAnswered && (
                        <ContinueButton 
                            label="Weiter" 
                            onPress={handleContinue} 
                            isDarkMode={isDarkMode}
                        />
                    )}
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContent}
            ListFooterComponent={
                <View style={styles.footer}>
                {currentPartIndex === parts.length - 1 && (
                    <NextSlideButton onPress={onNextSlide} isActive={true} label="Fertig" />
                )}
                </View>
            }
            onScrollToIndexFailed={() => {
                if (flatListRef.current) {
                flatListRef.current.scrollToEnd({ animated: true });
                }
            }}
            />
        </View>
        );
    };

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fullWidthPartContainer: {
        flex: 1,
        width: '100%',
        padding: 20,
    },
    partContainer: {
        flex: 1,
        padding: 5,
    },
    flatListContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'contain',
        marginVertical: 8,
    },
    welcomeImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        marginVertical: 0,
    },
    bigImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        marginVertical: 0,
    },
    contentText: {
        fontSize: 20,
        marginVertical: 1.5,
        color: '#000',
        padding: 5,
        letterSpacing: 1.2,
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
        width: '100%',
    },
    underlineContainer: {
        borderBottomWidth: 2,
        paddingBottom: 5,
        width: '100%',
        marginVertical: 10,
    },
    bgColorBlock: {
        padding: 25,
        borderRadius: 5,
        marginVertical: 0,
        borderWidth: 1.5,
        borderColor: 'orange',
    },
});

export default MathContentSlide;
