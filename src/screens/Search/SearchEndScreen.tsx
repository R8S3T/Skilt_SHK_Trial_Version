import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/types/navigationTypes';
import LottieView from 'lottie-react-native';
import { useTheme } from 'src/context/ThemeContext';
import { screenWidth } from 'src/utils/screenDimensions';

const SearchEndScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { theme, isDarkMode } = useTheme();

    useEffect(() => {
        const handleBackPress = () => true;
    
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
        return () => {
            backHandler.remove(); // Entfernt den Event-Listener richtig
        };
    }, []);


    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LottieView
                source={require('../../../assets/Animations/suche.json')} // Ensure the correct path
                autoPlay
                loop
                style={styles.animation}
            />
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[
                        styles.borderedButton,
                        {
                            borderColor: isDarkMode ? '#CCCCCC' : '#24527a', // Dynamic border color
                            backgroundColor: isDarkMode ? 'transparent' : '#ffffff', // Dynamic background
                        },
                    ]}
                    onPress={() => {
                        navigation.reset({
                            index: 0,
                            routes: [
                                {
                                name: "HomeScreen",
                                state: {
                                    routes: [{ name: "Search" }],
                                },
                                },
                            ],
                        });
                    }}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            { color: isDarkMode ? '#CCCCCC' : '#24527a' }, // Dynamic text color
                        ]}
                    >
                        Zurück zur Suche
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: screenWidth > 600 ? 32 : 16,
    },
    animation: {
        width: screenWidth > 600 ? 300 : 200,
        height: screenWidth > 600 ? 300 : 200,
        marginBottom: screenWidth > 600 ? 30 : 20,
    },
    buttonsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    borderedButton: {
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: screenWidth > 600 ? 14 : 10,
        paddingHorizontal: screenWidth > 600 ? 40 : 20,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: screenWidth > 600 ? 18 : 16,
        fontWeight: 'bold',
    },
});

export default SearchEndScreen;
