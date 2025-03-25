import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ViewStyle } from 'react-native';
import { imageMap } from 'src/utils/imageMappings';
import ImageModal from 'react-native-image-modal';
import { useTheme } from 'src/context/ThemeContext';
import { screenWidth } from 'src/utils/screenDimensions';

const deviceWidth = Dimensions.get('window').width;

interface ContentHandlerProps {
  part: string;
  style?: ViewStyle;
}

const ContentHandler: React.FC<ContentHandlerProps> = ({ part }) => {
  const { theme, isDarkMode } = useTheme(); // Access theme and dark mode status

  // Handle special markers like frame, bullet point, images, etc.
  if (part.startsWith('[frame]') && part.endsWith('[/frame]')) {
    const frameText = part.replace('[frame]', '').replace('[/frame]', '');
  
    // Process the text inside the frame for nested markers
    const processNestedMarkers = (text: string) => {
      const nestedParts = text.split(/(\[bold\].*?\[\/bold\])|(\[lowText\].*?\[\/lowText\])/g);
  
      return nestedParts.map((nestedPart, nestedIndex) => {
        if (!nestedPart) return null;
  
        if (nestedPart.startsWith('[bold]') && nestedPart.endsWith('[/bold]')) {
          const boldText = nestedPart.replace('[bold]', '').replace('[/bold]', '');
          return (
            <Text key={nestedIndex} style={[styles.boldText, { color: theme.primaryText }]}>
              {boldText}
            </Text>
          );
        }
  
        // Default to regular text for other parts
        return (
          <Text key={nestedIndex} style={[styles.contentText, { color: theme.primaryText }]}>
            {nestedPart}
          </Text>
        );
      });
    };
  
    return (
      <View style={[styles.frameWithBulb, { backgroundColor: theme.surface }]}>
        <Image source={require('assets/Images/info_sign.png')} style={styles.infoSign} />
        <Text style={[styles.contentText, { color: theme.primaryText }]}>
          {processNestedMarkers(frameText)}
        </Text>
      </View>
    );
  }
  

  if (part.startsWith('[bullet]') && part.endsWith('[/bullet]')) {
    const bulletText = part.replace('[bullet]', '').replace('[/bullet]', '');
  
    // Process the text inside the bullet for nested markers
    const processNestedMarkers = (text: string) => {
      const nestedParts = text.split(/(\[bold\].*?\[\/bold\])|(\[lowText\].*?\[\/lowText\])/g);
  
      return nestedParts.map((nestedPart, nestedIndex) => {
        if (!nestedPart) return null;
  
        if (nestedPart.startsWith('[bold]') && nestedPart.endsWith('[/bold]')) {
          const boldText = nestedPart.replace('[bold]', '').replace('[/bold]', '');
          return (
            <Text key={nestedIndex} style={[styles.boldText, { color: theme.primaryText }]}>
              {boldText}
            </Text>
          );
        }
  
        if (nestedPart.startsWith('[lowText]') && nestedPart.endsWith('[/lowText]')) {
          const lowText = nestedPart.replace('[lowText]', '').replace('[/lowText]', '');
          return (
            <Text key={nestedIndex} style={[styles.lowText, { color: theme.secondaryText }]}>
              {lowText}
            </Text>
          );
        }
  
        // Default to regular text for other parts
        return (
          <Text key={nestedIndex} style={[styles.contentText, { color: theme.primaryText }]}>
            {nestedPart}
          </Text>
        );
      });
    };
  
    return (
      <View style={styles.bulletTextContainer}>
        <Text style={[styles.bulletPoint, { color: theme.primaryText }]}>○</Text>
        <Text style={[styles.bulletText, { color: theme.primaryText }]}>
          {processNestedMarkers(bulletText)}
        </Text>
      </View>
    );
  }
  

  if (part.startsWith('[LF_')) {
    const imageName = part.replace('[', '').replace(']', '').trim();
    const imageSource = imageMap[imageName as keyof typeof imageMap];
    
    if (imageSource) {
      const markers = imageName.split('_').map(marker => marker.toLowerCase());
      let imageStyle = styles.image;
      const isZoomable = markers.includes('zoom');
      const isWelcome = markers.includes('welcome');
      const isSmall = markers.includes('small');
      const isIcon = imageName.startsWith('LF_icon');

      if (isWelcome) {
        imageStyle = styles.welcomeImage;
      } else if (isSmall) {
        imageStyle = styles.smallImage;
      }

      return (
        <View style={[
          styles.imageContainer,
          isDarkMode && !isIcon && !imageName.toLowerCase().includes('formel') && styles.darkImageContainer
        ]}>
              {isZoomable ? (
                <ImageModal
                    source={imageSource}
                    resizeMode="contain"
                    overlayBackgroundColor={isDarkMode ? '#6c7b95' : '#c1c1c1'}
                    modalImageStyle={{
                        width: deviceWidth * 0.95,
                        height: deviceWidth * 0.85,
                        borderRadius: 10,
                    }}
                    style={{
                        width: deviceWidth * 0.9,
                        height: deviceWidth * 0.75,
                    }}
                />
          ) : (
            <Image source={imageSource} style={imageStyle} resizeMode="contain" />
          )}
        </View>
      );
    } else {
      console.warn(`Image not found for key: ${imageName}`);
    }
  }


  const processText = (text: string) => {
    const parts = text.split(/(\[bold\].*?\[\/bold\])|(\[heading\].*?\[\/heading\])|(\[subheading\].*?\[\/subheading\])|(\[section\].*?\[\/section\])|(\[lowText\].*?\[\/lowText\])/g);

    return (
      <Text style={[styles.contentText, { color: theme.primaryText }]}>
        {parts.map((part, index) => {
          if (!part) return null;

          if (part.startsWith('[heading]') && part.endsWith('[/heading]')) {
            const headingText = part.replace('[heading]', '').replace('[/heading]', '');
            return (
              <Text key={index} style={[styles.headingText, { color: theme.primaryText }]}>
                {headingText}
              </Text>
            );
          }

          if (part.startsWith('[subheading]') && part.endsWith('[/subheading]')) {
            const subheadingText = part.replace('[subheading]', '').replace('[/subheading]', '');
            return (
              <Text key={index} style={[styles.subheadingText, { color: theme.secondaryText }]}>
                {subheadingText}
              </Text>
            );
          }

          if (part.startsWith('[section]') && part.endsWith('[/section]')) {
            const sectionText = part.replace('[section]', '').replace('[/section]', '');
            return (
              <Text key={index} style={[styles.sectionText, { color: theme.primaryText }]}>
                {sectionText}
              </Text>
            );
          }

          if (part.startsWith('[bold]') && part.endsWith('[/bold]')) {
            const boldText = part.replace('[bold]', '').replace('[/bold]', '');
            return (
              <Text key={index} style={[styles.boldText, { color: theme.primaryText }]}>
                {boldText}
              </Text>
            );
          }

          if (part.startsWith('[lowText]') && part.endsWith('[/lowText]')) {
            const lowText = part.replace('[lowText]', '').replace('[/lowText]', '');
            return (
              <Text key={index} style={[styles.lowText, { color: theme.primaryText }]}>
                {lowText}
              </Text>
            );
          }

          return part.trim() !== '' ? (
            <Text key={index} style={[styles.contentText, { color: theme.primaryText }]}>
              {part}
            </Text>
          ) : null;
        })}
      </Text>
    );
  };

  return <>{processText(part)}</>;
};

const styles = StyleSheet.create({
  contentText: {
    fontFamily: 'OpenSans-Regular',
    lineHeight: screenWidth > 600 ? 28 : 24,
    fontSize: screenWidth > 600 ? 22 : 19,
    letterSpacing: 0.9,
    marginTop: 5,
  },
  lowText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: screenWidth > 600 ? 16 : 14,
    lineHeight: screenWidth > 600 ? 22 : 20,
    fontWeight: 'bold',
  },
  darkImageContainer: {
    backgroundColor: '#a6a6a6',

    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 10,
  },
  imageContainer: {
    marginVertical: 15,
    alignItems: 'center',
    width: '100%',
  },
  boldText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: screenWidth > 600 ? 20 : 19,
  },
  headingText: {
    fontFamily: 'Lato-Medium',
    lineHeight: screenWidth > 600 ? 36 : 30,
    fontSize: screenWidth > 600 ? 28 : 24,
  },
  subheadingText: {
    fontFamily: 'Lato-Bold',
    fontSize: screenWidth > 600 ? 26 : 23,
  },
  sectionText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: screenWidth > 600 ? 24 : 21,
    letterSpacing: 1.2,
  },
  frameWithBulb: {
    position: 'relative',
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 20,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  infoSign: {
    width: screenWidth > 600 ? 48 : 32,
    height: screenWidth > 600 ? 48 : 32,
    position: 'absolute',
    top: screenWidth > 600 ? 25 : 30,
    left: screenWidth > 600 ? -40 : -30,
  },
  image: {
    width: '100%',
    height: screenWidth > 600 ? 250 : 200,
    resizeMode: 'contain',
    marginVertical: 0,
  },
  welcomeImage: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
    marginVertical: screenWidth > 600 ? 25 : 10,
  },
  smallImage: {
    width: '100%',
    height: screenWidth > 600 ? 120 : 110,
    resizeMode: 'contain',
    marginVertical: screenWidth > 600 ? 10 : 5,
  },
  zoomIcon: {
    position: 'absolute',
    bottom: screenWidth > 600 ? 12 : 8,
    right: screenWidth > 600 ? 12 : 8,
    width: screenWidth > 600 ? 36 : 24,
    height: screenWidth > 600 ? 36 : 24,
  },
  bulletTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 10,
    width: '100%',
  },
  bulletPoint: {
    width: screenWidth > 600 ? 14 : 10,
    fontSize: screenWidth > 600 ? 14 : 18,
    lineHeight: screenWidth > 600 ? 28 : 24,
    marginRight: 10,
    textAlign: 'center',
  },
  bulletText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: screenWidth > 600 ? 22 : 19, // Larger for tablets
    lineHeight: screenWidth > 600 ? 28 : 24,
    flex: 1,
    flexWrap: 'wrap',
  },
});

export default ContentHandler;
