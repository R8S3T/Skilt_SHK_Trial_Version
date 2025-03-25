import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { imageMap } from 'src/utils/imageMappings';
import { useTheme } from 'src/context/ThemeContext';
import { screenWidth } from 'src/utils/screenDimensions';

interface MathContentHandlerProps {
    part: string;
    index: number;
    onQuizComplete?: (isCorrect: boolean) => void;
    onNextSlide?: () => void;
    isLast?: boolean;
    }

const MathContentHandler: React.FC<MathContentHandlerProps> = ({ part, index }) => {
const { theme, isDarkMode } = useTheme();

const renderPart = (part: string, index: number) => {
    const content = [];
    const bgColorBlockRegex = /\[bgcolor-block=(#?[a-zA-Z0-9]+)\]([\s\S]*?)\[\/bgcolor-block\]/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = bgColorBlockRegex.exec(part)) !== null) {
        if (lastIndex < match.index) {
            content.push(...processNormalText(part.slice(lastIndex, match.index), index, lastIndex, theme, isDarkMode));
        }
        const bgColor = isDarkMode ? '#333333' : match[1];
        const bgText = match[2];
        content.push(
            <View key={`${index}-bgcolor-block-${lastIndex}`} style={[styles.bgColorBlock, { backgroundColor: bgColor }]}>
                <Text style={[styles.contentText, { color: theme.primaryText }]}>{bgText}</Text>
            </View>
        );
        lastIndex = match.index + match[0].length;
    }

    // Process any remaining text after the last match
    if (lastIndex < part.length) {
        content.push(...processNormalText(part.slice(lastIndex), index, lastIndex, theme, isDarkMode));
    }
    
    return <View style={styles.fullWidthPartContainer}>{content}</View>;
};


const processNormalText = (text: string, index: number, lastIndex: number, theme: { primaryText: string; secondaryText: string }, isDarkMode: boolean) => {
    const lines = text.split('\n');
    return lines.map((line, subIndex) => {
        const content = [];

        // Check for bullet point
        const bulletRegex = /\[bullet\](.*?)\[\/bullet\]/;
        const bulletMatch = line.match(bulletRegex);
        if (bulletMatch) {
            const bulletText = bulletMatch[1].trim();
            content.push(
                <View key={`${index}-${lastIndex}-${subIndex}-bullet`} style={styles.bulletContainer}>
                    <Text style={styles.bulletSymbol}>◯</Text>
                    <Text style={[styles.contentText, { color: theme.primaryText, marginLeft: 5 }]}>{bulletText}</Text>
                </View>
            );
            return content;
        }
        // Inline background line
        const bgColorLineRegex = /\[bgcolor-line=(#?[a-zA-Z0-9]+)\](.*?)\[\/bgcolor-line\]/;
        const bgColorLineMatch = line.match(bgColorLineRegex);
        if (bgColorLineMatch) {
            const bgColor = bgColorLineMatch[1];
            const bgText = bgColorLineMatch[2];
            content.push(
                <Text key={`${index}-${lastIndex}-${subIndex}`} style={[styles.contentText, { backgroundColor: bgColor, color: theme.primaryText, padding: 5 }]}>
                    {bgText}
                </Text>
            );
            return content;
        }


        // Image handling
        if (line.startsWith('[equations_') || line.startsWith('[bigImage_') || line.startsWith('[small]') || line.startsWith('[welcome]')) {
            const imageName = line.replace('[', '').replace(']', '').trim();
            const imageSource = imageMap[imageName as keyof typeof imageMap];

            // Prüfe, ob das Bild den Dark Mode Marker enthält
            const hasDarkModeMarker = imageName.includes('darkmode');

            if (imageSource) {
                let imageStyle = styles.image; // Standard-Stil

                // Wende spezifische Stile basierend auf dem Bildnamen an
                if (imageName.includes('small')) {
                    imageStyle = styles.smallImage;
                } else if (imageName.includes("big")) {
                    imageStyle = styles.bigImage;
                } else if (imageName.includes("welcome")) {
                    imageStyle = styles.welcomeImage;
                }

                if (imageName.includes("big")) {

                    content.push(
                        <View style={styles.imageContainer} key={`${index}-${lastIndex}-${subIndex}`}>
                            {hasDarkModeMarker && isDarkMode ? (
                                <View style={styles.darkModeImageBackground}>
                                    <Image source={imageSource} style={imageStyle} />
                                </View>
                            ) : (
                                <Image source={imageSource} style={imageStyle} />
                            )}
                        </View>
                    );
                } else {
                    // Standard-Fall für alle anderen Bilder
                    content.push(
                        hasDarkModeMarker && isDarkMode ? (
                            <View key={`${index}-${lastIndex}-${subIndex}`} style={styles.darkModeImageBackground}>
                                <Image source={imageSource} style={imageStyle} />
                            </View>
                        ) : (
                            <Image
                                key={`${index}-${lastIndex}-${subIndex}`}
                                source={imageSource}
                                style={imageStyle}
                            />
                        )
                    );
                }
            }
            return content;
        }


        // Check for heading
        if (line.startsWith('[heading]') && line.endsWith('[/heading]')) {
            const headingText = line.replace('[heading]', '').replace('[/heading]', '');
            content.push(
                <Text key={`${index}-${lastIndex}-${subIndex}-heading`} style={[styles.headingText, { color: theme.primaryText }]}>
                    {headingText}
                </Text>
            );
            return content;
        }

        // Check for subheading
        if (line.startsWith('[subheading]') && line.endsWith('[/subheading]')) {
            const subheadingText = line.replace('[subheading]', '').replace('[/subheading]', '');
            content.push(
                <Text key={`${index}-${lastIndex}-${subIndex}-subheading`} style={[styles.subheadingText, { color: theme.secondaryText }]}>
                    {subheadingText}
                </Text>
            );
            return content;
        }
        // Underline text
        if (line.includes('[underline]') && line.includes('[/underline]')) {
            const underlineText = line.replace('[underline]', '').replace('[/underline]', '');
            content.push(
                <View key={`${index}-${lastIndex}-${subIndex}`} style={[styles.underlineContainer, { borderBottomColor: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                    <Text style={[styles.contentText, { color: theme.primaryText }]}>{underlineText}</Text>
                </View>
            );
            return content;
        }

        // Bold and normal text
        const parts = line.split(/(\[bold\].*?\[\/bold\])/g);
        const lineContent = parts.map((part, partIndex) =>
            part.startsWith('[bold]') && part.endsWith('[/bold]')
                ? <Text key={`${index}-${subIndex}-${partIndex}-bold`} style={[styles.contentText, { fontWeight: 'bold', color: theme.primaryText }]}>{part.replace('[bold]', '').replace('[/bold]', '')}</Text>
                : <Text key={`${index}-${subIndex}-${partIndex}-normal`} style={[styles.contentText, { color: theme.primaryText }]}>{part}</Text>
        );

        return <Text key={`${index}-${lastIndex}-${subIndex}-combined`} style={[styles.contentText, { color: theme.primaryText }]}>{lineContent}</Text>;
    });
};

// At the end of the component:
return <>{renderPart(part, index)}</>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fullWidthPartContainer: {
        flex: 1,
        width: '100%',
        padding: 20,
    },
    partContainer: {
        flex: 1,
        padding: 5,
    },
    flatListContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    image: {
        width: '100%',
        height: screenWidth > 600 ? 250 : 150,
        resizeMode: 'contain',
        marginVertical: 8,
    },
    welcomeImage: {
        width: '100%',
        height: screenWidth > 600 ? 450 : 300,
        resizeMode: 'contain',
        marginVertical: 0,
    },
    imageContainer: {
        marginVertical: 10,
        alignItems: 'center',
        width: '100%',
    },

    bigImage: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginVertical: 0,
    },
    smallImage: {
        width: '100%',
        height: 80,
        resizeMode: 'contain',
        marginVertical: 5,
    },
    darkModeImageBackground: {
        backgroundColor: '#c4c1e0',
        padding: 10,
        alignItems: 'center',
    },
    contentText: {
        fontSize: screenWidth > 600 ? 22 : 19,
        marginVertical: 1.5,
        color: '#000',
        padding: 5,
        letterSpacing: 1.2,
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
        width: '100%',
    },
    underlineContainer: {
        borderBottomWidth: 2,
        paddingBottom: 5,
        width: '100%',
        marginVertical: 10,
    },
    bgColorBlock: {
        padding: 25,
        borderRadius: 5,
        marginVertical: 0,
        borderWidth: 1.5,
        borderColor: 'orange',
    },
        headingText: {
            fontFamily: 'Lato-Bold',
            fontSize: screenWidth > 600 ? 28 : 24,
    },
        subheadingText: {
        fontFamily: 'Lato-Medium',
        fontSize: screenWidth > 600 ? 26 : 23,
    },
        sectionText: {
        fontFamily: 'OpenSans-Semibold',
        fontSize: screenWidth > 600 ? 24 : 21,
        letterSpacing: 1.2,
    },
        boldText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: screenWidth > 600 ? 20 : 19,
    },
    bulletContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    bulletSymbol: {
        fontSize: 10,
    },
});
export default MathContentHandler;
