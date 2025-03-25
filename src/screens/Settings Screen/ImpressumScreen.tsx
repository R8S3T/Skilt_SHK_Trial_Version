import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { screenWidth } from 'src/utils/screenDimensions';

const ImpressumScreen: React.FC = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        const backIconSize = screenWidth > 600 ? 35 : 28;
        const headerFontSize = screenWidth > 600 ? 24 : 20;
        navigation.setOptions({
            headerTitle: '',
            headerTitleAlign: 'left',
            headerStyle: { 
                backgroundColor: theme.surface,
                elevation: 0,             // Entfernt Schatten auf Android
                shadowColor: 'transparent', // Entfernt Schatten auf iOS
                borderBottomWidth: 0,     // Entfernt die untere Linie auf iOS
            },
            headerTintColor: theme.primaryText,
            headerTitleStyle: {
                marginLeft: -10,
                fontWeight: 'normal',
            },
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
                            fontWeight: 'normal',
                            marginLeft: 5,
                        }}
                    >
                        Einstellungen
                    </Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, theme]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Sticky Header */}
            <Text style={[styles.stickyHeader, { color: theme.primaryText, backgroundColor: theme.surface }]}>
                Impressum
            </Text>

            {/* Content ScrollView */}
            <ScrollView style={styles.scrollView}>
                <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>Betreiber</Text>
                <Text style={[styles.description, { color: theme.primaryText }]}>
                    Skilt wird von Calisma betrieben.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>Verantwortlich für den Inhalt</Text>
                <Text style={[styles.description, { color: theme.primaryText }]}>
                    Rebecca Stelter{'\n'}
                    Wattstr. 8{'\n'}
                    12459 Berlin{'\n'}
                    Kontakt: info@skilt.app
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>Technische Zeichnungen</Text>
                <Text style={[styles.description, { color: theme.primaryText }]}>
                    Die technischen Zeichnungen stammen von Florian Broschart.{'\n'}
                    Kontakt: broschart.florian@gmail.com
                </Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    stickyHeader: {
        fontFamily: 'Lato-Bold',
        fontSize: screenWidth > 600 ? 36 : 24,
        paddingVertical: 12,
        paddingHorizontal: 20,
        textAlign: 'center',
        elevation: 3,
        zIndex: 1,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 8,
        textAlign: 'left',
        letterSpacing: 0.4,
    },
    description: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        lineHeight: 24,
        textAlign: 'left',
        marginBottom: 20,
    },
});

export default ImpressumScreen;
