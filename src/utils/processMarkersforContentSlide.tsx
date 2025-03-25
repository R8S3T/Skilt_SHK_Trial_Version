import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export const processTextWithMarkers = (
    text: string,
    index: number,
    lastIndex: number,
    styles: any,
    imageMap: { [key: string]: any }
) => {
    const content = [];

    // Regex patterns to match markers
    const boldRegex = /\[bold\](.*?)\[\/bold\]/g;
    const underlineRegex = /\[underline\](.*?)\[\/underline\]/g;
    const bgColorLineRegex = /\[bgcolor-line=(#?[a-zA-Z0-9]+)\](.*?)\[\/bgcolor-line\]/g;

    // Process background color lines
    let remainingText = text;

    // Handle background color lines
    remainingText = remainingText.replace(bgColorLineRegex, (match, p1, p2) => {
        content.push(
            <Text key={`${index}-bgcolor-line-${lastIndex}`} style={[styles.contentText, { backgroundColor: p1, padding: 5 }]}>
                {p2}
            </Text>
        );
        return ''; // Remove the processed content from the remaining text
    });

    // Handle bold and underline markers
    remainingText = remainingText.replace(boldRegex, (match, p1) => {
        content.push(
            <Text key={`${index}-bold-${lastIndex}`} style={[styles.contentText, { fontWeight: 'bold' }]}>
                {p1}
            </Text>
        );
        return ''; // Remove the processed content from the remaining text
    });

    remainingText = remainingText.replace(underlineRegex, (match, p1) => {
        content.push(
            <Text key={`${index}-underline-${lastIndex}`} style={[styles.contentText, { textDecorationLine: 'underline' }]}>
                {p1}
            </Text>
        );
        return ''; // Remove the processed content from the remaining text
    });

    // Add any remaining plain text
    if (remainingText) {
        content.push(
            <Text key={`${index}-normal-${lastIndex}`} style={styles.contentText}>
                {remainingText}
            </Text>
        );
    }

    return content;
};


const styles = StyleSheet.create({
    contentText: {
        fontSize: 20,
        marginVertical: 10,
        color: '#000',
        padding: 5,
    },
    image: {
        width: '100%',
        height: 160,
        resizeMode: 'contain',
        marginVertical: 0,
    },
    underlineContainer: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        paddingBottom: 5,
        width: '100%',
        marginVertical: 10,
    },
});

