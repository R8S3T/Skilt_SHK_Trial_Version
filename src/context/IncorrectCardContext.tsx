import React, { createContext, useState, ReactNode } from 'react';

interface IncorrectCardContextProps {
    incorrectCards: { question: string; answer: string }[];
    addIncorrectCard: (card: { question: string; answer: string }) => void;
    clearIncorrectCards: () => void;
}

export const IncorrectCardContext = createContext<IncorrectCardContextProps | undefined>(undefined);

export const IncorrectCardProvider = ({ children }: { children: ReactNode }) => {
    const [incorrectCards, setIncorrectCards] = useState<{ question: string; answer: string }[]>([]);

    const addIncorrectCard = (card: { question: string; answer: string }) => {
        setIncorrectCards((prevCards) => [...prevCards, card]);
    };

    const clearIncorrectCards = () => {
        setIncorrectCards([]);
    };

    return (
        <IncorrectCardContext.Provider value={{ incorrectCards, addIncorrectCard, clearIncorrectCards }}>
            {children}
        </IncorrectCardContext.Provider>
    );
};

