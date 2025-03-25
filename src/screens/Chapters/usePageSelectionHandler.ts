// Tracks and updates the current page index and the type of slide (content or quiz) in the PagerView. It helps in managing the state and behavior when the user navigates through different pages.

import { useState, useEffect } from "react";

interface PageSelectedEvent {
    nativeEvent: {
        position: number;
    }
}

interface CombinedDataItem {
    type: 'content' | 'quiz';
    data: any;
}

export const usePageSelectionHandler = (combinedData: CombinedDataItem[]) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSlideType, setCurrentSlideType] = useState<'content' | 'quiz' | null>(null);
    const [isQuizSlide, setIsQuizSlide] = useState(false);

    useEffect(() => {
        if (combinedData.length > 0) {
            const initialType = combinedData[0].type;
            setCurrentSlideType(initialType);
            setIsQuizSlide(initialType === 'quiz');
        }
    }, [combinedData]);

    const handlePageSelected = (e: PageSelectedEvent) => {
        const index = e.nativeEvent.position;
        if (combinedData.length > index) {
            const newType = combinedData[index].type;
            setCurrentIndex(index);
            setCurrentSlideType(newType);
            setIsQuizSlide(newType === 'quiz'); // Update when page is selected
        } else {
        }
    };

    return { currentIndex, handlePageSelected, currentSlideType, isQuizSlide };
};
