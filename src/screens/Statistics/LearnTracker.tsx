import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStreakData, updateStreak } from 'src/utils/streakUtils';
import { useTheme } from 'src/context/ThemeContext';

const LearnTracker = () => {
    const { theme } = useTheme();
    const [firstActiveDay, setFirstActiveDay] = useState<string | null>(null);
    const [streak, setStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [activeDays, setActiveDays] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { streak, longestStreak, activeDays } = await getStreakData();
            setStreak(streak);
            setLongestStreak(longestStreak);
            setActiveDays(activeDays);

            if (activeDays.length > 0) {
                setFirstActiveDay(activeDays[0]); 
            }
        };
        fetchData();
    }, []);

    const days = ['S', 'M', 'D', 'M', 'D', 'F', 'S'];
    const todayIndex = new Date().getDay();

    return (
        <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.primaryText }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.primaryText }]}>Lernstrecke</Text>
            </View>

            <View style={[styles.weekContainer, { borderColor: theme.border }]}>
                {days.map((day, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (todayIndex - index));
                    const dateString = date.toDateString();

                    const isActive = activeDays.includes(dateString);
                    const isPastDay = date < new Date() && !isActive;
                    const showMissedX = isPastDay && firstActiveDay && new Date(dateString) >= new Date(firstActiveDay);

                    return (
                        <View key={index} style={styles.dayContainer}>
                            <Text style={[styles.dayText, { color: theme.primaryText }]}>{day}</Text>
                            <View
                                style={[
                                    styles.dayBox,
                                    {
                                        borderColor: isActive ? '#FFA500' : theme.border,
                                    },
                                ]}
                            >
                                {isActive ? (
                                    <Ionicons name="flame" size={18} color="#FFA500" />
                                ) : showMissedX ? (
                                    <Ionicons name="close" size={18} color={theme.secondaryText} />
                                ) : null}
                            </View>
                        </View>
                    );
                })}
            </View>

            <View style={styles.streakInfo}>
                <View style={styles.streakBlock}>
                    <Text style={[styles.streakText, { color: theme.primaryText }]}>Aktuelle Strecke</Text>
                    <View style={styles.streakRow}>
                        <Ionicons name="flame" size={20} color="#FFA500" />
                        <Text style={[styles.streakNumber, { color: theme.primaryText }]}>{streak} {streak === 1 ? 'Tag' : 'Tage'}</Text>
                    </View>
                </View>
                <View style={styles.streakBlock}>
                    <Text style={[styles.streakText, { color: theme.primaryText }]}>Längste Strecke</Text>
                    <View style={styles.streakRow}>
                        <Ionicons name="trophy-outline" size={20} color="#5e87b8" />
                        <Text style={[styles.streakNumber, { color: theme.primaryText }]}>{longestStreak} {longestStreak === 1 ? 'Tag' : 'Tage'}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 15,
        padding: 15,
        width: '90%',
        alignSelf: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Lato-Bold',
        marginLeft: 5,
        marginBottom: 10,
    },
    weekContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    dayContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    dayBox: {
        width: 30,
        height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,
        borderWidth: 2,
    },
    dayText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    streakInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    streakBlock: {
        alignItems: 'center',
    },
    streakRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    streakText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 8,
    },
    streakNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 6,
    },
});

export default LearnTracker;
