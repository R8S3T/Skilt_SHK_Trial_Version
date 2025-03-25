import React, { useLayoutEffect} from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { CommonActions, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MathStackParamList } from 'src/types/navigationTypes';
import { useMathSubchapter } from '../../context/MathSubchapterContext';
import { screenWidth } from 'src/utils/screenDimensions';

type MathCongratsScreenRouteProp = RouteProp<MathStackParamList, 'MathCongratsScreen'>;

export interface MathCongratsScreenParams {
    subchapterId: number;
    targetScreen: keyof MathStackParamList;
    targetParams: {
        chapterId: number;
        chapterTitle: string;
        origin?: string;
    };
}

const MathCongratsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<MathCongratsScreenRouteProp>();
    const { markSubchapterAsFinished } = useMathSubchapter();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false, // Completely hide the header
        });
    }, [navigation]);

    const targetScreen = route.params?.targetScreen as keyof MathStackParamList;
    const targetParams = route.params?.targetParams;
    const subchapterId = route.params?.subchapterId;

    // Array of animation sources
    const animations = [
        require('../../../assets/Animations/congrats_1.json'),
        require('../../../assets/Animations/congrats_2.json'),
        require('../../../assets/Animations/congrats_3.json'),
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

    const handleContinue = () => {
        const { targetScreen, targetParams } = route.params;

        if (targetScreen === 'HomeScreen') {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'HomeScreen' }],
                })
            );
        } else if (targetScreen === 'MathSubchapterScreen') {
            navigation.replace('MathSubchapterScreen', targetParams); // Use replace directly from navigation
        } else {
        }
    };
    
    return (
        <View style={styles.container}>
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

export default MathCongratsScreen;