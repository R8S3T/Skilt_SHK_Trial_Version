import React, { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent, LayoutChangeEvent } from 'react-native';
import NextSlideButton from './NextSlideButton';
import ContentHandler from 'src/components/ContentHandler';
import { Quiz } from 'src/types/contentTypes';
import { GenericContent } from 'src/types/contentTypes';
import { useTheme } from 'src/context/ThemeContext';
import { loadContentSlideIndex } from 'src/utils/progressUtils';
import { screenWidth } from 'src/utils/screenDimensions';
import { Ionicons } from '@expo/vector-icons';

interface ContentSlideProps {
    contentData: (GenericContent | Quiz)[];
    onNext: () => void;
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
    subchapterId: number;
    setShowQuiz: (value: boolean) => void;
}

const ContentSlide: React.FC<ContentSlideProps> = ({
    contentData,
    currentIndex,
    setCurrentIndex,
    subchapterId,
    onNext,
    setShowQuiz,
}) => {
    const currentSlide = contentData[currentIndex];
    const { ContentData } = currentSlide as GenericContent;
    const [isButtonActive, setIsButtonActive] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const { theme, isDarkMode } = useTheme();
    const [loading, setLoading] = useState(true);

    // Track layout and content sizes
    const [containerHeight, setContainerHeight] = useState<number>(0);
    const [contentHeight, setContentHeight] = useState<number>(0);

    const [canNavigateBack, setCanNavigateBack] = useState(false);
    const [canNavigateForward, setCanNavigateForward] = useState(false);

    // Handle navigation backward
    const onPrev = () => {
        if (canNavigateBack) {
            const previousIndex = currentIndex - 1;

            // Check if the previous slide is a quiz
            if ('QuizId' in contentData[previousIndex]) {
                setCurrentIndex(previousIndex - 1);
            } else {
                setCurrentIndex(previousIndex);
            }
        }
    };

    // Handle navigation forward
    const onForwardArrowPress = async () => {
        const lastVisitedIndex = await loadContentSlideIndex(subchapterId);
        const nextIndex = currentIndex + 1;
    
        if (nextIndex < contentData.length) {
            if ('QuizId' in contentData[nextIndex]) {
                setShowQuiz(true);
                setCurrentIndex(nextIndex);
            } else {
                setCurrentIndex(nextIndex);
                setCanNavigateForward(lastVisitedIndex !== null && nextIndex <= lastVisitedIndex);
            }
        } else {
            console.log("✅ Letzter Slide erreicht. Rufe handleNextContent() aus SubchapterContentScreen auf.");
            onNext();
        }
    };

    useEffect(() => {
        const checkProgress = async () => {
            const lastVisitedIndex = await loadContentSlideIndex(subchapterId);

            setCanNavigateBack(currentIndex > 0);

            // Fix: `currentIndex <= lastVisitedIndex` statt `< lastVisitedIndex`
            const canMoveForward = lastVisitedIndex !== null && currentIndex <= lastVisitedIndex;
            setCanNavigateForward(canMoveForward);
        };

        checkProgress();
    }, [currentIndex, subchapterId]);


    useEffect(() => {
        if (ContentData) {
            setLoading(false);
        }
    }, [ContentData]);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: false });
        }
        setIsButtonActive(false);

        const fallbackTimeout = setTimeout(() => {
            if (contentHeight <= containerHeight) {
                setIsButtonActive(true);
            }
        }, 300);

        return () => clearTimeout(fallbackTimeout);
    }, [contentData, contentHeight, containerHeight]);

    useEffect(() => {
        if (contentHeight > 0 && containerHeight > 0) {
            if (contentHeight <= containerHeight) {
                setIsButtonActive(true);
            }
        }
    }, [contentHeight, containerHeight]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 10;

        if (isAtBottom) {
            setIsButtonActive(true);
        } else {
            setIsButtonActive(false);
        }
    };

    const handleContainerLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        setContainerHeight(height);
    };

    const handleContentSizeChange = (width: number, height: number) => {
        setContentHeight(height);

        if (height <= containerHeight) {
            setIsButtonActive(true);
        }
    };

    return (
        <View style={[styles.container, isDarkMode && { backgroundColor: theme.background }]} onLayout={handleContainerLayout}>
            <ScrollView
                contentContainerStyle={[styles.scrollContent, isDarkMode && { backgroundColor: theme.surface }]}
                nestedScrollEnabled={true}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                ref={scrollViewRef}
                onContentSizeChange={handleContentSizeChange}
            >
            {loading ? null : ContentData ? (
                ContentData.split(/\n/).map((part, index) => (
                    <ContentHandler key={index} part={part} />
                ))
            ) : (
                <Text style={styles.errorText}>
                    Error: No content available to display.
                </Text>
            )}
            </ScrollView>
            <View style={styles.buttonContainer}>
                {/* Left Arrow */}
                <Ionicons
                    name="chevron-back-outline"
                    size={screenWidth > 600 ? 36 : 30}
                    color={canNavigateBack ? '#e8630a' : '#ccc'}
                    onPress={canNavigateBack ? onPrev : undefined}
                />
                <NextSlideButton
                    onPress={onNext}
                    isActive={isButtonActive}
                    label="Weiter"
                    style={styles.nextButton}
                />
                {/* Right Arrow */}
                <Ionicons
                    name="chevron-forward-outline"
                    size={screenWidth > 600 ? 36 : 30}
                    color={canNavigateForward ? '#e8630a' : '#ccc'}
                    onPress={canNavigateForward ? onForwardArrowPress : undefined}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    nextButton: {
        marginLeft: 10,
    },
    errorText: {
        color: 'green',
        textAlign: 'center',
        margin: 10,
    },
    arrow: {
        fontSize: screenWidth > 600 ? 36 : 28,
        fontWeight: 'bold',
        color: '#000', // Default color for active arrows
    },
    disabledArrow: {
        color: '#ccc', // Disabled arrow color
    },
});

export default ContentSlide;


