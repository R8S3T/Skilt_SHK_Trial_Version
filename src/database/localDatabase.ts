import { initializeDatabase } from './initializeLocalDatabase';

import { 
    Chapter,
    Subchapter,
    GenericContent,
    MathChapter,
    MathSubchapter,
    Quiz,
    MultipleChoiceOption,
    MathMiniQuiz,
    ClozeTestOption
} from '../types/contentTypes';


export interface SubchapterWithPreview extends Subchapter {
    ContentPreview: string; // Fügt eine Vorschau des Inhalts hinzu
}
// Fetch chapters by year from local SQLite database
export async function fetchChaptersByYear(year: number): Promise<Chapter[]> {
    const db = await initializeDatabase();
    if (!db) return [];
    try {
        const result = await db.getAllAsync<Chapter>(
            'SELECT * FROM Chapters WHERE Year = ?',
            [year]
        );
        return result;
    } catch (error) {
        return [];
    }
}


// Fetch subchapters by chapter ID
export async function fetchSubchaptersByChapterId(chapterId: number): Promise<Subchapter[]> {
    const db = await initializeDatabase();
    if (!db) return [];
    try {
        const result = await db.getAllAsync<Subchapter>(
            'SELECT * FROM Subchapters WHERE ChapterId = ?',
            [chapterId]
        );
        return result;
    } catch (error) {
        return [];
    }
}


// Fetch subchapter content by subchapter ID
export async function fetchSubchapterContentBySubchapterId(subchapterId: number): Promise<GenericContent[]> {
    const db = await initializeDatabase();
    if (!db) return [];
    try {
        const result = await db.getAllAsync<GenericContent>(
            'SELECT * FROM SubchapterContent WHERE SubchapterId = ? ORDER BY SortOrder',
            [subchapterId]
        );
        return result;
    } catch (error) {
        return [];
    }
}

// Fetch math chapters from the server
export async function fetchMathChapters(): Promise<MathChapter[]> {
    const db = await initializeDatabase();
    if (!db) return [];
    try {
        const result = await db.getAllAsync<MathChapter>(
            'SELECT * FROM MathChapters ORDER BY SortOrder'
        );
        return result;
    } catch (error) {
        return [];
    }
}

// Fetch math subchapters by chapter ID
export async function fetchMathSubchaptersByChapterId(chapterId: number): Promise<MathSubchapter[]> {
    const db = await initializeDatabase();
    if (!db) return [];
    try {
        const result = await db.getAllAsync<MathSubchapter>(
            'SELECT * FROM MathSubchapters WHERE ChapterId = ? ORDER BY SortOrder',
            [chapterId]
        );
        return result;
    } catch (error) {
        return [];
    }
}

// Fetch math subchapter content by subchapter ID
export async function fetchMathContentBySubchapterId(subchapterId: number): Promise<GenericContent[]> {
    const db = await initializeDatabase();
    if (!db) return [];
    try {
        const result = await db.getAllAsync<GenericContent>(
            'SELECT * FROM MathSubchapterContent WHERE SubchapterId = ? ORDER BY SortOrder',
            [subchapterId]
        );
        return result;
    } catch (error) {
        return [];
    }
}

// Fetch quiz by content ID
export async function fetchQuizByContentId(contentId: number): Promise<Quiz[]> {
    const db = await initializeDatabase();
    if (!db) return [];
    try {
        const result = await db.getAllAsync<Quiz>(
            'SELECT * FROM Quiz WHERE ContentId = ?',
            [contentId]
        );
        return result;
    } catch (error) {
        return [];
    }
}


// Fetch multiple-choice options by quiz ID
export async function fetchMultipleChoiceOptionsByQuizId(quizId: number): Promise<MultipleChoiceOption[]> {
    const db = await initializeDatabase();
    if (!db) return [];
    try {
        const options = await db.getAllAsync<MultipleChoiceOption>(
            'SELECT OptionText1, OptionText2, OptionText3 FROM MultipleChoiceOptions WHERE QuizId = ?',
            [quizId]
        );
        return options;
    } catch (error) {
        return [];
    }
}

// Fetch cloze test options by quiz ID
export async function fetchClozeTestOptionsByQuizId(quizId: number): Promise<ClozeTestOption[]> {
    const db = await initializeDatabase();
    if (!db) return [];
    try {
        const options = await db.getAllAsync<ClozeTestOption>(
            'SELECT * FROM ClozeTestOptions WHERE QuizId = ?',
            [quizId]
        );
        return options;
    } catch (error) {
        return [];
    }
}

// Fetch MathMiniQuiz by content ID
export async function fetchMathMiniQuizByContentId(contentId: number): Promise<MathMiniQuiz[]> {
    const db = await initializeDatabase();
    if (!db) return [];
    try {
        const quizzes = await db.getAllAsync<MathMiniQuiz>(
            'SELECT * FROM MathMiniQuiz WHERE ContentId = ?',
            [contentId]
        );
        return quizzes;
    } catch (error) {
        return [];
    }
}

// Search subchapters by query
export async function searchSubchapters(query: string): Promise<SubchapterWithPreview[]> {
    if (!query.trim()) return []; // Falls leer, abbrechen

    const db = await initializeDatabase();
    if (!db) return [];

    // Zerlege die Suchanfrage in einzelne Wörter
    const words = query.trim().split(/\s+/); // Trennt an Leerzeichen

    // Erstelle die SQL-Abfrage mit mehreren LIKE-Bedingungen mit ODER (statt UND)
    const conditions = words.map(() => "(s.SubchapterName LIKE ? OR c.ContentData LIKE ?)").join(" OR ");
    const params = words.flatMap(word => [`%${word}%`, `%${word}%`]);

    const sqlQuery = `
        SELECT s.SubchapterId, s.SubchapterName, GROUP_CONCAT(c.ContentData, ' ') AS ContentPreview
        FROM Subchapters s
        LEFT JOIN SubchapterContent c ON s.SubchapterId = c.SubchapterId
        WHERE ${conditions}
        GROUP BY s.SubchapterId
        ORDER BY s.SortOrder;
    `;

    try {
        const results = await db.getAllAsync<SubchapterWithPreview>(sqlQuery, params);
        return results;
    } catch (error) {
        return [];
    }
}



// Function to fetch flashcards based on a chapterId
export async function fetchFlashcardsForChapter(chapterId: number): Promise<{ Question: string; Answer: string }[]> {
    const db = await initializeDatabase();
    if (!db) return [];
    try {
        const flashcards = await db.getAllAsync<{ Question: string; Answer: string }>(
            'SELECT Question, Answer FROM Flashcards WHERE ChapterId = ?',
            [chapterId]
        );
        return flashcards;
    } catch (error) {
        return [];
    }
}


// Fetch all chapters from the server (for displaying all "Lernfelder")
export async function fetchChapters(): Promise<{ ChapterId: number; ChapterName: string }[]> {
    const db = await initializeDatabase();
    if (!db) return [];
    try {
        const chapters = await db.getAllAsync<{ ChapterId: number; ChapterName: string }>(
            'SELECT ChapterId, ChapterName FROM Chapters ORDER BY ChapterId'
        );
        return chapters;
    } catch (error) {
        return [];
    }
}

