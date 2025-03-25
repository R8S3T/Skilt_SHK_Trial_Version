import React from "react";
import { View, Text, Image, StyleSheet } from 'react-native';
import RenderButton from "./RenderButton";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "src/types/navigationTypes";
import { scaleFontSize, screenWidth, dynamicMargin } from "src/utils/screenDimensions";
import { useTheme } from 'src/context/ThemeContext';

interface AllChaptersSectionProps {
    onButtonPress: (title: string) => void;
}

const AllChaptersSection: React.FC<AllChaptersSectionProps> = ({ onButtonPress }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { theme, isDarkMode } = useTheme();

    return (
        <View style={[styles.newContainer, { backgroundColor: isDarkMode ? theme.surface : '#eeeeee' }]}>
            <Text style={[styles.description, { color: isDarkMode ? theme.secondaryText : '#2b4353', fontSize: scaleFontSize(16) }]}>
                Hier findest du alle Lernfelder auf einen Blick.
            </Text>
            <View style={styles.imageButtonContainer}>
                <Image source={require('../../../assets/Images/Lernfelder.png')} style={styles.image} />
                <RenderButton
                    title="Alle Lernfelder"
                    onPress={() => {
                        onButtonPress("Alle Lernfelder");
                        navigation.navigate('Learn', {
                            screen: 'YearsScreen',
                            params: {
                                chapterId: 1,
                                chapterTitle: 'Einführung',
                                subchapterId: 1,
                                subchapterTitle: 'Grundlagen',
                            },
                        });
                    }}
                    buttonStyle={[styles.ovalButton, { backgroundColor: '#e8630a' }]}
                    textStyle={[styles.topButtonText, { color: '#f6f5f5' }]}
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
    description: {
        fontFamily: 'OpenSans-Regular',
        textAlign: 'center',
        marginBottom: 15, // Mehr Abstand zum Bild/Button
    },
    imageButtonContainer: {
        flexDirection: 'row', // Bild & Button nebeneinander
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 5,
    },
    image: {
        width: 70, // Kleineres Bild für bessere Sichtbarkeit
        height: 70,
        marginRight: 15, // Abstand zum Button
    },
    ovalButton: {
        borderRadius: 20,
        paddingHorizontal: scaleFontSize(15),
        paddingVertical: scaleFontSize(8), // Button kleiner machen
        width: scaleFontSize(150), // Kleinere Breite
        marginTop: 0, // Kein extra Abstand nach oben
    },
    topButtonText: {
        fontFamily: 'Lato-Bold',
        fontSize: scaleFontSize(14), // Kleinere Schrift im Button
    },
});

export default AllChaptersSection;
