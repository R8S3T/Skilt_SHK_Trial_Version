// MathChapterScreen.tsx
import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MathStackParamList } from 'src/types/navigationTypes';
import { useNavigation } from '@react-navigation/native';
import { fetchMathChapters } from 'src/database/databaseServices';
import { MathChapter } from "src/types/contentTypes";
import { imageMap } from "src/utils/imageMappings";
import { useTheme } from 'src/context/ThemeContext';
import ThemeWrapper from 'src/components/ThemeWrapper';
import { scaleFontSize, screenWidth } from "src/utils/screenDimensions";
import { Ionicons } from "@expo/vector-icons";

type MathChapterScreenNavigationProp = StackNavigationProp<MathStackParamList, 'MathChapterScreen'>;

const MathChapterScreen: React.FC = () => {
    const navigation = useNavigation<MathChapterScreenNavigationProp>();
    const { isDarkMode, theme } = useTheme();
    const [chapters, setChapters] = useState<MathChapter[]>([]);
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        const headerFontSize = screenWidth > 600 ? 24 : 20;
        navigation.setOptions({
            // Den Standardtitel entfernen, da wir ihn in headerLeft einfügen
            headerTitle: '',
            headerStyle: {
                backgroundColor: theme.surface,
                elevation: 0, // Entfernt Schatten auf Android
                shadowOpacity: 0,
            },
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
                        size={screenWidth > 600 ? 35 : 28}
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
        const loadChapters = async () => {
            try {
                const fetchedChapters = await fetchMathChapters();
                setChapters(fetchedChapters);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        loadChapters();
    }, []);

    const renderItem = ({ item }: { item: MathChapter }) => {
        return (
            <TouchableOpacity
                style={[styles.itemContainer, { borderColor: theme.border }]}
                onPress={() => {
                    navigation.navigate('MathSubchapterScreen', { chapterId: item.ChapterId, chapterTitle: item.ChapterName });
                }}
            >
                {item.Image && imageMap[item.Image as keyof typeof imageMap] && (
                    <Image source={imageMap[item.Image as keyof typeof imageMap]} style={styles.image} />
                )}
                <Text style={[styles.itemText, { color: theme.primaryText }]}>{item.ChapterName}</Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={{ color: theme.primaryText }}>Daten werden geladen...</Text>
            </View>
        );
    }

    return (
        <ThemeWrapper>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                {/* Sticky Header */}
                <Text style={[styles.stickyHeader, { color: theme.primaryText, backgroundColor: theme.surface }]}>
                    Wähle ein Modul
                </Text>

                {/* Scrollable Content */}
                <FlatList
                    contentContainerStyle={styles.flatListContent}
                    data={chapters}
                    renderItem={renderItem}
                    keyExtractor={item => item.ChapterId.toString()}
                />
            </View>
        </ThemeWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: screenWidth > 600 ? 20 : 15,
        paddingHorizontal: screenWidth > 600 ? 20 : 15,
        borderBottomWidth: 1,
    },
    stickyHeader: {
        fontFamily: 'Lato-Bold',
        fontSize: screenWidth > 600 ? 36 : 24,
        textAlign: 'center',
        paddingVertical: screenWidth > 600 ? 15 : 10,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    title: {
        fontFamily: 'Lato-Bold',
        fontSize: screenWidth > 600 ? scaleFontSize(14) : scaleFontSize(18),
        textAlign: 'center',
    },
    flatListContent: {
        paddingTop: screenWidth > 600 ? 70 : 40,
    },
    image: {
        width: screenWidth > 600 ? 140 : 100,
        height: screenWidth > 600 ? 140 : 100,
        marginRight: 10,
        resizeMode: 'contain',
    },
    itemText: {
        fontSize: screenWidth > 600 ? 22 : 18,
        flexShrink: 1,
        flexWrap: 'wrap',
        maxWidth: '75%',
    },
});

export default MathChapterScreen;

