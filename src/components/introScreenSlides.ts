import React from 'react';

// Define the TypeScript type for the slides
export interface Slide {
    key: string;
    animation?: any;       // For Lottie animations
    image?: any;           // For PNG images
    title?: string;
    text?: string;
    backgroundColor: string;
    renderInputField?: boolean;
}

export const slides: Slide[] = [
    {
        key: 'one',
        animation: require('../../assets/Animations/fireworks_animation.json'),
        title: 'Willkommen bei Skilt',
        text: 'Skilt ist dein Begleiter in der Ausbildung – ideal für das Lernen unterwegs und zwischendurch!',
        backgroundColor: '#f6f5f5',
    },
    {
        key: 'two',
        image: require('../../assets/Images/doughnut_bite.png'),
        title: 'Lernen in kleinen Wissens-Häppchen',
        text: 'Kurze Lerneinheiten, die dir das Fachwissen in kleinen Häppchen vermitteln. So wird die Theorie greifbarer und leichter zugänglich!',
        backgroundColor: '#f6f5f5',
    },
    {
        key: 'three',
        image: require('../../assets/Images/quiz.png'),
        title: 'Interaktive Quizzes',
        text: 'Nutze unsere Quizzes und Lernkarten, um dein Wissen zu überprüfen und sicher zu verankern!',
        backgroundColor: '#f6f5f5',
    },
    {
        key: 'four',
        image: require('../../assets/Images/math_intro.png'),
        title: 'Grundlagen Fachmathematik',
        text: 'Wiederhole die wichtigsten Mathematik-Grundlagen für dein Fachgebiet und vertiefe dein Wissen gezielt!',
        backgroundColor: '#f6f5f5',
    },
    {
        key: 'five',
        image: require('../../assets/Images/Hallo_intro.png'),
        backgroundColor: '#f6f5f5',
        renderInputField: true,
    },
];
