import { useEffect, useState } from 'react';

type PreloadCache<T> = {
    [key: number]: T | null;
};

export const usePreloadContent = <T>(
    currentContentId: number,
    fetchNextContent: (contentId: number) => Promise<T | null>
) => {
    const [cache, setCache] = useState<PreloadCache<T>>({});
    const [preloading, setPreloading] = useState<boolean>(false);

    useEffect(() => {
        const preloadNext = async () => {
            if (!cache[currentContentId + 1]) {
                setPreloading(true);
                try {
                    const nextContent = await fetchNextContent(currentContentId + 1);
                    if (nextContent) {
                        setCache((prevCache) => ({
                            ...prevCache,
                            [currentContentId + 1]: nextContent,
                        }));
                    }
                } catch (error) {
                } finally {
                    setPreloading(false);
                }
            }
        };

        preloadNext();
    }, [currentContentId, fetchNextContent, cache]);

    const getNextContent = () => cache[currentContentId + 1] || null;

    return { getNextContent, preloading };
};
