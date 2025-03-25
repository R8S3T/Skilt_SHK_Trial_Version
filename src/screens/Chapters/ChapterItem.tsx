import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Subchapter } from 'src/types/contentTypes';
import { fetchSubchaptersByChapterId } from 'src/database/databaseServices';
import { useSubchapter } from 'src/context/SubchapterContext';
import { useTheme } from 'src/context/ThemeContext';
import { screenWidth, scaleFontSize } from 'src/utils/screenDimensions';


interface ChapterItemProps {
    chapter: { chapterId: number; chapterIntro?: string };
    onPress: (chapterId: number) => void;
}

const ChapterItem: React.FC<ChapterItemProps> = ({ chapter, onPress }) => {
    const { theme, isDarkMode } = useTheme();
    const { finishedSubchapters } = useSubchapter();
    const [subchapters, setSubchapters] = useState<Subchapter[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch subchapters for the given chapter
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const subs = await fetchSubchaptersByChapterId(chapter.chapterId); // Keep chapterId
            setSubchapters(subs);
            setLoading(false);
        };
        fetchData();
    }, [chapter.chapterId]);

    // Calculate finished subchapters
    const finishedCount = subchapters.filter(sub => finishedSubchapters.includes(sub.SubchapterId)).length;
    const totalSubchapters = subchapters.length;

    return (
        <TouchableOpacity
            onPress={() => onPress(chapter.chapterId)}
            style={[styles.container, isDarkMode && { borderColor: theme.primaryText }]}
            disabled={loading}
        >
            {/* Einheitlicher Container für Icon/Zähler */}
            <View style={styles.iconContainer}>
                {finishedCount > 0 ? (
                    <View style={styles.counterContainer}>
                        <Text style={styles.counterText}>
                            {finishedCount} / {totalSubchapters}
                        </Text>
                    </View>
                ) : (
                    <Image
                        source={require('../../../assets/Images/play_icon.png')}
                        style={[styles.playButton, { tintColor: theme.accent }]}
                    />
                )}
            </View>

            {/* Chapter-Text bleibt stabil */}
            {chapter.chapterIntro && (
                <Text style={[styles.introText, { color: theme.primaryText }]}>
                    {chapter.chapterIntro}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginVertical: 6,
        borderWidth: 1,
        borderRadius: 8,
    },
    iconContainer: {
        width: 55, // Gleiche Breite für Play-Icon und Zähler
        alignItems: 'center',
        justifyContent: 'center',
    },
    playButton: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    counterContainer: {
        minWidth: 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        paddingVertical: 4,
        backgroundColor: 'transparent',
    },
    counterText: {
        fontFamily: 'Lato-Bold',
        fontSize: screenWidth > 600 ? 22 : 18,
        color: '#e8630a',

    },
    introText: {
        marginLeft: 12,
        flex: 1,
        fontSize: 16,
    },
});

export default ChapterItem;
