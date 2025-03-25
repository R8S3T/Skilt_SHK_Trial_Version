import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MathChapterScreen from 'src/screens/MathScreen/MathChapterScreen';
import MathSubchapterContentScreen from 'src/screens/MathScreen/MathSubchapterContentScreen';
import MathSubchapterScreen from 'src/screens/MathScreen/MathSubchapterScreen';
import MathCongratsScreen from 'src/screens/MathScreen/MathCongratsScreen';
import { MathStackParamList } from 'src/types/navigationTypes';

const Stack = createStackNavigator<MathStackParamList>();

const MathStackNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}
        >
            <Stack.Screen
                name="MathChapterScreen" 
                component={MathChapterScreen}
                options={{
                    title: 'Wähle dein Modul',
                    headerTitleAlign: 'left',
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                }}
            />
            <Stack.Screen
                name="MathSubchapterScreen"
                component={MathSubchapterScreen}
                options={({ route }) => ({
                    title: route.params.chapterTitle || 'Modul',
                    headerTitleAlign: 'left',
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                })}
            />
            <Stack.Screen
                name="MathSubchapterContentScreen"
                component={MathSubchapterContentScreen}
                options={({ route }) => ({
                    title: route.params.subchapterTitle || 'Inhalt', // Dynamically show subchapter title
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                })}
            />
            <Stack.Screen
                name="MathCongratsScreen"
                component={MathCongratsScreen}
                options={{ title: 'Congratulations' }}
            />
        </Stack.Navigator>
    );
};

export default MathStackNavigator;


