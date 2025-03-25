import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from 'src/types/navigationTypes';
import { scaleFontSize, screenWidth } from "src/utils/screenDimensions";
import { useTheme } from 'src/context/ThemeContext';
import { fetchMathChapters } from 'src/database/databaseServices';
import { MathChapter } from 'src/types/contentTypes';
import { imageMap } from 'src/utils/imageMappings';

interface MathModulSectionProps {
    onButtonPress?: (title: string) => void;
}

const MathModulSection: React.FC<MathModulSectionProps> = ({ onButtonPress }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { isDarkMode, theme } = useTheme();
    const [displayModules, setDisplayModules] = useState<MathChapter[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const cardWidth = screenWidth > 600 ? screenWidth * 0.45 + 20 : screenWidth * 0.4 + 20;


    useEffect(() => {
        const loadModules = async () => {
            try {
                const fetchedChapters = await fetchMathChapters();
                const shuffledChapters = fetchedChapters.sort(() => 0.5 - Math.random());
                const selectedChapters = shuffledChapters.slice(0, 3);
                setDisplayModules(selectedChapters);
            } catch (error) {
                console.error(error);
            }
        };
        loadModules();
    }, []);

    const handleButtonPress = (module: MathChapter | { ChapterName: string }) => {
        onButtonPress?.(module.ChapterName); // Call the onButtonPress prop

        if (module.ChapterName === 'Alle Module') {
            navigation.navigate('Math', { screen: 'MathChapterScreen' });
        } else if ('ChapterId' in module) {  // Check if it's a MathChapter type
            navigation.navigate('Math', { 
                screen: 'MathSubchapterScreen', 
                params: { 
                    chapterId: module.ChapterId, 
                    chapterTitle: module.ChapterName,
                    origin: 'HomeScreen'  // Pass the origin parameter
                }
            });
        }
    };

    return (
        <View style={[styles.container, isDarkMode && { backgroundColor: theme.surface }]}>
            <Text style={[styles.title, isDarkMode && { color: theme.primaryText }]}>Fachmathematik</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContainer}
                onScroll={(event) => {
                    const offsetX = event.nativeEvent.contentOffset.x;
                    const index = Math.round(offsetX / cardWidth);
                    setActiveIndex(index);
                }}
                scrollEventThrottle={16}
                >
                {displayModules.map((module) => (
                    <TouchableOpacity
                        key={module.ChapterId}
                        style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}
                        onPress={() => handleButtonPress(module)}
                    >
                        {module.Image && imageMap[module.Image as keyof typeof imageMap] && (
                            <Image source={imageMap[module.Image as keyof typeof imageMap]} style={styles.image} />
                        )}
                        <Text style={[styles.buttonText, isDarkMode && { color: theme.primaryText }]} numberOfLines={2} ellipsizeMode="tail">
                            {module.ChapterName}
                        </Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity
                    style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}
                    onPress={() => handleButtonPress({ ChapterName: 'Alle Module' })}
                >
                    <Image source={require('../../../assets/Images/math_all.png')} style={styles.image} />
                    <Text style={[styles.buttonText, isDarkMode && { color: theme.primaryText }]} numberOfLines={2} ellipsizeMode="tail">
                        Alle Module
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            <View style={styles.dotContainer}>
                {Array.from({ length: displayModules.length + 1 }).map((_, index) => (
                    <View key={index} style={[styles.dot, activeIndex === index && styles.activeDot]} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 5,
        margin: 5,
        backgroundColor: '#fff',
    },
    scrollViewContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    title: {
        fontFamily: 'Lato-Bold',
        fontSize: screenWidth > 600 ? 35 : 22,
        alignSelf: 'flex-start',
    },
    button: {
        borderRadius: 10,
        padding: screenWidth > 600 ? 20 : 15,
        marginLeft: 10,
        marginRight: 10,
        width: screenWidth > 600 ? screenWidth * 0.45 : screenWidth * 0.4,
        height: screenWidth > 600 ? 250 : 180,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    lightButton: {
        backgroundColor: '#FFF',
        borderColor: '#CCC',
    },
    darkButton: {
        backgroundColor: '#555',
        borderColor: '#888',
    },
    image: {
        width: screenWidth > 600 ? 120 : 80,
        height: screenWidth > 600 ? 120 : 80,
        marginBottom: 5,
        resizeMode: 'contain',
    },
    buttonText: {
        fontSize: screenWidth > 600 ? 18 : 16,
        textAlign: 'center',
        color: '#333',
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#333',
    },
});

export default MathModulSection;

