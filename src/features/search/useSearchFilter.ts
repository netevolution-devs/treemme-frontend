import {useMemo, useState} from "react";

export function useSearchFilter<T>(
    data: T[] | undefined,
    searchFields: (keyof T)[]
) {
    const [searchText, setSearchText] = useState("");

    const filteredData = useMemo(() => {
        if (!data) return [];
        if (!searchText.trim()) return data;

        const searchLower = searchText.toLowerCase().trim();

        return data.filter((item) => {
            return searchFields.some((field) => {
                const value = item[field];
                if (value == null) return false;
                return String(value).toLowerCase().includes(searchLower);
            });
        });
    }, [data, searchText, searchFields]);

    return {
        searchText,
        setSearchText,
        filteredData
    };
}

export function useSearchCombinedFilter<T>(
    data: T[] | undefined,
    searchFields: (keyof T)[]
) {
    const [searchText, setSearchText] = useState("");

    const filteredData = useMemo(() => {
        if (!data) return [];
        if (!searchText.trim()) return data;

        const searchLower = searchText.toLowerCase().trim();

        const searchWords = searchLower.split(/\s+/).filter(word => word.length > 0);

        return data.filter((item) => {
            const allFieldsText = searchFields
                .map(field => String(item[field] || ''))
                .join(' ')
                .toLowerCase();

            if (searchWords.length > 1) {
                const allWordsFound = searchWords.every(word =>
                    allFieldsText.includes(word)
                );

                const exactMatch = allFieldsText.includes(searchLower);

                return allWordsFound || exactMatch;
            }

            return allFieldsText.includes(searchLower);
        });
    }, [data, searchText, searchFields]);

    return {
        searchText,
        setSearchText,
        filteredData
    };
}