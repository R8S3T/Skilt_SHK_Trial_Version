import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LearnStackParamList } from 'src/types/navigationTypes';
import { fetchChaptersByYear } from 'src/database/databaseServices';
import { NavigationProp } from '@react-navigation/native';
import { useTheme } from 'src/context/ThemeContext';
import { screenWidth } from "src/utils/screenDimensions";
import { Ionicons } from '@expo/vector-icons';
import ChapterItem from './Chapters/ChapterItem';

const YearsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<LearnStackParamList>>();
    const { isDarkMode, theme } = useTheme();
    const [expandedYear, setExpandedYear] = useState<number | null>(null);
    const [chapters, setChapters] = useState<{ [key: number]: { chapterId: number; chapterIntro?: string }[] }>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string | null>(null);

    useLayoutEffect(() => {
        const headerFontSize = screenWidth > 600 ? 28 : 22;
        const backIconSize = screenWidth > 600 ? 35 : 28;
    
        navigation.setOptions({
            headerStyle: {
                backgroundColor: theme.surface,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
            },
            headerTitle: '',
            headerLeft: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
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
                        Start
                        </Text>
                    </TouchableOpacity>
                </View>
            ),
            headerTintColor: theme.primaryText,
        });
    }, [navigation, theme]);


    const educationData = [
        { year: 1, learnAreas: 4 },
        { year: 2, learnAreas: 4 },
        { year: 3, learnAreas: 5 },
        { year: 4, learnAreas: 2 },
    ];

    const handlePress = async (year: number) => {
        // Toggle expanded state for the year
        setExpandedYear(expandedYear === year ? null : year);
        if (!chapters[year]) {
            setLoading(true);
            try {
                const fetchedChapters = await fetchChaptersByYear(year);
                setChapters((prevChapters) => ({
                    ...prevChapters,
                    [year]: fetchedChapters.map(ch => ({
                        chapterId: ch.ChapterId,
                        chapterIntro: ch.ChapterIntro ?? '',
                    })),
                }));
            } catch (error) {
            }
            setLoading(false);
        }
    };

    const handleChapterPress = (chapterId: number, year: number) => {

        // Lock deaktiviert – alle Kapitel sind zugänglich
        navigation.navigate('SubchaptersScreen', { chapterId, origin: 'AllChaptersSection' });
    };
    

    const renderChapter = (chapter: { chapterId: number; chapterIntro?: string }, year: number) => (
        <TouchableOpacity
            key={chapter.chapterId}
            style={[
                styles.chapterContainer,
                isDarkMode && { borderColor: theme.primaryText }
            ]}
            onPress={() => handleChapterPress(chapter.chapterId, year)}
        >
            <Image
                source={require('../../assets/Images/play_icon.png')}
                style={[styles.playButton, { tintColor: theme.accent }]}
            />
            {chapter.chapterIntro && (
                <Text style={[styles.introText, { color: theme.primaryText }]}>{chapter.chapterIntro}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.mainContainer}>
            <View style={[styles.titleContainer, { backgroundColor: theme.background }]}>
                <Text style={[styles.title, { color: theme.primaryText }]}>Wähle dein Lehrjahr</Text>
            </View>

            <ScrollView 
                style={[styles.container, { backgroundColor: theme.background }]} 
                contentContainerStyle={{ paddingBottom: 80}}
            >
                {educationData.map((item, index) => (
                    <View
                        key={index}
                        style={[
                            styles.cardContainer,
                            {
                                backgroundColor: isDarkMode ? theme.surface : theme.background,
                                borderColor: theme.border,
                            }
                        ]}
                    >
                        <TouchableOpacity onPress={() => handlePress(item.year)} style={styles.card}>
                            <View style={styles.yearRectangle}>
                                <Text style={[styles.number, { color: theme.primaryText }]}>{`${item.year}. Lehrjahr`}</Text>
                            </View>
                            <Text style={[styles.learnArea, { color: theme.secondaryText }]}>{`${item.learnAreas} Lernfelder`}</Text>
                        </TouchableOpacity>

                        {expandedYear === item.year && (
                            <View style={styles.chaptersContainer}>
                                {loading ? (
                                    <Text style={{ color: theme.secondaryText }}>Loading...</Text>
                                ) : (
                                    chapters[item.year]?.map((chapter) => (
                                        <ChapterItem 
                                            key={chapter.chapterId} 
                                            chapter={chapter} 
                                            onPress={(chapterId) => handleChapterPress(chapterId, item.year)} 
                                        />
                                    ))
                                )}
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

            {/* Modal for locked chapters */}
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalButton}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const iconSize = 32;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    titleContainer: {
        padding: 20,
        alignItems: 'center',
        zIndex: 1,
    },
    title: {
        fontFamily: 'Lato-Bold',
        fontSize: screenWidth > 600 ? 36 : 24,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        paddingVertical: screenWidth > 600 ? 40 : 30,
    },
    cardContainer: {
        marginHorizontal: screenWidth > 600 ? 20 : 10,
        marginBottom: screenWidth > 600 ? 25 : 15,
        borderRadius: screenWidth > 600 ? 18 : 12,
        paddingVertical: screenWidth > 600 ? 30 : 20,
        paddingHorizontal: screenWidth > 600 ? 25 : 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
    },
    card: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    yearRectangle: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: screenWidth > 600 ? 15 : 10,
    },
    number: {
        fontSize: screenWidth > 600 ? 28 : 22,
    },
    learnArea: {
        fontSize: screenWidth > 600 ? 24 : 20,
        alignSelf: 'flex-end',
        marginTop: screenWidth > 600 ? 15 : 10,
        marginRight: screenWidth > 600 ? 20 : 10,
    },
    chaptersContainer: {
        marginTop: 10,
        paddingHorizontal: 10,
        marginBottom: 40,
    },
    chapterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        marginVertical: 12,
        borderWidth: 0.8,
        borderRadius: 10,
    },
    introText: {
        flex: 1,
        marginLeft: 28,
        fontSize: screenWidth > 600 ? 22 : 18,
    },
    playButton: {
        width: screenWidth > 600 ? iconSize * 1.5 : iconSize,
        height: screenWidth > 600 ? iconSize * 1.5 : iconSize,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        padding: screenWidth > 600 ? 32 : 24,
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
    },
    modalText: {
        fontSize: screenWidth > 600 ? 22 : 20,
        marginBottom: 16,
        textAlign: 'center',
    },
    modalButton: {
        fontSize: screenWidth > 600 ? 22 : 20,
        color: '#007bff',
    },
});

export default YearsScreen;
