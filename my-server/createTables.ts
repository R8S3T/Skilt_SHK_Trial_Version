import sqlite3 from 'sqlite3';

export const createChaptersTable = (db: sqlite3.Database): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS Chapters (
                ChapterId INTEGER PRIMARY KEY AUTOINCREMENT,
                ChapterName TEXT NOT NULL,
                ChapterIntro TEXT,
                Year INTEGER
            );
        `, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const createSubchaptersTable = (db: sqlite3.Database): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS Subchapters (
                SubchapterId INTEGER PRIMARY KEY AUTOINCREMENT,
                ChapterId INTEGER,
                SubchapterName TEXT,
                FOREIGN KEY(ChapterId) REFERENCES Chapters(ChapterId) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const createSubchapterContentTable = (db: sqlite3.Database): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS SubchapterContent (
                ContentId INTEGER PRIMARY KEY AUTOINCREMENT,
                SubchapterId INTEGER,
                ContentData TEXT,
                SortOrder INTEGER,
                FOREIGN KEY(SubchapterId) REFERENCES Subchapters(SubchapterId) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const createMathChaptersTable = (db: sqlite3.Database): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS MathChapters (
                ChapterId INTEGER PRIMARY KEY AUTOINCREMENT,
                ChapterName TEXT NOT NULL,
                Description TEXT,
                SortOrder INTEGER,
                Image TEXT
            );
        `, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const createMathSubchaptersTable = (db: sqlite3.Database): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS MathSubchapters (
                SubchapterId INTEGER PRIMARY KEY AUTOINCREMENT,
                ChapterId INTEGER,
                SubchapterName TEXT,
                SortOrder INTEGER,
                FOREIGN KEY(ChapterId) REFERENCES MathChapters(ChapterId) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
        
    });
};

export const createMathSubchapterContentTable = (db: sqlite3.Database): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS MathSubchapterContent (
                ContentId INTEGER PRIMARY KEY AUTOINCREMENT,
                ChapterId INTEGER,
                SubchapterId INTEGER,
                TextContent TEXT,
                ImageUrl TEXT,
                SortOrder INTEGER,
                FOREIGN KEY(ChapterId) REFERENCES MathChapters(ChapterId) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY(SubchapterId) REFERENCES MathSubchapters(SubchapterId) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const createQuizTable = (db: sqlite3.Database): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS Quiz (
                QuizId INTEGER PRIMARY KEY AUTOINCREMENT,
                ContentId INTEGER,
                Question TEXT,
                Type TEXT,
                Answer TEXT,
                FOREIGN KEY(ContentId) REFERENCES SubchapterContent(ContentId)
            );
        `, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const createMultipleChoiceOptionsTable = (db: sqlite3.Database): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS MultipleChoiceOptions (
                OptionId INTEGER PRIMARY KEY AUTOINCREMENT,
                QuizId INTEGER,
                OptionText1 TEXT,
                OptionText2 TEXT,
                OptionText3 TEXT,
                FOREIGN KEY(QuizId) REFERENCES Quiz(QuizId)
            );
        `, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const createClozeTestOptionsTable = (db: sqlite3.Database): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS ClozeTestOptions (
                QuizId INTEGER PRIMARY KEY,
                Option1 TEXT NOT NULL, 
                Option2 TEXT NOT NULL,
                Option3 TEXT NOT NULL,
                Option4 TEXT NOT NULL,
                CorrectAnswerForBlank1 TEXT,
                CorrectAnswerForBlank2 TEXT,
                FOREIGN KEY(QuizId) REFERENCES Quiz(QuizId)
            );
        `, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};


export const createMathMiniQuizTable = (db: sqlite3.Database): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS MathMiniQuiz (
                QuizId INTEGER PRIMARY KEY AUTOINCREMENT,
                ContentId INTEGER,
                Question TEXT,
                Answer TEXT,
                Options TEXT,
                FOREIGN KEY(ContentId) REFERENCES MathSubchapterContent(ContentId)
            );
        `, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

// Function to create the Flashcards table
export const createFlashcardsTable = (db: sqlite3.Database): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(
            `
            CREATE TABLE IF NOT EXISTS Flashcards (
                FlashcardId INTEGER PRIMARY KEY AUTOINCREMENT,
                Question TEXT NOT NULL,
                Answer TEXT NOT NULL,
                ChapterId INTEGER,
                FOREIGN KEY(ChapterId) REFERENCES Chapters(ChapterId) ON DELETE CASCADE
            );
            `,
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
};

