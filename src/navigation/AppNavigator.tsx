// src/navigation/AppNavigator.tsx

import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from 'src/types/navigationTypes';
import IntroScreen from '../screens/IntroScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTabNavigator from './BottomTabNavigator';
import LearnStackNavigator from './LearnStackNavigator';
import MathStackNavigator from './MathStackNavigator';
import { SubchapterProvider } from 'src/context/SubchapterContext';
import { MathSubchapterProvider } from 'src/context/MathSubchapterContext';
import PrivacyPolicyScreen from 'src/screens/Settings Screen/PrivacyPolicyScreen';
import FlashCardChoice from 'src/screens/FlashCard/FlashCardChoice';
import FlashCardChapters from 'src/screens/FlashCard/FlashCardChapters';
import FlashcardScreen from 'src/screens/FlashCard/FlashcardScreen';
import FlashCardRepeat from 'src/screens/FlashCard/FlashCardRepeat';
import SearchScreen from 'src/screens/Search/SearchScreen';
import SearchEndScreen from 'src/screens/Search/SearchEndScreen';
import TermsOfServiceScreen from 'src/screens/Settings Screen/TermsOfServiceScreen';
import ImpressumScreen from 'src/screens/Settings Screen/ImpressumScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            try {
                const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
                setInitialRoute(hasOnboarded ? 'HomeScreen' : 'Intro');
            } catch (error) {
                setInitialRoute('HomeScreen'); // Fallback
            }
        };
    
        checkOnboardingStatus();
    }, []);
    

    if (!initialRoute) {
        return null; // Avoid rendering navigator until initialRoute is determined
    }

    return (
        <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen
                name="Intro"
                component={IntroScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="HomeScreen"
                options={{ headerShown: false }}
            >
                {() => (
                    <SubchapterProvider>
                        <MathSubchapterProvider>
                            <BottomTabNavigator />
                        </MathSubchapterProvider>
                    </SubchapterProvider>
                )}
            </Stack.Screen>

            <Stack.Screen
                name="Learn"
                options={{ headerShown: false }}
            >
                {() => (
                    <SubchapterProvider>
                        <LearnStackNavigator />
                    </SubchapterProvider>
                )}
            </Stack.Screen>
            <Stack.Screen
                name="Math"
                options={{ headerShown: false }}
            >
                {() => (
                    <MathSubchapterProvider>
                        <MathStackNavigator />
                    </MathSubchapterProvider>
                )}
            </Stack.Screen>
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen
                name="SearchEndScreen"
                component={SearchEndScreen}
                options={{
                    title: 'End of Search',
                    headerTitleAlign: 'center',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="FlashCardChoice"
                component={FlashCardChoice}
                options={{ title: 'Flash Card Choices', headerTitleAlign: 'center' }}
            />
            <Stack.Screen
                name="FlashCardChapters" 
                component={FlashCardChapters}
                options={{ title: 'Flashcard Chapters', headerTitleAlign: 'center' }}
            />
            <Stack.Screen
                name="FlashcardScreen"
                component={FlashcardScreen}
                options={{ title: 'Flashcard', headerTitleAlign: 'center' }}
            />
            <Stack.Screen
                name="FlashCardRepeat"
                component={FlashCardRepeat}
                options={{ title: 'Flashcard Repeat', headerTitleAlign: 'center' }}
            />
            <Stack.Screen
                name="PrivacyPolicyScreen"
                component={PrivacyPolicyScreen}
                options={{ title: 'Datenschutzerklärung', headerTitleAlign: 'center' }}
            />
            <Stack.Screen
                name="TermsOfServiceScreen"
                component={TermsOfServiceScreen}
                options={{ title: 'Nutzungsbedingungen', headerTitleAlign: 'center' }}
            />
            <Stack.Screen 
                name="ImpressumScreen" 
                component={ImpressumScreen} 
                options={{ title: 'Impressum' }} 
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
