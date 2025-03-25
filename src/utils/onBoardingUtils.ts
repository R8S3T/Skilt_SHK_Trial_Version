// src/utils/onBoardingUtils.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'hasOnboarded';
const PROGRESS_KEY = 'hasProgress';

/**
 * Set the onboarding flag after the user completes onboarding.
 */
export const setOnboardingComplete = async (): Promise<void> => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
};

/**
 * Check if the onboarding process has already been completed.
 * @returns {Promise<boolean>} True if onboarding has been completed, false otherwise.
 */
export const hasCompletedOnboarding = async (): Promise<boolean> => {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value !== null;
};

/**
 * Set progress flag when user views some content in Section1.
 */
export const setProgressComplete = async (): Promise<void> => {
    await AsyncStorage.setItem(PROGRESS_KEY, 'true');
};

/**
/**
 * Check if the user has made progress in content (for showing ResumeSection).
 * @returns {Promise<boolean>} True if progress has been made, false otherwise.
 */
export const hasMadeProgress = async (): Promise<boolean> => {
    try {
        const progressData = await AsyncStorage.getItem('progress_section1');
        
        if (progressData) {
            const parsedProgress = JSON.parse(progressData);
            // Check if there's valid progress
            return parsedProgress.chapterId !== null && parsedProgress.subchapterId !== null;
        }
        return false;
    } catch (error) {
        return false;
    }
};

