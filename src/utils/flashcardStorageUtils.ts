// src/utils/flashcardStorageUtils.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

const INCORRECT_CARDS_KEY = 'incorrect_cards';

// Function to add an incorrect card to AsyncStorage
// src/utils/flashcardStorageUtils.ts

export const addIncorrectCardToStorage = async (chapterId: number, card: { question: string; answer: string }) => {
    try {
        const key = `incorrect_cards_${chapterId}`; // Unique key per chapter
        const storedCards = await AsyncStorage.getItem(key);
        const incorrectCards = storedCards ? JSON.parse(storedCards) : [];

        // Check if the card already exists to avoid duplicates
        const exists = incorrectCards.some(
            (savedCard: { question: string; answer: string }) =>
                savedCard.question === card.question && savedCard.answer === card.answer
        );

        if (!exists) {
            incorrectCards.push(card);
            await AsyncStorage.setItem(key, JSON.stringify(incorrectCards));
        }
    } catch (error) {
    }
};

