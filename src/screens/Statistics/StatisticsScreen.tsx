import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/context/ThemeContext';
import LearnTracker from './LearnTracker';
import { useSubchapter } from 'src/context/SubchapterContext';
import { useMathSubchapter } from 'src/context/MathSubchapterContext';


const StatisticsScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const {
        getFinishedSubchaptersToday,
        getFinishedQuizzesToday,
        getTotalFinishedSubchapters,
        triggerStatisticsUpdate
    } = useSubchapter();

    const {
        getFinishedMathSubchaptersToday,
        getFinishedMathQuizzesToday,
        getTotalFinishedMathSubchapters,
    } = useMathSubchapter();


    const [finishedToday, setFinishedToday] = useState<number>(0);
    const [quizzesToday, setQuizzesToday] = useState<number>(0); // Placeholder
    const [totalSubchapters, setTotalSubchapters] = useState<number>(0); // Placeholder

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Lernerfolge',
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.primaryText,
        });
    }, [navigation, theme]);

    useEffect(() => {
        const fetchData = async () => {
            const finishedSubchapters = await getFinishedSubchaptersToday();
            const finishedQuizzes = await getFinishedQuizzesToday();
            const totalFinished = await getTotalFinishedSubchapters();

            const finishedMathSubchapters = getFinishedMathSubchaptersToday
            ? await getFinishedMathSubchaptersToday()
            : 0;
            const finishedMathQuizzes = getFinishedMathQuizzesToday
            ? await getFinishedMathQuizzesToday()
            : 0;
            const totalMathFinished = getTotalFinishedMathSubchapters
            ? await getTotalFinishedMathSubchapters()
            : 0;

            setFinishedToday(finishedSubchapters + finishedMathSubchapters);
            setQuizzesToday(finishedQuizzes + finishedMathQuizzes);
            setTotalSubchapters(totalFinished + totalMathFinished);
        };
        fetchData();
        triggerStatisticsUpdate();
    }, []);

    useEffect(() => {
    }, [finishedToday, quizzesToday, totalSubchapters]);
    

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 40, alignItems: 'center' }}>
                <LearnTracker />
                <View style={{ height: 50 }} />

                <View style={[styles.statsContainer, { borderColor: theme.border, backgroundColor: theme.surface  }]}>

                    <View style={styles.headerRow}>
                    <Text style={[styles.statsHeader, { color: theme.primaryText }]}>Heute hast du bereits</Text>
                    </View>

                    <View style={styles.statItem}>
                        <Ionicons name="book-outline" size={34} color="#4A90E2" />
                        <Text style={[styles.statsText, { color: theme.primaryText }]}>
                        <Text style={[styles.boldText, { color: theme.primaryText }]}>{finishedToday}</Text> Kapitel gelernt
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Ionicons name="checkbox-outline" size={34} color="#50C878" />
                        <Text style={[styles.statsText, { color: theme.primaryText }]}>
                        <Text style={[styles.boldText, { color: theme.primaryText }]}>{quizzesToday}</Text> Quizzes gelöst
                        </Text>
                    </View>

                    <View style={styles.separator} />
                    <View style={styles.footerRow}>
                        <Ionicons name="library-outline" size={34} color="#FFD700" />
                        <Text style={[styles.statsFooter, { color: theme.primaryText }]}>
                        Insgesamt hast du <Text style={[styles.boldText, { color: theme.primaryText }]}>{totalSubchapters}</Text> Kapitel{'\n'} gelernt.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
    },
    statsContainer: {
        width: '90%',
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'flex-start',
        marginTop: 20,
        borderColor: '#ccc',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 15,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 22,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statsHeader: {
        fontSize: 22,
        fontFamily: 'Lato-Bold',
        color: '#333',
        marginBottom: 14,
    },
    statsText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 20,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#ccc',
        marginVertical: 15,
    },
    statsFooter: {
        fontSize: 20,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#000',
    },
});

export default StatisticsScreen;
