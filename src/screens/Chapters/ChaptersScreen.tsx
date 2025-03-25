// src/screens/ChaptersScreen.tsx
// For dropdown only!!

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { dynamicCardHeight, scaleFontSize, screenWidth } from 'src/utils/screenDimensions';
import { Chapter } from 'src/types/contentTypes';
import { fetchChaptersByYear } from 'src/database/databaseServices';
import { LearnStackParamList } from 'src/types/navigationTypes'; 
import { useTheme } from 'src/context/ThemeContext';

type ChaptersScreenRouteProps = {
    route: RouteProp<LearnStackParamList, 'ChaptersScreen'>;
};

type NavigationType = StackNavigationProp<LearnStackParamList, 'ChaptersScreen'>;
console.log(`Screen width is: ${screenWidth}`);
const ChaptersScreen: React.FC<ChaptersScreenRouteProps> = ({ route }) => {
    const { year } = route.params;
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation<NavigationType>();
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchChaptersByYear(parseInt(year));
                setChapters(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };

        loadData();
    }, [year]);

    const renderItem = ({ item }: { item: Chapter }) => {
        const { theme } = useTheme();
        return (
            <TouchableOpacity
                style={styles.chapterContainer}
                onPress={() => navigation.navigate('SubchaptersScreen', {
                    chapterId: item.ChapterId,
                    chapterTitle: item.ChapterName
                })}
            >
                <Image
                    source={require('../../../assets/Images/play_icon.png')}
                    style={{
                        width: iconSize,
                        height: iconSize,
                        tintColor: theme.accent,
                    }}
                />
                {item.ChapterIntro && <Text style={styles.introText}>{item.ChapterIntro}</Text>}
            </TouchableOpacity>
        );
    };
    

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={chapters}
                    renderItem={renderItem}
                    keyExtractor={item => item.ChapterId.toString()}
                />
            )}
        </View>
    );
};

const iconSize = 24;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        marginTop: 25
    },
    chapterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        marginTop: 20,
        margin: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2b4353',
        borderRadius: 10,
        backgroundColor: 'transparent',
        height: dynamicCardHeight(95, 110),
    },
    introText: {
        flex: 1,
        marginLeft: 28,
        fontFamily: 'OpenSans-Regular',
        color: '#2b4353',
        fontSize: scaleFontSize(12),
    },
    playButton: {
        width: screenWidth > 600 ? 32 : iconSize, // Larger for tablets
        height: screenWidth > 600 ? 32 : iconSize, // Larger for tablets
    },
});

export default ChaptersScreen;
