import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchSubchaptersByChapterId } from 'src/database/databaseServices';
import { Subchapter } from 'src/types/contentTypes';
import { LearnStackParamList } from 'src/types/navigationTypes';
import { SubchapterContext } from '../../context/SubchapterContext';
import SubchapterInfoModal from './SubchapterInfoModal';
import GenericRows from '../GenericRows';
import { useTheme } from 'src/context/ThemeContext';
import { screenWidth } from "src/utils/screenDimensions";
import { Ionicons } from '@expo/vector-icons';

type SubchaptersScreenRouteProps = {
    route: RouteProp<LearnStackParamList, 'SubchaptersScreen'>;
};

type NavigationType = StackNavigationProp<LearnStackParamList, 'SubchaptersScreen'>;

const SubchaptersScreen: React.FC<SubchaptersScreenRouteProps> = ({ route }) => {
    const { chapterId, chapterTitle } = route.params;
    const [subchapters, setSubchapters] = useState<Subchapter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [isJumpAhead, setIsJumpAhead] = useState<boolean>(false);
    const [selectedSubchapter, setSelectedSubchapter] = useState<Subchapter | null>(null);
    const navigation = useNavigation<NavigationType>();
    const context = useContext(SubchapterContext);
    const { isDarkMode, theme } = useTheme();

    if (!context) {
        throw new Error('SubchapterContext must be used within a SubchapterProvider');
    }

    const { unlockedSubchapters, finishedSubchapters, setCurrentSubchapter, unlockSubchapter } = context;

    useLayoutEffect(() => {
        const headerFontSize = screenWidth > 600 ? 28 : 22;
        const backIconSize = screenWidth > 600 ? 35 : 28;

        navigation.setOptions({
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
                        {chapterTitle || 'Lehrjahre'}
                    </Text>
                    </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: theme.surface,
                elevation: 0,
                shadowOpacity: 0,
            },
            headerTintColor: theme.primaryText,
        });
    }, [navigation, theme, chapterTitle]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchSubchaptersByChapterId(chapterId);
                setSubchapters(data);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [chapterId]);

    const handleNodePress = (subchapterId: number, subchapterTitle: string) => {
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
            navigation.navigate('SubchapterContentScreen', {
                subchapterId,
                subchapterTitle,
                chapterId,
                chapterTitle,
                currentIndex: 0,
                origin: route.params?.origin || 'AllChaptersSection'
            });
        }
    };

    const handleReviewLesson = () => {
        if (selectedSubchapter) {
            setCurrentSubchapter(selectedSubchapter.SubchapterId, selectedSubchapter.SubchapterName);
            navigation.navigate('SubchapterContentScreen', {
                subchapterId: selectedSubchapter.SubchapterId,
                subchapterTitle: selectedSubchapter.SubchapterName,
                chapterId,
                chapterTitle,
                currentIndex: 0,
                origin: route.params?.origin || 'AllChaptersSection'
            });
        }
        setModalVisible(false);
    };

    const handleJumpAheadConfirm = () => {
        if (selectedSubchapter) {
            unlockSubchapter(selectedSubchapter.SubchapterId, chapterId);
            setCurrentSubchapter(selectedSubchapter.SubchapterId, selectedSubchapter.SubchapterName);
            navigation.navigate('SubchapterContentScreen', {
                subchapterId: selectedSubchapter.SubchapterId,
                subchapterTitle: selectedSubchapter.SubchapterName,
                chapterId,
                chapterTitle,
                currentIndex: 0,
                origin: route.params?.origin || 'AllChaptersSection'
            });
        }
        setModalVisible(false);
    };

    const renderedSubchapters = subchapters.map(subchapter => ({
        id: subchapter.SubchapterId,
        title: subchapter.SubchapterName,
        isLocked: !unlockedSubchapters.includes(subchapter.SubchapterId),
        isFinished: finishedSubchapters.includes(subchapter.SubchapterId)
    }));

    return (
        <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
            {/* Sticky Header Section for 'Lernfeld' */}
            <View style={[styles.dynamicHeadingContainer, { backgroundColor: theme.surface }]}>
                <Text style={[styles.dynamicHeading, { color: theme.primaryText }]}>
                    Lernfeld {chapterId}
                </Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                contentContainerStyle={[
                    styles.scrollViewContent,
                    { backgroundColor: theme.background }
                ]}
            >
                <Text style={[
                    styles.heading,
                    { color: theme.primaryText }
                ]}>{chapterTitle}</Text>

                {loading ? (
                    <Text style={{ color: theme.primaryText }}>Loading...</Text>
                ) : (
                    <GenericRows
                        items={renderedSubchapters}
                        onNodePress={handleNodePress}
                        color="#FFA500"
                        finishedColor="#FFA500"
                    />
                )}

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
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    dynamicHeadingContainer: {
        padding: screenWidth > 600 ? 30 : 20,
        alignItems: 'center',
        zIndex: 1,
    },
    dynamicHeading: {
        fontFamily: 'Lato-Bold',
        fontSize: screenWidth > 600 ? 36 : 24,
        textAlign: 'center',
        marginBottom: screenWidth > 600 ? 15 : 10,
    },
    scrollViewContent: {
        paddingTop: screenWidth > 600 ? 20 : 10,
    },
    heading: {
        fontSize: screenWidth > 600 ? 22 : 18,
        textAlign: 'center',
        marginTop: 8,
    },
});

export default SubchaptersScreen;



