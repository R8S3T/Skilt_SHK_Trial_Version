import { MathSubchapter } from "./contentTypes";

export interface SubchapterContextType {
    unlockedSubchapters: number[];
    finishedSubchapters: number[];
    currentSubchapterId: number | null;
    currentSubchapterTitle: string;
    unlockSubchapter: (subchapterId: number, chapterId: number) => void;
    markSubchapterAsFinished: (subchapterId: number, chapterId: number) => void;
    markQuizAsFinished: (quizId: number) => void;
    setCurrentSubchapter: (subchapterId: number | null, subchapterTitle: string) => void;
    getFinishedSubchaptersToday: () => Promise<number>;
    getFinishedQuizzesToday: () => Promise<number>;
    getTotalFinishedSubchapters: () => Promise<number>;
    triggerStatisticsUpdate: () => Promise<{ 
        updatedSubchapters: number; 
        updatedQuizzes: number; 
        totalFinished: number;
    }>;
}

export interface MathSubchapterContextType {
    unlockedSubchapters: number[];
    finishedSubchapters: number[];
    currentSubchapterId: number | null;
    currentSubchapterTitle: string;
    unlockSubchapter: (subchapterId: number) => void;
    markSubchapterAsFinished: (subchapterId: number) => void;
    setCurrentSubchapter: (subchapterId: number | null, subchapterTitle: string) => void;
    subchapters: MathSubchapter[];
    setSubchapters: (subchapters: MathSubchapter[]) => void;
    markMathQuizAsFinished: (quizId: number) => Promise<void>;
    getFinishedMathSubchaptersToday?: () => Promise<number>;  // Optional if needed
    getFinishedMathQuizzesToday?: () => Promise<number>;
    getTotalFinishedMathSubchapters?: () => Promise<number>;
}
