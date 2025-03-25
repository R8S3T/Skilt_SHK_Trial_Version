// src/components/GenericNode.tsx

import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { getDynamicIconSize, screenWidth } from 'src/utils/screenDimensions';
import { useTheme } from 'src/context/ThemeContext';

interface GenericNodeProps {
    id: number;
    isLocked: boolean;
    isFinished: boolean;
    onPress: () => void;
    title: string;
    color: string;
    finishedColor: string;
}

const GenericNode: React.FC<GenericNodeProps> = ({
    isLocked,
    isFinished,
    onPress,
    title,
    color,
    finishedColor,
    id
}) => {
    const { isDarkMode, theme } = useTheme();
    const dynamicNodeSize = getDynamicIconSize(70, 90);
    const dynamicIconSize = getDynamicIconSize(40, 50);

    const iconSource = isFinished
    ? require('../../assets/Images/ok_icon.png')
    : isLocked
        ? require('../../assets/Images/lock_icon.png')
        : require('../../assets/Images/play_icon.png');


    const dynamicStyles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            marginVertical: 5,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: isFinished ? finishedColor : isLocked ? '#A9A9A9' : '#A9A9A9',
            backgroundColor: isFinished ? '#FFFFFF' : isLocked ? '#f0f0f0' : '#FFFFFF',
            paddingVertical: 8,
            paddingHorizontal: 15,
            ...(isDarkMode && {
                backgroundColor: isLocked ? theme.background : theme.surface,
                borderColor: isLocked ? '#A9A9A9' : isFinished ? finishedColor : theme.primaryText,
            }),
        },
        iconContainer: {
            width: dynamicNodeSize,
            height: dynamicNodeSize,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            marginRight: 15,
        },
        icon: {
            width: dynamicIconSize,
            height: dynamicIconSize,
            tintColor: isFinished ? finishedColor : isLocked ? '#A9A9A9' : '#A9A9A9',
        },
        text: {
            flex: 1,
            fontSize: screenWidth > 600 ? 20 : 18,
            color: isFinished 
                ? '#333333' 
                : isLocked 
                    ? '#A9A9A9' 
                    : '#000000',
                    ...(isDarkMode && {
                        color: isFinished 
                            ? finishedColor || '#FFFFFF' // Falls `finishedColor` nicht gesetzt ist, nutze Weiß
                            : isLocked 
                                ? '#A9A9A9' 
                                : theme.primaryText,
                    }),
        },
    });

    return (
        <TouchableOpacity 
            onPress={onPress}
            style={dynamicStyles.container} 
        >
            <View style={dynamicStyles.iconContainer}>
                <Image source={iconSource} style={dynamicStyles.icon} resizeMode="contain" />
            </View>
            <Text style={dynamicStyles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

export default GenericNode;