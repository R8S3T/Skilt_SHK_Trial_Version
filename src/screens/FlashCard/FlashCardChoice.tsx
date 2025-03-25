import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'src/types/navigationTypes';
import { useTheme } from 'src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { scaleFontSize, dynamicCardHeight, screenWidth } from "src/utils/screenDimensions";

const FlashCardChoice = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { theme } = useTheme();

    useLayoutEffect(() => {
        const headerFontSize = 20;
        const backIconSize = screenWidth > 600 ? 35 : 28;
        navigation.setOptions({
            headerTitle: '',
            headerStyle: {
                backgroundColor: theme.surface,
            },
            headerTintColor: theme.primaryText,
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                    }}
                >
                    <Ionicons
                        name="arrow-back"
                        size={backIconSize}
                        color={theme.primaryText}
                    />
                    <Text
                        style={{
                            color: theme.primaryText,
                            fontSize: headerFontSize,
                            fontWeight: '600',
                            marginLeft: 5,
                        }}
                    >
                        Start
                    </Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, theme]);
    

    return (
        <View style={styles.mainContainer}>
            <View style={[styles.headerContainer, { backgroundColor: theme.surface }]}>
                <Text style={[styles.headerTitle, { color: theme.primaryText }]}>Lernkarten</Text>
            </View>

            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <TouchableOpacity style={[styles.button, { backgroundColor: theme.surface }]} onPress={() => navigation.navigate('FlashCardChapters')}>
                    <Text style={[styles.buttonText, { color: theme.primaryText }]}>Karten nach Lernfeldern</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: theme.surface }]} onPress={() => navigation.navigate('FlashCardRepeat')}>
                    <Text style={[styles.buttonText, { color: theme.primaryText }]}>Lernkarte wiederholen</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    headerContainer: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'Lato-Bold',
        fontSize: scaleFontSize(16),
        textAlign: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        marginTop: 20,
        marginHorizontal: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2b4353',
        borderRadius: 10,
        height: dynamicCardHeight(95, 110),
        width: '90%',
    },
    buttonText: {
        flex: 1,
        fontSize: scaleFontSize(13),
        fontFamily: 'OpenSans-Regular',
        textAlign: 'left',
        marginLeft: 10,
    },
});

export default FlashCardChoice;
