import React, { useLayoutEffect, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, BackHandler } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/types/navigationTypes';
import { CommonActions } from '@react-navigation/native';
import { useTheme } from 'src/context/ThemeContext';
import { screenWidth } from 'src/utils/screenDimensions';

type CongratsScreenRouteProp = RouteProp<RootStackParamList, 'CongratsScreen'>;

const CongratsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<CongratsScreenRouteProp>();
    const { theme, isDarkMode } = useTheme();

    const targetScreen = route.params?.targetScreen as keyof RootStackParamList;
    const targetParams = route.params?.targetParams;


    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
        });

        return () => backHandler.remove();
    }, []);

    // Array of animation sources
    const animations = [
        require('../../../assets/Animations/congrats_1.json'),
        require('../../../assets/Animations/congrats_2.json'),
        require('../../../assets/Animations/congrats_3.json'),
        require('../../../assets/Animations/congrats_5.json'),
    ];

    // Select a random animation
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];

    if (!targetScreen || !targetParams) {
        return (
            <View style={styles.container}>
                <Text>Error: Missing navigation parameters.</Text>
            </View>
        );
    }
    useEffect(() => {
    }, []);
    
    const handleContinue = () => {
        const { targetScreen, targetParams } = route.params;
        
        if (targetScreen === 'HomeScreen') {
            // Navigate to HomeScreen
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'HomeScreen' }],
                })
            );
        } else if (targetScreen === 'SubchaptersScreen') {
            // Navigate to SubchaptersScreen and reset the stack
            navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'YearsScreen', params: { chapterId: targetParams.chapterId } }, // Ensure YearsScreen is part of the stack
                        { name: 'SubchaptersScreen', params: targetParams },
                    ],
                })
            );
        } else {
        }
    };
    
    
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LottieView
                source={randomAnimation}
                autoPlay
                loop={false}
                style={styles.animation}
            />
            <TouchableOpacity style={[styles.button, styles.active]} onPress={handleContinue}>
                <Text style={styles.text}>Weiter</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: screenWidth > 600 ? 40 : 20,
    },
    animation: {
        width: screenWidth > 600 ? 400 : 250,
        height: screenWidth > 600 ? 400 : 250,
    },
    button: {
        backgroundColor: '#e8630a',
        paddingVertical: screenWidth > 600 ? 20 : 15, // Larger padding for tablets
        paddingHorizontal: screenWidth > 600 ? 30 : 20,
        borderRadius: 8,
        marginTop: screenWidth > 600 ? 50 : 30,
        alignSelf: 'center',
    },
    active: {
        backgroundColor: '#ff8f00',
    },
    text: {
        color: 'white',
        fontSize: screenWidth > 600 ? 20 : 18,
        textAlign: 'center',
    },
});

export default CongratsScreen;






