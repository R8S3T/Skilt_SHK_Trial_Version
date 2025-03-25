import * as Font from 'expo-font';

export async function loadFonts() {
    await Font.loadAsync({
        // Lato for headings
        'Lato-Medium': require('../../assets/Fonts/lato/Lato-Medium.ttf'),
        'Lato-Regular': require('../../assets/Fonts/lato/Lato-Regular.ttf'),
        'Lato-Bold': require('../../assets/Fonts/lato/Lato-Bold.ttf'),
        'Lato-Semibold': require('../../assets/Fonts/lato/Lato-Semibold.ttf'),

        // Open Sans for body content
        'OpenSans-Regular': require('../../assets/Fonts/open-sans/OpenSans-Regular.ttf'),
        'OpenSans-Semibold': require('../../assets/Fonts/open-sans/OpenSans-Semibold.ttf'),
        'OpenSans-Bold': require('../../assets/Fonts/open-sans/OpenSans-Bold.ttf')
    });
}