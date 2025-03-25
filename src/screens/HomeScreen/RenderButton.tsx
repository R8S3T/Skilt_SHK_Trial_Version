import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, StyleProp, ViewStyle, ImageSourcePropType, TextStyle, ImageStyle } from 'react-native';

interface RenderButtonProps {
    title: string;
    onPress: () => void;
    buttonStyle: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    imageSource?: ImageSourcePropType;
}

const RenderButton: React.FC<RenderButtonProps> = ({ title, onPress, buttonStyle, textStyle, imageSource }) => {
    return (
        <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
            {imageSource && <Image source={imageSource} style={styles.buttonImage} />}
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#f6f5f5',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    } as TextStyle,
    buttonImage: {
        width: 50,
        height: 50,
        marginBottom: 10,
        resizeMode: 'contain',
    } as ImageStyle,
});

export default RenderButton;