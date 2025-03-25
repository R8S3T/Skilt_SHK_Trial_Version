import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/context/ThemeContext';

interface StatsDetailsProps {
    title: string;
    stats: {
        label: string;
        value: number;
        icon: keyof typeof Ionicons['glyphMap'];
        color: string;
    }[];
}

const StatsDetails: React.FC<StatsDetailsProps> = ({ title, stats }) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
            <Text style={[styles.header, { color: theme.primaryText }]}>{title}</Text>
            {stats.map((stat, index) => (
                <View key={index} style={styles.statRow}>
                    <Ionicons name={stat.icon} size={24} color={stat.color} />
                    <Text style={[styles.statLabel, { color: theme.primaryText }]}>{stat.label}</Text>
                    <Text style={[styles.statValue, { color: theme.primaryText }]}>{stat.value}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 12,
        marginVertical: 10,
        width: '90%',
        alignSelf: 'center',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    statLabel: {
        fontSize: 16,
        flex: 1,
        marginLeft: 10,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default StatsDetails;
