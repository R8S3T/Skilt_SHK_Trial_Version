// MathSubchapterScreen.tsx
import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MathStackParamList } from 'src/types/navigationTypes';
import { fetchMathSubchaptersByChapterId } from 'src/database/databaseServices';
import { MathSubchapter } from 'src/types/contentTypes';
import GenericRows from '../GenericRows';
import { useMathSubchapter } from '../../context/MathSubchapterContext';
import SubchapterInfoModal from '../Chapters/SubchapterInfoModal';
import { useTheme } from 'src/context/ThemeContext';
import { fetchMathMiniQuizByContentId, fetchMathContentBySubchapterId } from "src/database/databaseServices";
import { scaleFontSize, screenWidth } from "src/utils/screenDimensions";
import { Ionicons } from "@expo/vector-icons";

type MathSubchapterScreenRouteProp = RouteProp<MathStackParamList, 'MathSubchapterScreen'>;
type MathSubchapterScreenNavigationProp = StackNavigationProp<MathStackParamList, 'MathSubchapterScreen'>;

type Props = {
    route: MathSubchapterScreenRouteProp;
    navigation: MathSubchapterScreenNavigationProp;
};

const MathSubchapterScreen: React.FC<Props> = ({ route, navigation }) => {
    const { chapterId, chapterTitle, origin } = route.params;
    const { isDarkMode, theme } = useTheme();
    const [subchapters, setSubchapters] = useState<MathSubchapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [isJumpAhead, setIsJumpAhead] = useState(false);
    const [selectedSubchapter, setSelectedSubchapter] = useState<MathSubchapter | null>(null);
    const { unlockedSubchapters, finishedSubchapters, setCurrentSubchapter, unlockSubchapter } = useMathSubchapter();

    useLayoutEffect(() => {
        const headerFontSize = screenWidth > 600 ? 28 : 20; // Größer für Tablets
        const backIconSize = screenWidth > 600 ? 35 : 28; // Größerer Pfeil für Tablets
    
        navigation.setOptions({
            headerStyle: {
                backgroundColor: theme.surface,
                elevation: 0,
                shadowOpacity: 0,
            },
            headerTitle: '',
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
                        fontWeight: '600',
                        marginLeft: 5,
                        }}
                    >
                        Module
                    </Text>
                    </TouchableOpacity>
                )
        });
    }, [navigation, theme]);

    useEffect(() => {
        const loadSubchapters = async () => {
            try {
                const data = await fetchMathSubchaptersByChapterId(chapterId);
                setSubchapters(data);

                // Unlock the first subchapter by SortOrder if none are unlocked
                if (unlockedSubchapters.length === 0 && data.length > 0) {
                    const firstSubchapter = data.reduce((min, sub) => 
                        sub.SortOrder < min.SortOrder ? sub : min, data[0]);
                    unlockSubchapter(firstSubchapter.SubchapterId);
                }
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };
        loadSubchapters();
    }, [chapterId, unlockedSubchapters, unlockSubchapter]);

    useEffect(() => {
    }, [chapterId, chapterTitle, origin]);

    const handleNodePress = async (subchapterId: number, subchapterTitle: string) => {
        const isFinished = finishedSubchapters.includes(subchapterId);
        const isLocked = !unlockedSubchapters.includes(subchapterId);
        const selected = subchapters.find(sub => sub.SubchapterId === subchapterId);

        if (isFinished && selected) {
            setSelectedSubchapter(selected);
            setModalVisible(true);
            setIsJumpAhead(false);
        } else if (isLocked && selected) {
            setSelectedSubchapter(selected);
            setModalVisible(true);
            setIsJumpAhead(true);
        } else {
            setCurrentSubchapter(subchapterId, subchapterTitle);
    
            try {
                // Preload content and the first quiz
                const content = await fetchMathContentBySubchapterId(subchapterId);
                const quizzes =
                    content.length > 0
                        ? await fetchMathMiniQuizByContentId(content[0].ContentId)
                        : [];
    
                // Replace the current screen with the subchapter content screen
                navigation.navigate('MathSubchapterContentScreen', {
                    subchapterId,
                    subchapterTitle,
                    chapterId,
                    chapterTitle,
                    origin,
                    preloadedContent: content,
                    preloadedQuiz: quizzes[0] || null,
                });
            } catch (error) {
            }
        }
    };

    const handleReviewLesson = () => {
        if (selectedSubchapter) {
            setCurrentSubchapter(selectedSubchapter.SubchapterId, selectedSubchapter.SubchapterName);
            navigation.navigate('MathSubchapterContentScreen', {
                subchapterId: selectedSubchapter.SubchapterId,
                subchapterTitle: selectedSubchapter.SubchapterName,
                chapterId,
                chapterTitle,
                origin
            });
        }
        setModalVisible(false);
    };

    const handleJumpAheadConfirm = () => {
        if (selectedSubchapter) {
            unlockSubchapter(selectedSubchapter.SubchapterId);
            setCurrentSubchapter(selectedSubchapter.SubchapterId, selectedSubchapter.SubchapterName);
            navigation.navigate('MathSubchapterContentScreen', {
                subchapterId: selectedSubchapter.SubchapterId,
                subchapterTitle: selectedSubchapter.SubchapterName,
                chapterId,
                chapterTitle,
                origin
            });
        }
        setModalVisible(false);
    };

    const formattedSubchapters = subchapters.map(subchapter => ({
        id: subchapter.SubchapterId,
        title: subchapter.SubchapterName,
        isLocked: !unlockedSubchapters.includes(subchapter.SubchapterId),
        isFinished: finishedSubchapters.includes(subchapter.SubchapterId)
    }));
    
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.stickyHeading, { color: theme.primaryText, backgroundColor: theme.surface }]}>
                {chapterTitle}
            </Text>
            <View style={{
                flex: 1,
                marginTop: subchapters.length < 5 ? (screenWidth > 600 ? 100 : 90) : (screenWidth > 600 ? 80 : 50) 
            }}>  
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: 20,
                    }}
                >
                    <View style={{ height: screenWidth > 600 ? 80 : 50 }} />
                    {loading ? (
                        <Text style={{ color: theme.primaryText }}>Daten werden geladen...</Text>
                    ) : (
                        <GenericRows
                            items={formattedSubchapters}
                            onNodePress={handleNodePress}
                            color={isDarkMode ? theme.accent : '#FF5733'}
                            finishedColor={isDarkMode ? theme.accent : '#52ab95'}
                        />
                    )}
                </ScrollView>
            </View>

            {selectedSubchapter && (
                <SubchapterInfoModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    subchapterName={selectedSubchapter.SubchapterName}
                    onReviewLesson={isJumpAhead ? handleJumpAheadConfirm : handleReviewLesson}
                    isJumpAhead={isJumpAhead}
                    onJumpAheadConfirm={handleJumpAheadConfirm}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: screenWidth > 600 ? 20 : 5,
    },
    stickyHeading: {
        fontFamily: 'Lato-Bold',
        fontSize: screenWidth > 600 ? 36 : 24,
        textAlign: 'center',
        paddingVertical: 10,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    scrollViewContent: {
        paddingTop: screenWidth > 600 ? 70 : 40,
    },
});

export default MathSubchapterScreen;
