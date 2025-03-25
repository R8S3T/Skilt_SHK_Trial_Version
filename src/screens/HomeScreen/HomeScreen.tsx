// src/screens/HomeScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRoute, RouteProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabParamList } from 'src/types/navigationTypes';
import Section1 from './Section1';
import ResumeSection from './ResumeSection';
import AllChaptersSection from './AllChaptersSection';
import MathModulSection from './MathModulSection';
import FlashcardsSection from './FlashCardSection';
import { hasMadeProgress } from 'src/utils/onBoardingUtils';
import { useTheme } from 'src/context/ThemeContext';
import { screenWidth, scaleFontSize } from 'src/utils/screenDimensions';

type HomeRouteProp = RouteProp<BottomTabParamList, 'Home'>;

const HomeScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<HomeRouteProp>();
    const [username, setUsername] = useState(route.params?.username || '');
    const screenWidth = Dimensions.get('window').width; 
    const [showResume, setShowResume] = useState(false);
    const { theme } = useTheme();  // Access theme from ThemeContext

    useEffect(() => {
        const loadUsername = async () => {
            try {
                const storedName = await AsyncStorage.getItem('userName');
                if (storedName) setUsername(storedName);
            } catch (error) {
            }
        };

        loadUsername();
    }, []); // Load only on initial render

    useEffect(() => {
        const checkProgress = async () => {
            const hasProgress = await hasMadeProgress();
            setShowResume(hasProgress);
        };
        checkProgress();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text style={[styles.greetingText, { color: theme.primaryText }]}>
                {username 
                    ? `Hallo ${username.trim()}, viel Spaß beim Lernen!`
                    : 'Viel Spaß beim Lernen!'}
            </Text>
            ), // Updated from static string to a Text component
            headerStyle: {
                backgroundColor: theme.background,
            },
            headerTintColor: theme.primaryText,
            headerShadowVisible: false, 
        });
    }, [navigation, username, theme]);

    useFocusEffect(
        React.useCallback(() => {
            const loadUsername = async () => {
                const storedName = await AsyncStorage.getItem('userName');
                if (storedName) setUsername(storedName);
            };
            loadUsername();
        }, [])
    );

    const handleButtonPress = (title: string) => {
    };


    return (
        <ScrollView
            style={{ backgroundColor: theme.background }}
            contentContainerStyle={[
                styles.scrollContentContainer,
                { backgroundColor: theme.background }
            ]}
        >
            {showResume ? (
                <>
                    <ResumeSection sectionTitle="Weiterlernen" />
                    <AllChaptersSection onButtonPress={handleButtonPress} />
                </>
            ) : (
                <Section1 onButtonPress={handleButtonPress} />
            )}
            <MathModulSection onButtonPress={handleButtonPress} />
            <FlashcardsSection onButtonPress={handleButtonPress} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 20,
    },
    sectionSpacing: {
        marginBottom: 20,
    },
    greetingText: {
        fontFamily: 'Lato-Bold',
        fontSize: screenWidth > 600 ? scaleFontSize(14) : scaleFontSize(16), // Larger for tablets
        textAlign: 'center',
    },
});

export default HomeScreen;

