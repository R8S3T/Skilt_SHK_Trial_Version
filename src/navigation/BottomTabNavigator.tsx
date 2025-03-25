import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from 'src/screens/HomeScreen/HomeScreen';
import SettingsScreen from 'src/screens/Settings Screen/SettingsScreen';
import SearchScreen from 'src/screens/Search/SearchScreen';
import StatisticsScreen from 'src/screens/Statistics/StatisticsScreen';
import { useTheme } from 'src/context/ThemeContext';
import { screenWidth } from 'src/utils/screenDimensions';

type IconName = 'book' | 'book-outline' | 'settings' | 'settings-outline' | 'search' | 'search-outline' | 'stats-chart' | 'stats-chart-outline';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const { theme, isDarkMode } = useTheme();

    return (
<Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
        tabBarActiveTintColor: isDarkMode ? '#FFA500' : '#e8630a',
        tabBarInactiveTintColor: isDarkMode ? '#AAAAAA' : 'gray',
        tabBarIcon: ({ focused, color, size }) => {
            let iconName: IconName = 'book-outline';

            if (route.name === 'Home') {
                iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Statistics') {
                iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Search') {
                iconName = focused ? 'search' : 'search-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
            backgroundColor: isDarkMode ? '#1c1c1e' : '#ffffff',
            height: screenWidth > 600 ? 80 : 60,
            paddingBottom: screenWidth > 600 ? 10 : 15,
        },
        tabBarIconStyle: {
            marginTop: screenWidth > 600 ? 5 : 0,
        },
        tabBarLabelStyle: {
            fontSize: screenWidth > 600 ? 18 : 14,
        },
    })}
    >
        <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
                tabBarLabel: 'Start',
            }}
        />
        <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{
                tabBarLabel: 'Suche',
                headerTitleAlign: 'center',
            }}
        />
        <Tab.Screen
            name="Statistics"
            component={StatisticsScreen}
            options={{
                tabBarLabel: 'Lernerfolge',
                headerTitleAlign: 'center'
            }} />
        <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
                tabBarLabel: 'Einstellungen',
                headerTitleAlign: 'center',
            }}
        />
    </Tab.Navigator>

    );
};

export default BottomTabNavigator;


