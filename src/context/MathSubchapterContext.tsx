import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MathSubchapterContextType } from 'src/types/contextTypes';
import { MathSubchapter } from 'src/types/contentTypes';
import { fetchMathChapters, fetchMathSubchaptersByChapterId } from 'src/database/databaseServices';

const MathSubchapterContext = createContext<MathSubchapterContextType | undefined>(undefined);

interface MathSubchapterProviderProps {
    children: ReactNode;
}

export const useMathSubchapter = (): MathSubchapterContextType => {
    const context = useContext(MathSubchapterContext);
    if (!context) {
        throw new Error('useMathSubchapter must be used within a MathSubchapterProvider');
    }
    return context;
};

export const MathSubchapterProvider: React.FC<MathSubchapterProviderProps> = ({ children }) => {
    const [unlockedSubchapters, setUnlockedSubchapters] = useState<number[]>([18]);
    const [finishedSubchapters, setFinishedSubchapters] = useState<number[]>([]);
    const [currentSubchapterId, setCurrentSubchapterId] = useState<number | null>(null);
    const [currentSubchapterTitle, setCurrentSubchapterTitle] = useState<string>('');
    const [subchapters, setSubchapters] = useState<MathSubchapter[]>([]);

    const loadSavedProgress = async () => {
        try {
            const savedUnlocked = await AsyncStorage.getItem('mathUnlockedSubchapters');
            const savedFinished = await AsyncStorage.getItem('mathFinishedSubchapters');
            const initialUnlocked: number[] = savedUnlocked ? JSON.parse(savedUnlocked) : [];
            const initialFinished: number[] = savedFinished ? JSON.parse(savedFinished) : [];

            // Fetch all chapters and subchapters
            const allChapters = await fetchMathChapters();
            const allSubchaptersPromises = allChapters.map((chapter) =>
                fetchMathSubchaptersByChapterId(chapter.ChapterId)
            );
            const allSubchapters = (await Promise.all(allSubchaptersPromises)).flat();

            setSubchapters(allSubchapters);

            // Updated firstSubchapters logic
            const firstSubchapters = allChapters.map((chapter) => {
                const chapterSubchapters = allSubchapters.filter(
                    (sub) => sub.ChapterId === chapter.ChapterId
                );

                return chapterSubchapters.reduce(
                    (min, sub) =>
                        min && sub.SortOrder !== undefined && sub.SortOrder < min.SortOrder
                            ? sub
                            : min,
                    chapterSubchapters[0] || null // Fallback to the first subchapter
                );
            });

            // Always include the first subchapter in unlocked subchapters
            const firstUnlockedIds = firstSubchapters
                .filter((sub): sub is MathSubchapter => sub !== undefined) // Filter out undefined values
                .map((sub) => sub.SubchapterId);
            const combinedUnlocked = [...new Set([...initialUnlocked, ...firstUnlockedIds])];

            setUnlockedSubchapters(combinedUnlocked);
            setFinishedSubchapters(initialFinished);

            // Persist unlocked subchapters
            await AsyncStorage.setItem('mathUnlockedSubchapters', JSON.stringify(combinedUnlocked));

        } catch (error) {
        }
    };


    // Call loadSavedProgress in useEffect
    useEffect(() => {
        if (subchapters.length === 0) {
            loadSavedProgress();
        }
    }, [subchapters.length]);

    const unlockSubchapter = (subchapterId: number) => {
        setUnlockedSubchapters((current) => {
            if (!current.includes(subchapterId)) {
                const updated = [...current, subchapterId];

                // Ensure the first subchapter of each chapter remains unlocked
                const firstSubchapters = subchapters.reduce((firsts, sub) => {
                    if (
                        !firsts[sub.ChapterId] ||
                        sub.SortOrder < firsts[sub.ChapterId]!.SortOrder // Access SortOrder safely
                    ) {
                        firsts[sub.ChapterId] = sub; // Store full subchapter object
                    }
                    return firsts;
                }, {} as Record<number, MathSubchapter>);

                const alwaysUnlocked = [
                    ...new Set([...updated, ...Object.values(firstSubchapters).map((sub) => sub.SubchapterId)]),
                ];

                AsyncStorage.setItem('mathUnlockedSubchapters', JSON.stringify(alwaysUnlocked));
                return alwaysUnlocked;
            }
            return current;
        });
    };

    const markSubchapterAsFinished = async (subchapterId: number) => {
        const today = new Date().toISOString().split('T')[0];


        // Add the subchapter to finishedSubchapters
        setFinishedSubchapters((current) => {
            if (!current.includes(subchapterId)) {
                const updatedFinished = [...current, subchapterId];
                AsyncStorage.setItem('mathFinishedSubchapters', JSON.stringify(updatedFinished));

                AsyncStorage.setItem(`mathFinishedSubchapter_${subchapterId}`, today);
                return updatedFinished;
            }
            return current;
        });

        const currentSubchapter = subchapters.find((sub) => sub.SubchapterId === subchapterId);
        if (currentSubchapter) {
            const nextSubchapter = subchapters.find(
                (sub) => sub.SortOrder === currentSubchapter.SortOrder + 1
            );
            if (nextSubchapter && !unlockedSubchapters.includes(nextSubchapter.SubchapterId)) {
                unlockSubchapter(nextSubchapter.SubchapterId);
            }
        }

        // Ensure the first subchapter of the chapter is always unlocked
        const firstSubchapter = subchapters
            .filter((sub) => sub.ChapterId === currentSubchapter?.ChapterId)
            .reduce(
                (min, sub) => (min && sub.SortOrder < min.SortOrder ? sub : min),
                subchapters[0] || null // Provide a fallback value if subchapters array is empty
            );

        if (firstSubchapter && !unlockedSubchapters.includes(firstSubchapter.SubchapterId)) {
            unlockSubchapter(firstSubchapter.SubchapterId);
        }
    };


    const setCurrentSubchapter = (subchapterId: number | null, subchapterTitle: string) => {
        if (subchapterId !== null && !unlockedSubchapters.includes(subchapterId)) {
            unlockSubchapter(subchapterId);
        }

        setCurrentSubchapterId(subchapterId);
        setCurrentSubchapterTitle(subchapterTitle);
    };

    const markMathQuizAsFinished = async (quizId: number) => {
        const today = new Date().toISOString().split('T')[0];
        const storedFinished = await AsyncStorage.getItem('mathFinishedQuizzes');
        const finishedIds: number[] = storedFinished ? JSON.parse(storedFinished) : [];

        if (!finishedIds.includes(quizId)) {
            const updated = [...finishedIds, quizId];
            await AsyncStorage.setItem('mathFinishedQuizzes', JSON.stringify(updated));
            await AsyncStorage.setItem(`mathFinishedQuiz_${quizId}`, today);
        }
    };

    const getFinishedMathSubchaptersToday = async (): Promise<number> => {
        const today = new Date().toISOString().split('T')[0];
        let count = 0;
        try {
            const storedFinished = await AsyncStorage.getItem('mathFinishedSubchapters');
            if (storedFinished) {
                const finishedIds: number[] = JSON.parse(storedFinished);
                for (const id of finishedIds) {
                    const storedDate = await AsyncStorage.getItem(`mathFinishedSubchapter_${id}`);
                    if (storedDate === today) {
                        count++;
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
        return count;
    };
    
    const getFinishedMathQuizzesToday = async (): Promise<number> => {
        const today = new Date().toISOString().split('T')[0];
        let count = 0;
        try {
            const storedFinished = await AsyncStorage.getItem('mathFinishedQuizzes');
            if (storedFinished) {
                const finishedIds: number[] = JSON.parse(storedFinished);
                for (const id of finishedIds) {
                    const storedDate = await AsyncStorage.getItem(`mathFinishedQuiz_${id}`);
                    if (storedDate === today) {
                        count++;
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
        return count;
    };

    const getTotalFinishedMathSubchapters = async (): Promise<number> => {
        try {
            const storedFinished = await AsyncStorage.getItem('mathFinishedSubchapters');
            return storedFinished ? JSON.parse(storedFinished).length : 0;
            } catch (error) {
            console.error(error);
            return 0;
            }
        };


    return (
        <MathSubchapterContext.Provider
            value={{
                unlockedSubchapters,
                finishedSubchapters,
                currentSubchapterId,
                currentSubchapterTitle,
                unlockSubchapter,
                markSubchapterAsFinished,
                markMathQuizAsFinished,
                setCurrentSubchapter,
                subchapters,
                setSubchapters,
                getFinishedMathSubchaptersToday,
                getFinishedMathQuizzesToday,
                getTotalFinishedMathSubchapters,
            }}
        >
            {children}
        </MathSubchapterContext.Provider>
    );
};

export { MathSubchapterContext };
