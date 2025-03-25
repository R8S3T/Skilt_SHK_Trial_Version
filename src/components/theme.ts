// src/theme/theme.ts

export const lightTheme = {
    background: '#ffffff',
    surface: 'transparent',
    primaryText: '#333333',
    secondaryText: '#666666',
    accent: '#e8630a',
    border: '#e3e3e3',
};

export const darkTheme = {
    background: '#1c1c1e',
    surface: '#1c1c1e',
    primaryText: '#f5f5f5',
    secondaryText: '#c7c7c7',
    accent: '#e8630a',
    border: '#444444',
};

// Utility function to lighten colors
export const lightenColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;

    return (
        '#' +
        (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
            .toString(16)
            .slice(1)
    );
};