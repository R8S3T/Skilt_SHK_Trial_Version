// src/components/ResumeSection.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { loadProgress } from 'src/utils/progressUtils';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/types/navigationTypes';
import { imageMap } from 'src/utils/imageMappings';
import { scaleFontSize, screenWidth } from "src/utils/screenDimensions";
import { useTheme } from 'src/context/ThemeContext';
import { LOCKED_CHAPTERS, LOCKED_YEARS } from 'src/utils/lockConfig';

interface ResumeSectionProps {
    sectionTitle?: string;
}

const ResumeSection: React.FC<ResumeSectionProps> = ({ sectionTitle = "Lernen fortsetzen" }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { theme } = useTheme();  // Access theme colors from context

    const [lastChapterId, setLastChapterId] = useState<number | null>(null);
    const [lastChapterTitle, setLastChapterTitle] = useState<string | null>(null);
    const [lastSubchapter, setLastSubchapter] = useState<number | null>(null);
    const [lastSubchapterName, setLastSubchapterName] = useState<string | null>(null);
    const [lastContentId, setLastContentId] = useState<number | null>(null);
    const [lastImageName, setLastImageName] = useState<string | null>(null);

    const loadLastViewed = async () => {
        const result = await loadProgress('section1');
        const { chapterId, chapterTitle, subchapterId, subchapterName, currentIndex, imageName } = result;
    
        // If chapter or year is locked, clear resume data
        if (LOCKED_CHAPTERS.includes(chapterId)) {
            setLastChapterId(null);
            setLastChapterTitle(null);
            setLastSubchapter(null);
            setLastSubchapterName(null);
            setLastContentId(null);
            setLastImageName(null);
            return;
        }
    
        // Set resume data only for unlocked content
        if (chapterId) setLastChapterId(chapterId);
        if (chapterTitle) setLastChapterTitle(chapterTitle);
        if (subchapterId) setLastSubchapter(subchapterId);
        if (subchapterName) setLastSubchapterName(subchapterName);
        if (currentIndex !== null) setLastContentId(currentIndex);
        if (imageName) setLastImageName(imageName);
    };

    useFocusEffect(
        useCallback(() => {
            loadLastViewed();
        }, [])
    );

    const handleContinue = () => {
        if (lastSubchapter && lastContentId !== null) {
            navigation.navigate('Learn', {
                screen: 'SubchapterContentScreen',
                params: {
                    subchapterId: lastSubchapter,
                    subchapterTitle: lastSubchapterName || `Kapitel ${lastSubchapter}`,
                    chapterId: lastChapterId ?? 1,
                    chapterTitle: lastChapterTitle ?? "Standard Kapitel Titel",
                    currentIndex: 0,
                    origin: 'ResumeSection',
                },
            });
        } else {
        }
    };

    const imageSource = lastImageName ? imageMap[lastImageName as keyof typeof imageMap] : null;
    
    return (
        <View style={styles.container}>
            <Text style={[styles.resumeTitle, { color: theme.primaryText }]}>{sectionTitle}</Text>
            <TouchableOpacity
    style={[
        styles.newContainer,
        { borderColor: theme.border } // Only set the border color, no background color
    ]}
                onPress={handleContinue}
                disabled={lastSubchapter === null || lastContentId === null}
            >
                {imageSource && (
                    <Image
                        source={imageSource}
                        style={[styles.resumeImage, { width: '85%' }]}
                        resizeMode="contain"
                    />
                )}
                <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
                    {lastSubchapterName ? <Text style={styles.bold}>{lastSubchapterName}</Text> : "Momentan keine weiteren Inhalte verfügbar. Bitte beachten: Dies ist eine Testversion."}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        marginBottom: 20,
        marginTop: 5,
    },
    newContainer: {
        padding: 10,
        width: screenWidth * 0.90,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 5,
        alignItems: 'center',
        borderWidth: 2,
    },
    resumeTitle: {
        fontFamily: 'Lato-Bold',
        fontSize: screenWidth > 600 ? 35 : 22,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: 'OpenSans-Regular',
        fontSize: screenWidth > 600 ? 22 : 18,
        textAlign: 'center',
        marginTop: 15,
    },
    bold: {
        fontWeight: '600',
    },
    resumeImage: {
        width: '90%',
        height: screenWidth > 600 ? 280 : 200,
        marginBottom: 10,
        marginTop: 10,
    },
});

export default ResumeSection;
