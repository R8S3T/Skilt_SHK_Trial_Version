import React, { createContext, useState, useContext } from 'react';

type SearchContextType = {
    query: string;
    setQuery: (query: string) => void;
    results: any[];
    setResults: (results: any[]) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<any[]>([]);

    return (
        <SearchContext.Provider value={{ query, setQuery, results, setResults }}>
        {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = (): SearchContextType => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
};
