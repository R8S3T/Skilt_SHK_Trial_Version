import AsyncStorage from "@react-native-async-storage/async-storage";

const STREAK_KEY = '@user_streak';
const LAST_ACTIVE_DATE_KEY = '@last_active_date';
const LONGEST_STREAK_KEY = '@longest_streak';
const ACTIVE_DAYS_KEY = '@active_days';

// Function to get the current and longest streak
export const getStreakData = async () => {
    try {
        const streak = parseInt(await AsyncStorage.getItem(STREAK_KEY) || '0', 10);
        const longestStreak = parseInt(await AsyncStorage.getItem(LONGEST_STREAK_KEY) || '0', 10);
        const storedActiveDays = await AsyncStorage.getItem(ACTIVE_DAYS_KEY);
        const activeDaysObj: Record<string, string[]> = storedActiveDays ? JSON.parse(storedActiveDays) : {};

        const activeDays = Object.keys(activeDaysObj);

        return { streak, longestStreak, activeDays };
    } catch (error) {
        console.error('Error retrieving streak data:', error);
        return { streak: 0, longestStreak: 0, activeDays: [] };
    }
};


// Function to update the streak based on user activity
export const updateStreak = async (actionType: 'math' | 'chapter' | 'flashcard') => {
    try {
        const today = new Date().toDateString();
        const lastActiveDate = await AsyncStorage.getItem(LAST_ACTIVE_DATE_KEY);
        let streak = parseInt(await AsyncStorage.getItem(STREAK_KEY) || '0', 10);
        let longestStreak = parseInt(await AsyncStorage.getItem(LONGEST_STREAK_KEY) || '0', 10);
        const storedActiveDays = await AsyncStorage.getItem(ACTIVE_DAYS_KEY);
        let activeDays: Record<string, string[]> = storedActiveDays ? JSON.parse(storedActiveDays) : {};

        // Falls der heutige Tag noch nicht existiert, erstelle ihn
        if (!activeDays[today]) {
            activeDays[today] = [];
        }

        // Falls die Aktion für heute noch nicht gespeichert wurde, füge sie hinzu
        if (!activeDays[today].includes(actionType)) {
            activeDays[today].push(actionType);
        } else {
            return; // Falls Aktion schon gespeichert ist, nichts weiter tun
        }

        // Streak-Logik aktualisieren (nur, wenn es die erste Aktivität des Tages ist)
        if (lastActiveDate === new Date(Date.now() - 86400000).toDateString()) {
            streak += 1;
        } else if (lastActiveDate !== today) {
            streak = 1;
        }

        longestStreak = Math.max(longestStreak, streak);

        await AsyncStorage.setItem(LAST_ACTIVE_DATE_KEY, today);
        await AsyncStorage.setItem(STREAK_KEY, streak.toString());
        await AsyncStorage.setItem(LONGEST_STREAK_KEY, longestStreak.toString());
        await AsyncStorage.setItem(ACTIVE_DAYS_KEY, JSON.stringify(activeDays));
        
    } catch (error) {
        console.error('Error updating streak:', error);
    }
};
