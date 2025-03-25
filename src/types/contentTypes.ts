export interface Chapter {
    ChapterId: number;
    ChapterName: string;
    ChapterIntro?: string;
    Year: number;
}

export interface Subchapter {
    SubchapterId: number;
    ChapterId: number;
    SubchapterName: string;
    ImageName: string;
    isLocked: boolean;
    isFinished: boolean;
    SortOrder: number;
}

export interface SubchapterWithPreview {
    SubchapterId: number;
    SubchapterName: string;
    ContentPreview?: string;
    ChapterTitle?: string;
    ChapterId?: number;
}


export interface MathChapter {
    ChapterId: number;
    ChapterName: string;
    Description: string;
    SortOrder: number;
    Image?: string;
}

export interface MathSubchapter {
    SubchapterId: number;
    ChapterId: number;
    SubchapterName: string;
    SortOrder: number;
}

export interface GenericContent {
    ContentId: number;
    SubchapterId: number;
    ContentData: string;
    TextContent?: string;
    SortOrder: number;
    ImageUrl?: string;
    Quiz?: {
        Question: string;
        Options: string[];
    };
    imagePaths?: string[];
    imageName?: string;
    Index?: number; 
}

export interface Quiz {
    QuizId: number;
    ContentId: number;
    Question: string;
    QuizType: 'multiple_choice' | 'cloze_test';
    Answer: string;
    Options?: MultipleChoiceOption[] | {
        options: string[];
        correctAnswers: (string | null)[];
    };
    Image?: string;
}


export interface MultipleChoiceOption {
    OptionId: number;
    QuizId: number;
    OptionText1: string;
    OptionText2: string;
    OptionText3: string;
    Image?: string;
}

export interface ClozeTestOption {
    QuizId: number;
    Option1: string;
    Option2: string;
    Option3: string;
    Option4: string;
    CorrectAnswerForBlank1: string | null;
    CorrectAnswerForBlank2: string | null;
}

export interface AnswerStatus {
    answer: string | null;
    isCorrect: boolean | null;
}

export interface MathMiniQuiz {
    QuizId: number;
    ContentId: number;
    Question: string;
    Answer: string[];
    Options: string[];
}

export interface Flashcard {
    FlashcardId: number;
    Question: string;
    Answer: string;
    SubchapterId: number;
}