import { openDatabaseAsync } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { SQLiteDatabase } from 'expo-sqlite';
import { Asset } from 'expo-asset';
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

const dbName = 'skiltSHK.db';
const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

export async function initializeDatabase() {
    try {
        // Ensure the SQLite directory exists
        const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite');
        if (!dirInfo.exists) {
            console.log("SQLite directory does not exist, creating...");
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
        }

        // Check if the database file already exists
        const fileInfo = await FileSystem.getInfoAsync(dbPath);

        if (!fileInfo.exists) {
            console.log("No existing database found, copying the bundled one...");

            // Get the bundled database asset
            const asset = Asset.fromModule(require('../../assets/skiltSHK.db'));
            await asset.downloadAsync();

            // Log bundled database URI (useful for debugging)
            console.log("Bundled database asset downloaded.");

            // Check bundled database file info (logs existence and size)
            const bundledFileInfo = await FileSystem.getInfoAsync(asset.localUri!);
            if (bundledFileInfo.exists) {
                console.log(`Bundled database exists at ${asset.localUri} with size ${bundledFileInfo.size} bytes.`);
            } else {
                throw new Error("Bundled database asset not found.");
            }

            // Copy the database from bundled assets
            await FileSystem.copyAsync({
                from: asset.localUri!,
                to: dbPath,
            });

            const copiedFileInfo = await FileSystem.getInfoAsync(dbPath);
            if (copiedFileInfo.exists) {
                console.log(`Datenbank erfolgreich nach ${dbPath} kopiert.`);
            } else {
                throw new Error("Fehler beim Kopieren der Datenbank.");
            }
        } else {
            
        }
    } catch (error) {
        throw error;
    }

    return getDatabase();
}


let dbInstance: SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLiteDatabase | null> {
    if (dbInstance) {
      return dbInstance;
    }
    try {
      // Check if the database file exists
      const fileInfo = await FileSystem.getInfoAsync(dbPath);
      if (!fileInfo.exists) {
        // If the file doesn’t exist, call initializeDatabase to copy it over.
        await initializeDatabase();
      }
      // Open and store the database instance.
      dbInstance = await openDatabaseAsync(dbName);
      return dbInstance;
    } catch (error) {
      return null;
    }
  }


// Fetch Database Version
export async function fetchVersionNumber(): Promise<number | null> {
    const db = await getDatabase();
    if (!db) return null;
    try {
        const result = await db.getAllAsync<{ version_number: number }>(
            'SELECT version_number FROM Version ORDER BY id DESC LIMIT 1',
            []
        );

        if (result.length > 0) {
            return result[0].version_number;
        }
        return null; // No version found
    } catch (error) {
        return null; // Return null in case of error
    }
}



// Fetch chapters by year
export const fetchChaptersByYear = async (year: number): Promise<Chapter[]> => {
    const db = await getDatabase();
    if (!db) return [];
    try {
        const result = await db.getAllAsync<Chapter>(
            'SELECT ChapterId, ChapterName, ChapterIntro FROM Chapters WHERE Year = ?',
            [year]
        );
        return result;
    } catch (error) {
        return [];
    }
};

// Fetch subchapters by chapter id and order by SortOrder
export const fetchSubchaptersByChapterId = async (chapterId: number): Promise<Subchapter[]> => {
    const db = await getDatabase();
    if (!db) return [];
    try {
        const subchapters = await db.getAllAsync<Subchapter>(
            'SELECT SubchapterId, ChapterId, SubchapterName, SortOrder, ImageName FROM Subchapters WHERE ChapterId = ? ORDER BY SortOrder ASC',
            [chapterId]
        );
        return subchapters;
    } catch (error) {
        return [];
    }
};

// Fetch subchapter content by subchapter id
export const fetchSubchapterContentBySubchapterId = async (subchapterId: number): Promise<GenericContent[]> => {
    const db = await getDatabase();
    if (!db) return [];
    try {
        const content = await db.getAllAsync<GenericContent>(
            'SELECT * FROM SubchapterContent WHERE SubchapterId = ? ORDER BY SortOrder',
            [subchapterId]
        );
        return content;
    } catch (error) {
        return [];
    }
};

// Fetch math chapters
export const fetchMathChapters = async (): Promise<MathChapter[]> => {
    const db = await getDatabase();
    if (!db) return [];
    try {
        const mathChapters = await db.getAllAsync<MathChapter>(
            'SELECT * FROM MathChapters ORDER BY SortOrder'
        );
        console.log("Fetched rows from MathChapters:", mathChapters);  // Debug log
        return mathChapters;
    } catch (error) {
        return [];
    }
};

// Fetch math subchapters by chapter ID
export const fetchMathSubchaptersByChapterId = async (chapterId: number): Promise<MathSubchapter[]> => {
    const db = await getDatabase();
    if (!db) return [];
    try {
        const mathSubchapters = await db.getAllAsync<MathSubchapter>(
            'SELECT * FROM MathSubchapters WHERE ChapterId = ? ORDER BY SortOrder',
            [chapterId]
        );
        return mathSubchapters;
    } catch (error) {
        return [];
    }
};

// Fetch math subchapter content by subchapter ID
export const fetchMathSubchapterContentBySubchapterId = async (subchapterId: number): Promise<GenericContent[]> => {
    const db = await getDatabase();
    if (!db) return [];
    try {
        const subchapterContent = await db.getAllAsync<GenericContent>(
            'SELECT * FROM MathSubchapterContent WHERE SubchapterId = ? ORDER BY SortOrder',
            [subchapterId]
        );
        return subchapterContent;
    } catch (error) {
        return [];
    }
};

// Add a new chapter to the database
export const addChapter = async (chapterName: string, chapterIntro: string, year: number): Promise<void> => {
    const db = await getDatabase();
    if (!db) return;
    try {
        await db.runAsync(
            `INSERT INTO Chapters (ChapterName, ChapterIntro, Year) VALUES (?, ?, ?)`,
            [chapterName, chapterIntro, year]
        );
        console.log("Chapter added successfully");
    } catch (error) {
        throw error;
    }
};

// Fetch quiz by content ID
export const fetchQuizByContentId = async (contentId: number): Promise<Quiz[]> => {
    const db = await getDatabase();
    if (!db) return [];
    try {
        console.log('Fetching quizzes for ContentId:', contentId); // Log the input
        const quizzes = await db.getAllAsync<Quiz>(
            'SELECT * FROM Quiz WHERE ContentId = ?',
            [contentId]
        );
        return quizzes;
    } catch (error) {
        return [];
    }
};


// Fetch multiple-choice options by quiz ID
export const fetchMultipleChoiceOptionsByQuizId = async (quizId: number): Promise<MultipleChoiceOption[]> => {
    const db = await getDatabase();
    if (!db) return [];
    try {
        const options = await db.getAllAsync<MultipleChoiceOption>(
            `
            SELECT OptionText1, OptionText2, OptionText3
            FROM MultipleChoiceOptions
            WHERE QuizId = ?
            `,
            [quizId]
        );
        return options;
    } catch (error) {
        return [];
    }
};

// Fetch cloze test options by quiz ID
export const fetchClozeTestOptionsByQuizId = async (quizId: number): Promise<ClozeTestOption[]> => {
    const db = await getDatabase();
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
};

// Fetch MathMiniQuiz by content ID
export const fetchMathMiniQuizByContentId = async (contentId: number): Promise<MathMiniQuiz[]> => {
    const db = await getDatabase();
    if (!db) return [];
    try {
        const rows = await db.getAllAsync<MathMiniQuiz>(
            'SELECT * FROM MathMiniQuiz WHERE ContentId = ?',
            [contentId]
        );
        
        const processedRows = rows.map((row) => ({
            ...row,
            Answer: typeof row.Answer === 'string'
                ? (row.Answer as string).split(',').map((answer) => answer.trim()) 
                : row.Answer // Keep it as is if it’s already an array
        }));
        
        return processedRows;
    } catch (error) {
        return [];
    }
};


// Search subchapters and content by a search query
export const searchSubchapters = async (searchQuery: string): Promise<any[]> => {
    const db = await getDatabase();
    if (!db) return [];
    const query = `
        SELECT s.SubchapterId, s.SubchapterName, GROUP_CONCAT(c.ContentData, ' ') AS ContentPreview
        FROM Subchapters s
        LEFT JOIN SubchapterContent c ON s.SubchapterId = c.SubchapterId
        WHERE s.SubchapterName LIKE ? OR c.ContentData LIKE ?
        GROUP BY s.SubchapterId
        ORDER BY s.SortOrder;
    `;
    try {
        const results = await db.getAllAsync<any>(query, [`%${searchQuery}%`, `%${searchQuery}%`]);
        return results;
    } catch (error) {
        return [];
    }
};

// Fetch ChapterIds from Flashcards
export const fetchFlashcardsByChapterId = async (chapterId: number): Promise<{ Question: string; Answer: string }[]> => {
    const db = await getDatabase();
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
};


// Function to fetch all chapters from the database
export const fetchChaptersFromDatabase = async (): Promise<{ ChapterId: number; ChapterName: string }[]> => {
    const db = await getDatabase();
    if (!db) return [];
    try {
        const chapters = await db.getAllAsync<{ ChapterId: number; ChapterName: string }>(
            'SELECT ChapterId, ChapterName FROM Chapters'
        );
        return chapters;
    } catch (error) {
        return [];
    }
};
