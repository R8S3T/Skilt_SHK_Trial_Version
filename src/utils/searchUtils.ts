import { SubchapterWithPreview } from "src/types/contentTypes";

export interface SubchapterWithPreviewExtended extends SubchapterWithPreview {
    cleanedPreview: string[]; // Updated to handle highlighted parts as an array
}

const cleanContent = (content: string): string => {
    return content.replace(/\[.*?\]/g, ""); // Entfernt [Marker]
};

const adjustPreview = (content: string, query: string): string => {
    const cleanedContent = cleanContent(content);

    // Split content into sentences
    const sentences = cleanedContent.match(/[^\.!\?]+[\.!\?]+|[^\.!\?]+$/g);
    if (!sentences) return '';

    // Split query into multiple words
    const queryWords = query.split(/\s+/).map(word => word.trim()).filter(Boolean);
    if (queryWords.length === 0) return '';

    // Build regex for all words (ignoring order)
    const queryRegex = new RegExp(queryWords.map(word => `(?=.*${word})`).join(''), 'i');

    // Find the first sentence that contains ALL words
    const index = sentences.findIndex(sentence => queryRegex.test(sentence));

    if (index === -1) {
        return sentences.slice(0, 1).join(' ').trim() + '...';
    } else {
        const previewSentences = [];
        previewSentences.push(sentences[index]);

        let totalLength = sentences[index].length;
        let i = index + 1;
        const previewLength = 50;

        while (i < sentences.length && totalLength < previewLength) {
            totalLength += sentences[i].length;
            previewSentences.push(sentences[i]);
            i++;
        }

        return previewSentences.join(' ').trim() + '...';
    }
};



// Highlight the query in the preview
export const highlightQuery = (content: string, query: string): string[] => {
    const queryRegex = new RegExp(`(${query})`, "gi");
    return content.split(queryRegex); // Teilt den Text in Treffer und Nicht-Treffer
};

export const handleSearch = async (
    query: string,
    searchSubchapters: (query: string) => Promise<SubchapterWithPreview[]>
): Promise<SubchapterWithPreviewExtended[]> => {

    // Falls query leer oder nur Leerzeichen enthält, keine Suche durchführen
    if (!query.trim()) {
        return [];
    }

    const searchResults = await searchSubchapters(query);

    const filteredResults = searchResults
        .map((subchapter) => {
            const adjustedPreview = adjustPreview(subchapter.ContentPreview || "", query);
            const highlightedPreview = highlightQuery(adjustedPreview, query);

            return {
                ...subchapter,
                relevanceScore: 0, 
                cleanedPreview: highlightedPreview, 
            };
        })
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

    return filteredResults;
};

