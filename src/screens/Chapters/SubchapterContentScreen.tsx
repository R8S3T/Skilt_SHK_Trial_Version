// src/screens/SubchapterContentScreen.tsx

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ContentSlide from '../ContentSlide';
import QuizSlide from '../Quiz/QuizSlide';
import { Quiz } from 'src/types/contentTypes';
import { CommonActions, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LearnStackParamList } from 'src/types/navigationTypes';
import { GenericContent } from 'src/types/contentTypes';
import { fetchSubchapterContentBySubchapterId, fetchSubchaptersByChapterId  } from 'src/database/databaseServices';
import { useSubchapter } from '../../context/SubchapterContext';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import {  saveContentSlideIndex, completeSubchapter, saveProgress, } from 'src/utils/progressUtils';
import { useTheme } from 'src/context/ThemeContext';
import LottieView from 'lottie-react-native';
import { screenWidth } from 'src/utils/screenDimensions';
import { updateStreak } from 'src/utils/streakUtils';

type SubchapterContentScreenRouteProp = RouteProp<LearnStackParamList, 'SubchapterContentScreen'>;
type SubchapterContentScreenNavigationProp = StackNavigationProp<LearnStackParamList, 'SubchapterContentScreen'>;

type Props = {
    route: SubchapterContentScreenRouteProp;
    navigation: SubchapterContentScreenNavigationProp;
};

const SubchapterContentScreen: React.FC<Props> = ({ route, navigation }) => {
    const {
        subchapterId,
        subchapterTitle,
        chapterId = 0,
        chapterTitle = '',
        origin = undefined,
    } = route.params;
    const [contentData, setContentData] = useState<(GenericContent | Quiz)[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [showQuiz, setShowQuiz] = useState<boolean>(false);
    const { theme } = useTheme();
    const [navigating, setNavigating] = useState(false);

    const { finishedSubchapters, markSubchapterAsFinished, unlockSubchapter } = useSubchapter();

    const loadingAnimations = [
    require('../../../assets/Animations/loading_3.json'),
    ];

    const [selectedAnimation] = useState(
        loadingAnimations[Math.floor(Math.random() * loadingAnimations.length)]
    );

    useLayoutEffect(() => {
        navigation.setOptions(
            loading
                ? { headerShown: false } // Hide the header during loading
                : {
                      headerShown: true, // Show the header after loading
                        headerLeft: () => (
                            <TouchableOpacity
                                onPress={() => {
                                    if (route.params.origin === 'ResumeSection') {
                                        // Navigate directly to HomeScreen if accessed via ResumeSection
                                        navigation.dispatch(
                                            CommonActions.reset({
                                                index: 0,
                                                routes: [{ name: 'HomeScreen' }],
                                            })
                                        );
                                    } else if (route.params.origin === 'SearchScreen') {
                                        // Navigate back to SearchScreen if accessed via SearchScreen
                                        navigation.goBack();
                                    } else {
                                        // Default: Reset stack to SubchaptersScreen
                                        navigation.dispatch(
                                            CommonActions.reset({
                                                index: 1,
                                                routes: [
                                                    {
                                                        name: 'YearsScreen',
                                                        params: { chapterId },
                                                    }, // Add YearsScreen to stack
                                                    {
                                                        name: 'SubchaptersScreen',
                                                        params: {
                                                            chapterId,
                                                            chapterTitle,
                                                        },
                                                    }, // Reset to SubchaptersScreen
                                                ],
                                            })
                                        );
                                    }
                                }}
                                style={{
                                    width: screenWidth > 600 ? 60 : 50,
                                    height: screenWidth > 600 ? 60 : 50,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: screenWidth > 600 ? 20 : 10,
                                }}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons
                                    name="close"
                                    size={30}
                                    color={theme.primaryText}
                                />
                            </TouchableOpacity>
                        ),
                        headerRight: () => null, // Remove any headerRight component if it exists
                        headerStyle: {
                            backgroundColor: theme.surface, // Dynamic background for dark mode
                        },
                    }
            );
    }, [
        loading, // Re-run whenever the loading state changes
        navigation,
        chapterId,
        chapterTitle,
        route.params.origin,
        theme,
    ]);


    // Always reset to the first slide when entering a subchapter
    useEffect(() => {
        setCurrentIndex(0);
    }, [subchapterId]);


    // Load content data for the subchapter
    useEffect(() => {
        navigation.setOptions({ title: subchapterTitle });
        const loadData = async () => {
            try {
                const data = await fetchSubchapterContentBySubchapterId(subchapterId);
                setContentData(data);
                setLoading(false);

            } catch (error) {
                setLoading(false);
            }
        };
        loadData();
    }, [navigation, subchapterId, subchapterTitle]);


    // Update header progress bar
    useEffect(() => {
        if (!loading) {
            const progress = (currentIndex + 1) / contentData.length;
            navigation.setOptions({
                headerTitle: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%' }}>
                        <View style={styles.progressBarContainer}>
                            <LinearGradient
                                colors={['#4CAF50', '#81C784']}
                                start={[0, 0]}
                                end={[1, 0]}
                                style={[styles.progressBar, { width: `${progress * 100}%` }]}
                            />
                        </View>
                    </View>
                ),
            });
        }
    }, [currentIndex, contentData.length, loading]);

    const handleNextContent = async () => {
        const nextIndex = currentIndex + 1;
    
        if (nextIndex < contentData.length) {
            const nextContent = contentData[nextIndex];
            const isQuiz = 'QuizId' in nextContent;

            const subchapters = await fetchSubchaptersByChapterId(chapterId);
            const currentSubchapter = subchapters.find(sub => sub.SubchapterId === subchapterId);
            const imageName = currentSubchapter?.ImageName || null;
    
            setCurrentIndex(() => {
                setShowQuiz(isQuiz);
                return nextIndex;
            });
    
            await saveContentSlideIndex(subchapterId, nextIndex);
    
            if (origin !== 'SearchScreen') {
                await saveProgress(
                    'section1',
                    chapterId,
                    subchapterId,
                    subchapterTitle,
                    nextIndex,
                    imageName
                );
            }
        } else {

            const subchapters = await fetchSubchaptersByChapterId(chapterId);
            const currentSubchapter = subchapters.find(sub => sub.SubchapterId === subchapterId);
            const imageName = currentSubchapter?.ImageName || null;
    
            await updateStreak('chapter');

            setNavigating(true);
    
            setTimeout(async () => {
                await completeSubchapter({
                    subchapterId,
                    chapterId,
                    chapterTitle,
                    navigation,
                    markSubchapterAsFinished: (id) => markSubchapterAsFinished(id, chapterId),
                    unlockSubchapter: (id) => unlockSubchapter(id, chapterId),
                    origin,
                });
            }, 200);
        }
    };
    

    if (loading || navigating) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
                <LottieView
                    source={selectedAnimation}
                    autoPlay
                    loop
                    style={styles.animation}
                />
            </View>
        );
    }
    
    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.container}>
                {currentIndex >= contentData.length ? (
                    <Text>Fehler: Subchapter ist abgeschlossen.</Text> // 🛠 Fallback für ungültigen Index
                ) : showQuiz ? (
                    <QuizSlide
                        contentId={(contentData[currentIndex] as Quiz).ContentId}
                        subchapterId={subchapterId}
                        setShowQuiz={setShowQuiz}
                        onContinue={async () => {
                            setShowQuiz(false);
                            handleNextContent();
                        }}
                    />
                ) : (
                    <ContentSlide
                        contentData={contentData}
                        onNext={handleNextContent}
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                        subchapterId={subchapterId}
                        setShowQuiz={setShowQuiz}
                    />
                )}
            </View>
        </GestureHandlerRootView>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomNavContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        position: 'absolute',
        bottom: screenWidth > 600 ? 30 : 20,
        width: '100%',
    },
    arrowStyle: {
        opacity: 0.8,
        fontSize: screenWidth > 600 ? 42 : 34, // Larger size for tablets
    },

    progressBarContainer: {
        height: screenWidth > 600 ? 20 : 18,
        width: '90%',
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        overflow: 'hidden',
        marginLeft: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    progressBar: {
        height: 15,
        borderRadius: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animation: {
        width: 250,
        height: 250,
    },
});

export default SubchapterContentScreen;
