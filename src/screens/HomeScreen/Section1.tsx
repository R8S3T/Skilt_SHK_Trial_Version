// src/components/Section1.tsx

import React from "react";
import { View, Text, Image, StyleSheet } from 'react-native';
import RenderButton from "./RenderButton";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "src/types/navigationTypes";
import { scaleFontSize, screenWidth, dynamicMargin } from "src/utils/screenDimensions";
import { useTheme } from 'src/context/ThemeContext';

interface Section1Props {
    onButtonPress: (title: string) => void;
}

const Section1: React.FC<Section1Props> = ({ onButtonPress }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { theme, isDarkMode } = useTheme();

    const initialChapterId = 1;
    const initialChapterTitle = 'Einführung';
    const initialSubchapterId = 1;
    const initialSubchapterTitle = 'Grundlagen';

    return (
        <View style={[styles.newContainer, { backgroundColor: isDarkMode ? theme.surface : '#eeeeee' }]}>
            <Text style={[styles.heading, { color: isDarkMode ? theme.primaryText : '#2b4353' }]}>Meistere Dein Handwerk</Text>
            <Text style={[styles.description, { color: isDarkMode ? theme.secondaryText : '#2b4353' }]}>
                Vertiefe dein Wissen mit maßgeschneiderten Lernhäppchen, die auf deine Ausbildung abgestimmt sind.
            </Text>
            <View style={styles.horizontalContainer}>
                <Image source={require('../../../assets/Images/start_rocket.png')} style={styles.image} />
                <RenderButton
                    title='Starte hier'
                    onPress={() => {
                        onButtonPress('Starte hier');
                        navigation.navigate('Learn', {
                            screen: 'YearsScreen',
                            params: {
                                chapterId: initialChapterId,
                                chapterTitle: initialChapterTitle,
                                subchapterId: initialSubchapterId,
                                subchapterTitle: initialSubchapterTitle,
                            },
                        });
                    }}
                    buttonStyle={[styles.ovalButton, { backgroundColor: '#e8630a' }]} // Orange button background
                    textStyle={[styles.topButtonText, { color: '#f6f5f5' }]} // Consistent text color for readability
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    newContainer: {
        padding: 20,
        width: screenWidth * 0.90,
        borderRadius: 5,
        marginTop: dynamicMargin(10, 20),
        marginBottom: dynamicMargin(10, 20),
        alignItems: 'center',
    },
    horizontalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    heading: {
        fontFamily: 'Lato-Bold',
        fontSize: screenWidth > 600 ? scaleFontSize(14) : scaleFontSize(16),
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontFamily: 'OpenSans-Regular',
        fontSize: screenWidth > 600 ? scaleFontSize(10) : scaleFontSize(13),
        textAlign: 'center',
        marginBottom: 10,
    },
    image: {
        width: screenWidth > 600 ? 150 : 100, // Adjusted size for tablets
        height: screenWidth > 600 ? 150 : 100,
        marginRight: 20,
    },
    ovalButton: {
        borderRadius: 20,
        paddingHorizontal: scaleFontSize(20),
        paddingVertical: scaleFontSize(10),
        width: scaleFontSize(150),
        marginTop: dynamicMargin(10, 20),
    },
    topButtonText: {
        fontFamily: 'Lato-Bold',
        fontSize: screenWidth > 600 ? scaleFontSize(12) : scaleFontSize(14),
    },
});

export default Section1;
