import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchChapters } from 'src/database/databaseServices';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/types/navigationTypes';
import { useTheme } from 'src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { scaleFontSize, screenWidth } from "src/utils/screenDimensions";

// Main component
const FlashCardChapters = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [chapters, setChapters] = useState<{ ChapterId: number; ChapterName: string }[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const { theme, isDarkMode } = useTheme();

    // Locked chapters 
    const lockedChapters = new Set([0]);

    // Calculate button size to fit three per row
    const screenWidth = Dimensions.get('window').width;
    const buttonSize = (screenWidth - 80) / 3;

    useLayoutEffect(() => {
        const headerFontSize = 20;
        const backIconSize = screenWidth > 600 ? 35 : 28;
        navigation.setOptions({
            headerTitle: '',
            headerStyle: {
                backgroundColor: theme.surface,
                elevation: 0,
                shadowColor: 'transparent',
                borderBottomWidth: 0,
            },
            headerShadowVisible: false,
            headerTintColor: theme.primaryText,
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
                        Start
                    </Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, theme]);
    

    useEffect(() => {
        const getChapters = async () => {
            const fetchedChapters = await fetchChapters();
            setChapters(fetchedChapters);
        };

        getChapters();
    }, []);

    const handleButtonPress = (chapterId: number) => {
        if (lockedChapters.has(chapterId)) {
            setModalMessage('Dieser Inhalt ist in der Tesversion nicht verfügbar.');
            setModalVisible(true);
        } else {
            navigation.navigate('FlashcardScreen', { chapterId, chapterTitle: `Lernfeld ${chapterId}` });
        }
    };


    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Sticky Header for "Lernfelder" */}
            <View style={[styles.header, { backgroundColor: theme.surface }]}>
                <Text style={[styles.headerText, { color: theme.primaryText }]}>Lernfelder</Text>
            </View>

            {/* Scrollable Content with Buttons in Rows */}
            <ScrollView contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background }]}>

                <View style={styles.rowContainer}>
                    {chapters.map((chapter) => (
                        <TouchableOpacity
                            key={chapter.ChapterId}
                            style={[
                                styles.button,
                                lockedChapters.has(chapter.ChapterId)
                                    ? { backgroundColor: isDarkMode ? '#333333' : styles.lockedButton.backgroundColor } // Gesperrte Buttons
                                    : { backgroundColor: isDarkMode ? '#445566' : styles.unlockedButton.backgroundColor }, // Freigegebene Buttons
                                { width: buttonSize, height: buttonSize },
                            ]}
                            onPress={() => handleButtonPress(chapter.ChapterId)}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    {
                                        color: lockedChapters.has(chapter.ChapterId)
                                            ? (isDarkMode ? '#AAAAAA' : theme.secondaryText)
                                            : (isDarkMode ? '#FFFFFF' : theme.primaryText),
                                    },
                                ]}
                            >
                                {chapter.ChapterName}
                            </Text>
                        </TouchableOpacity>


                    ))}
                </View>
            </ScrollView>

            {/* Modal for locked chapters */}
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={[styles.modalOverlay, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)' }]}>
                    <View style={[styles.modalContainer, { backgroundColor: theme.surface }]}>
                        <Text style={[styles.modalText, { color: theme.primaryText }]}>{modalMessage}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={[styles.modalButton, { color: isDarkMode ? '#CCCCCC' : theme.accent }]}>OK</Text>

                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    headerText: {
        fontFamily: 'Lato-Bold',
        fontSize: scaleFontSize(16),
    },
    scrollContent: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#ffffff',
    },
    rowContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        paddingHorizontal: 5,
    },
    button: {
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    unlockedButton: {
        backgroundColor: '#ffffff',
        borderColor: '#2b4353',
        borderWidth: 1,
    },
    lockedButton: {
        backgroundColor: '#cccccc',
        borderColor: '#999999',
        borderWidth: 1,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        padding: screenWidth > 600 ? 35 : 24,
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

export default FlashCardChapters;
