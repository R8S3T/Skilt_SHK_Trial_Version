import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppIntroSlider from 'react-native-app-intro-slider';
import LottieView from 'lottie-react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Slide, slides } from 'src/components/introScreenSlides';
import { setOnboardingComplete } from 'src/utils/onBoardingUtils';

interface IntroScreenProps {
    navigation: NavigationProp<ParamListBase>;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ navigation }) => {
    const [username, setUsername] = useState('');

    const saveName = async (name: string) => {
        try {
            await AsyncStorage.setItem('userName', name);
        } catch (error) {
        }
    };

    const handleDone = async () => {
        await setOnboardingComplete();
        await saveName(username);  // Save the user's name in AsyncStorage
        navigation.navigate('HomeScreen', {
            screen: 'Home',
            params: { username: username },
        });
    };

    const renderSlide = ({ item }: { item: Slide }) => {
        return (
            <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
                {item.animation && (
                    <LottieView source={item.animation} autoPlay loop style={styles.animation} />
                )}
                {item.image && (
                    <Image source={item.image} style={styles.image} resizeMode="contain" />
                )}
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.text}>{item.text}</Text>
                {item.renderInputField && (
                    <View style={styles.inputBox}>
                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            placeholder='Wie heißt du?'
                            placeholderTextColor="#999"
                            style={styles.textInput}
                        />
                    </View>
                )}
                {item.renderInputField && (
                    <TouchableOpacity style={styles.button} onPress={handleDone}>
                        <Text style={styles.buttonText}>Fertig</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };
    
    return (
<AppIntroSlider 
    renderItem={renderSlide} 
    data={slides} 
    onDone={handleDone} 
    showSkipButton 
    renderNextButton={() => null}
    renderDoneButton={() => null}
/>
    );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
    },
    animation: {
        width: 300,
        height: 300,
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        color: 'black',
        textAlign: 'center',
        marginTop: 15,
    },
    text: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center',
        paddingHorizontal: 30,
        marginBottom: 20,
    },
    inputBox: {
        marginTop: 0,
        padding: 10,
        width: '80%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    textInput: {
        width: '100%',
        padding: 10,
        fontSize: 16,
        color: 'black',
    },
    button: {
        marginTop: 20,
        width: '80%',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#ffa500',  // Modern orange color
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});


export default IntroScreen;
