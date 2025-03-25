import { NavigatorScreenParams } from "@react-navigation/native";
import { MathMiniQuiz, GenericContent } from "./contentTypes";

export type HomeParamList = {
    Home: { username: string };
};

export type BottomTabParamList = {
    Home: { username: string };
    Settings: undefined;
};

export type LearnStackParamList = {
    HomeScreen: undefined;
    YearsScreen: {
        chapterId?: number;
        chapterTitle?: string;
        subchapterId?: number;
        subchapterTitle?: string;
        origin?: string;
    };
    ChaptersScreen: { year: string };
    SubchaptersScreen: { chapterId: number; chapterTitle?: string; origin?: string };
    SubchapterContentScreen: {
        subchapterId: number;
        subchapterTitle: string;
        chapterId?: number;
        chapterTitle?: string;
        currentIndex?: number;
        onCompletion?: () => void;
        origin?: string;
        previousScreen?: string;
    };
    CongratsScreen: {
        targetScreen: keyof LearnStackParamList | keyof MathStackParamList | 'HomeScreen';
        targetParams: { 
            chapterId: number; 
            chapterTitle: string; 
            origin?: string;  // Ensure origin is defined as optional
            previousScreen?: string; 
        };
    };
};

export type MathStackParamList = {
    MathChapterScreen: undefined;
    MathSubchapterScreen: {
        chapterId: number;
        chapterTitle: string;
        origin?: string;
    };
    MathSubchapterContentScreen: {
        subchapterId: number;
        subchapterTitle: string;
        chapterId: number;
        chapterTitle: string;
        origin?: string;
        preloadedContent?: GenericContent[]; // Add preloaded content
        preloadedQuiz?: MathMiniQuiz | null; // Add preloaded quiz
    };
    MathCongratsScreen: {
        subchapterId: number;
        targetScreen: keyof MathStackParamList;
        targetParams: {
            chapterId: number;
            chapterTitle: string;
            origin?: string;
        };
    };
    HomeScreen: undefined;
};

// A TypeScript type that defines all possible navigation paths and parameters in AppNavigator, ensuring that navigation across the entire app is type-safe and well-organized.

export type RootStackParamList = {
    Intro: undefined;
    HomeScreen: { screen?: keyof RootStackParamList };    
    Search: undefined;
    SearchEndScreen: undefined;
    Learn: NavigatorScreenParams<LearnStackParamList>;
    Math: NavigatorScreenParams<MathStackParamList>;
    CongratsScreen: {
        targetScreen: keyof RootStackParamList;
        targetParams: { 
            chapterId: number; 
            chapterTitle: string; 
            origin?: string;
            previousScreen?: string;
        };
    };
    SubchaptersScreen: { chapterId: number; chapterTitle: string };    FlashCardChoice: undefined;
    FlashCardChapters: undefined;
    FlashcardScreen: {
        chapterId: number;
        chapterTitle?: string;
    };
    FlashCardRepeat: { chapterId: number } | undefined;
    PrivacyPolicyScreen: undefined;
    TermsOfServiceScreen: undefined;
    ImpressumScreen: undefined;
};


