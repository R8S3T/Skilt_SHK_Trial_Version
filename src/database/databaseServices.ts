// databaseservices.ts client-side
import { DATABASE_MODE, API_URL } from '@env';
import { initializeDatabase } from './initializeLocalDatabase';

import {
    Chapter,
    Subchapter,
    MathChapter,
    MathSubchapter,
    MathMiniQuiz,
    GenericContent,
    Quiz,
    MultipleChoiceOption,
    ClozeTestOption,
} from 'src/types/contentTypes';

console.log("DATABASE_MODE at runtime:", DATABASE_MODE);


export async function fetchVersionNumber(): Promise<number | null> {
    if (DATABASE_MODE === 'local') {
        // Local SQLite database
        const db = await initializeDatabase();
        if (!db) return null;
        try {
            console.log("Fetching database version...");
            const result = await db.getAllAsync<{ version_number: number }>(
                'SELECT version_number FROM Version LIMIT 1;',
                []
            );
            console.log("Version query result:", result);
            return result.length > 0 ? result[0].version_number : null; // Return version number or null
        } catch (error) {
            console.error('Failed to fetch version number from SQLite:', error);
            return null; // Return null on error
        }
    } else {
        // Server-side fetch
        try {
            const response = await fetch(`${API_URL}/version`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const { version_number }: { version_number: number } = await response.json();
            return version_number; // Return the server version number
        } catch (error) {
            console.error('Failed to fetch version number from server:', error);
            return null; // Return null on error
        }
    }
}

// Fetch chapters by year via the server
export async function fetchChaptersByYear(year: number): Promise<Chapter[]> {
    if (DATABASE_MODE === 'local') {
        // Use local SQLite database
        const db = await initializeDatabase();
        if (!db) return [];
        try {
            const result = await db.getAllAsync<Chapter>(
                'SELECT * FROM Chapters WHERE Year = ?',
                [year]
            );
            return result;
        } catch (error) {
            console.error('Failed to fetch chapters from SQLite:', error);
            return [];
        }
    } else {
        // Use server fetch
        try {
            const response = await fetch(`${API_URL}/chapters/${year}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const chapters: Chapter[] = await response.json();
            return chapters;
        } catch (error) {
            console.error(`Failed to fetch chapters for year ${year}:`, error);
            return [];  // Return empty array on error
        }
    }
}

// Fetch subchapters by chapter ID
export async function fetchSubchaptersByChapterId(chapterId: number): Promise<Subchapter[]> {
    if (DATABASE_MODE === 'local') {
        // Fetch from local SQLite database
        const db = await initializeDatabase();
        if (!db) return [];
        try {
            const result = await db.getAllAsync<Subchapter>(
                'SELECT * FROM Subchapters WHERE ChapterId = ? ORDER BY SortOrder ASC',
                [chapterId]
            );
            return result;
        } catch (error) {
            console.error(`Failed to fetch subchapters for chapterId ${chapterId} from SQLite:`, error);
            return [];
        }
    } else {
        // Fetch from server
        try {
            const response = await fetch(`${API_URL}/subchapters/${chapterId}`);
            if (!response.ok) {
                console.error('Network response was not ok:', response.status, response.statusText);
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            const subchapters: Subchapter[] = await response.json();
            return subchapters;
        } catch (error) {
            console.error(`Failed to fetch subchapters for chapterId ${chapterId} from server:`, error);
            return [];
        }
    }
}

// Fetch subchapter content by subchapter ID
export async function fetchSubchapterContentBySubchapterId(subchapterId: number): Promise<(GenericContent | Quiz)[]> {
    if (DATABASE_MODE === 'local') {
        // Fetch from local SQLite database
        const db = await initializeDatabase();
        if (!db) return [];
        try {
            // Fetch all subchapter content
            const contentResult = await db.getAllAsync<GenericContent>(
                'SELECT * FROM SubchapterContent WHERE SubchapterId = ? ORDER BY SortOrder',
                [subchapterId]
            );

            // Combine content and quizzes
            const mergedContent: (GenericContent | Quiz)[] = [];
            for (const content of contentResult) {
                mergedContent.push(content);

                // Fetch quizzes for the current content ID
                const quizzes = await fetchQuizByContentId(content.ContentId);
                if (quizzes.length > 0) {
                    mergedContent.push(...quizzes); // Add quizzes if available
                }
            }

            return mergedContent;
        } catch (error) {
            console.error(`Failed to fetch subchapter content for subchapterId ${subchapterId} from SQLite:`, error);
            return [];
        }
    } else {
        try {
            // Fetch from server
            const response = await fetch(`${API_URL}/subchaptercontent/${subchapterId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const contentResult: GenericContent[] = await response.json();

            // Combine content and quizzes
            const mergedContent: (GenericContent | Quiz)[] = [];
            for (const content of contentResult) {
                mergedContent.push(content);

                const quizzes = await fetchQuizByContentId(content.ContentId);
                if (quizzes.length > 0) {
                    mergedContent.push(...quizzes); // Add quizzes if available
                }
            }

            return mergedContent;
        } catch (error) {
            console.error(`Failed to fetch subchapter content for subchapterId ${subchapterId} from server:`, error);
            return [];
        }
    }
}


// Fetch math chapters
export async function fetchMathChapters(): Promise<MathChapter[]> {
    if (DATABASE_MODE === 'local') {
        // Fetch from local SQLite database
        const db = await initializeDatabase();
        if (!db) return [];
        try {
            const result = await db.getAllAsync<MathChapter>(
                'SELECT * FROM MathChapters ORDER BY SortOrder'
            );
            return result;
        } catch (error) {
            console.error('Failed to fetch math chapters from SQLite:', error);
            return [];
        }
    } else {
        // Fetch from server
        try {
            const response = await fetch(`${API_URL}/mathchapters`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const mathChapters: MathChapter[] = await response.json();
            return mathChapters;
        } catch (error) {
            console.error('Failed to fetch math chapters from server:', error);
            return [];
        }
    }
}

// Fetch math subchapters by chapter ID
export async function fetchMathSubchaptersByChapterId(chapterId: number): Promise<MathSubchapter[]> {
    if (DATABASE_MODE === 'local') {
        // Fetch from local SQLite database
        const db = await initializeDatabase();
        if (!db) return [];
        try {
            const result = await db.getAllAsync<MathSubchapter>(
                'SELECT * FROM MathSubchapters WHERE ChapterId = ? ORDER BY SortOrder',
                [chapterId]
            );
            return result;
        } catch (error) {
            console.error(`Failed to fetch math subchapters for chapterId ${chapterId} from SQLite:`, error);
            return [];
        }
    } else {
        // Fetch from server
        try {
            const response = await fetch(`${API_URL}/mathsubchapters/${chapterId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const subchapters: MathSubchapter[] = await response.json();
            return subchapters;
        } catch (error) {
            console.error(`Failed to fetch math subchapters for chapterId ${chapterId} from server:`, error);
            return [];
        }
    }
}

// Fetch math subchapter content by subchapter ID
export async function fetchMathContentBySubchapterId(subchapterId: number): Promise<GenericContent[]> {
    console.log(`fetchMathContentBySubchapterId wurde für SubchapterId ${subchapterId} aufgerufen.`);
    if (DATABASE_MODE === 'local') {
        console.log("Datenbankmodus ist 'local', rufe initializeDatabase() auf...");
        // Fetch from local SQLite database
        const db = await initializeDatabase();
        console.log("initializeDatabase() wurde in fetchMathContentBySubchapterId ausgeführt.");

        if (!db) return [];
        try {
            const result = await db.getAllAsync<GenericContent>(
                'SELECT * FROM MathSubchapterContent WHERE SubchapterId = ? ORDER BY SortOrder',
                [subchapterId]
            );
            return result;
        } catch (error) {
            console.error(`Failed to fetch math subchapter content for subchapterId ${subchapterId} from SQLite:`, error);
            return [];
        }
    } else {
        console.log("Datenbankmodus ist 'remote', fetch von API.");
        // Fetch from server
        try {
            const response = await fetch(`${API_URL}/mathsubchaptercontent/${subchapterId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const mathSubchapterContent: GenericContent[] = await response.json();
            console.log(`API-Daten erfolgreich abgerufen für SubchapterId ${subchapterId}:`, mathSubchapterContent);

            return mathSubchapterContent;
        } catch (error) {
            console.error(`Failed to fetch math subchapter content for subchapterId ${subchapterId} from server:`, error);
            return [];
        }
    }
}

export async function fetchQuizByContentId(contentId: number): Promise<Quiz[]> {
    if (DATABASE_MODE === 'local') {
        // Fetch from local SQLite database
        const db = await initializeDatabase();
        if (!db) return [];
        try {
            const result = await db.getAllAsync<Quiz>(
                'SELECT QuizId, ContentId, Question, QuizType, Answer, Image FROM Quiz WHERE ContentId = ?',
                [contentId]
            );

            // Process options for each quiz
            for (let quiz of result) {
                if (quiz.QuizType === 'cloze_test') {
                    quiz.Options = await fetchClozeTestOptionsByQuizId(quiz.QuizId);
                } else if (quiz.QuizType === 'multiple_choice') {
                    quiz.Options = await fetchMultipleChoiceOptionsByQuizId(quiz.QuizId);
                }
            }
            return result;
        } catch (error) {
            console.error(`Failed to fetch quiz for contentId ${contentId} from SQLite:`, error);
            return [];
        }
    } else {
        // Fetch from server
        try {
            const response = await fetch(`${API_URL}/quiz/${contentId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const quizzes: Quiz[] = await response.json();

            // Fetch options for each quiz
            for (let quiz of quizzes) {
                if (quiz.QuizType === 'cloze_test') {
                    quiz.Options = await fetchClozeTestOptionsByQuizId(quiz.QuizId);
                } else if (quiz.QuizType === 'multiple_choice') {
                    quiz.Options = await fetchMultipleChoiceOptionsByQuizId(quiz.QuizId);
                }
            }
            return quizzes;
        } catch (error) {
            console.error(`Failed to fetch quiz for contentId ${contentId} from server:`, error);
            return [];
        }
    }
}


// Fetch multiple-choice options by quiz ID
export async function fetchMultipleChoiceOptionsByQuizId(quizId: number): Promise<MultipleChoiceOption[]> {
    if (DATABASE_MODE === 'local') {
        // Fetch from local SQLite database
        const db = await initializeDatabase();
        if (!db) return [];
        try {
            const result = await db.getAllAsync<MultipleChoiceOption>(
                'SELECT OptionText1, OptionText2, OptionText3 FROM MultipleChoiceOptions WHERE QuizId = ?',
                [quizId]
            );
            return result;
        } catch (error) {
            console.error(`Failed to fetch multiple choice options for quizId ${quizId} from SQLite:`, error);
            return [];
        }
    } else {
        // Fetch from server
        try {
            const response = await fetch(`${API_URL}/multiplechoiceoptions/${quizId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const options: MultipleChoiceOption[] = await response.json();
            return options;
        } catch (error) {
            console.error(`Database query failed for QuizId ${quizId}:`, error); // Log error details
            throw error;
        }
    }
}

// Fetch ClozeTestOptions by Quiz ID
export async function fetchClozeTestOptionsByQuizId(
    quizId: number
): Promise<{ options: string[]; correctAnswers: (string | null)[] }> {
    if (DATABASE_MODE === 'local') {
        // Fetch from local SQLite database
        const db = await initializeDatabase();
        if (!db) return { options: [], correctAnswers: [] };
        try {
            const result = await db.getAllAsync<ClozeTestOption>(
                `SELECT Option1, Option2, Option3, Option4, CorrectAnswerForBlank1, CorrectAnswerForBlank2
                 FROM ClozeTestOptions 
                 WHERE QuizId = ?`,
                [quizId]
            );

            if (!result || result.length === 0) {
                console.warn(`No cloze test options found for QuizId ${quizId}`);
                return { options: [], correctAnswers: [] };
            }

            // Assuming one row per quiz
            const { Option1, Option2, Option3, Option4, CorrectAnswerForBlank1, CorrectAnswerForBlank2 } = result[0];

            return {
                options: [Option1, Option2, Option3, Option4].filter(Boolean), // Filter out null/undefined values
                correctAnswers: [CorrectAnswerForBlank1, CorrectAnswerForBlank2],
            };
        } catch (error) {
            console.error(`Failed to fetch cloze test options for QuizId ${quizId} from SQLite:`, error);
            return { options: [], correctAnswers: [] };
        }
    } else {
        // Fetch from server
        try {
            const response = await fetch(`${API_URL}/clozetestoptions/${quizId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error('Server response was not ok.');
            }

            // Map the server response to the expected format
            return {
                options: data.options || [],
                correctAnswers: data.correctAnswers || [],
            };
        } catch (error) {
            console.error(`Failed to fetch cloze test options for QuizId ${quizId} from server:`, error);
            return { options: [], correctAnswers: [] };
        }
    }
}


export async function fetchMathMiniQuizByContentId(contentId: number): Promise<MathMiniQuiz[]> {
    if (DATABASE_MODE === 'local') {
        const db = await initializeDatabase();
        if (!db) return [];
        try {
            const result = await db.getAllAsync<{
                QuizId: number;
                ContentId: number;
                Question: string;
                Answer: string;
                Options: string;
                Image?: string | null;
            }>(
                'SELECT QuizId, ContentId, Question, Answer, Options, Image FROM MathMiniQuiz WHERE ContentId = ?',
                [contentId]
            );

            // Map database rows into MathMiniQuiz structure
            return result.map((row) => ({
                QuizId: row.QuizId,
                ContentId: row.ContentId,
                Question: row.Question,
                Answer: row.Answer ? row.Answer.split(',').map((ans) => ans.trim()) : [], // Parse Answer
                Options: row.Options ? row.Options.split(',').map((opt) => opt.trim()) : [], // Parse Options
                Image: row.Image || null,
            }));
        } catch (error) {
            console.error(`Failed to fetch MathMiniQuiz for contentId ${contentId}:`, error);
            return [];
        }
    } else {
        try {
            const response = await fetch(`${API_URL}/mathminiquiz/${contentId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const quizzes = await response.json();

            return quizzes.map((quiz: any) => ({
                QuizId: quiz.QuizId,
                ContentId: quiz.ContentId,
                Question: quiz.Question,
                Answer: Array.isArray(quiz.Answer)
                    ? quiz.Answer
                    : quiz.Answer?.split(',').map((ans: string) => ans.trim()) || [],
                Options: quiz.Options?.split(',').map((opt: string) => opt.trim()) || [],
                Image: quiz.Image || null,
            }));
        } catch (error) {
            console.error(`Failed to fetch MathMiniQuiz for contentId ${contentId} from server:`, error);
            return [];
        }
    }
}


// Search subchapters by query
export async function searchSubchapters(query: string): Promise<Subchapter[]> {
    if (DATABASE_MODE === 'local') {
        // Search in local SQLite database
        const db = await initializeDatabase();
        if (!db) return [];
        try {
            const result = await db.getAllAsync<Subchapter>(
                `
                SELECT s.SubchapterId, s.SubchapterName, GROUP_CONCAT(c.ContentData, ' ') AS ContentPreview
                FROM Subchapters s
                LEFT JOIN SubchapterContent c ON s.SubchapterId = c.SubchapterId
                WHERE s.SubchapterName LIKE ? OR c.ContentData LIKE ?
                GROUP BY s.SubchapterId
                ORDER BY s.SortOrder;
                `,
                [`%${query}%`, `%${query}%`]
            );
            return result;
        } catch (error) {
            console.error(`Failed to fetch search results for query "${query}" from SQLite:`, error);
            return [];
        }
    } else {
        // Fetch from server
        try {
            const response = await fetch(`${API_URL}/search/${query}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const results: Subchapter[] = await response.json();
            return results;
        } catch (error) {
            console.error(`Failed to fetch search results for query "${query}" from server:`, error);
            return [];
        }
    }
}

// Function to fetch flashcards based on a chapterId
export async function fetchFlashcardsForChapter(chapterId: number): Promise<{ Question: string; Answer: string }[]> {
    if (DATABASE_MODE === 'local') {
        // Fetch from local SQLite database
        const db = await initializeDatabase();
        if (!db) return [];
        try {
            const result = await db.getAllAsync<{ Question: string; Answer: string }>(
                'SELECT Question, Answer FROM Flashcards WHERE ChapterId = ?',
                [chapterId]
            );
            return result;
        } catch (error) {
            console.error(`Failed to fetch flashcards for ChapterId ${chapterId} from SQLite:`, error);
            return [];
        }
    } else {
        // Fetch from server
        try {
            const response = await fetch(`${API_URL}/flashcards?chapterId=${chapterId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Failed to fetch flashcards for ChapterId ${chapterId} from server:`, error);
            return [];
        }
    }
}

// Fetch all chapters (for displaying all "Lernfelder")
export async function fetchChapters(): Promise<{ ChapterId: number; ChapterName: string }[]> {
    if (DATABASE_MODE === 'local') {
        // Fetch from local SQLite database
        const db = await initializeDatabase();
        if (!db) return [];
        try {
            const result = await db.getAllAsync<{ ChapterId: number; ChapterName: string }>(
                'SELECT ChapterId, ChapterName FROM Chapters ORDER BY ChapterId'
            );
            return result;
        } catch (error) {
            console.error('Failed to fetch chapters from SQLite:', error);
            return [];
        }
    } else {
        // Fetch from server
        try {
            const response = await fetch(`${API_URL}/chapters`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch chapters from server:', error);
            return [];
        }
    }
}