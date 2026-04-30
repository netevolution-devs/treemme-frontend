import { useCallback } from 'react';

export const useFilteringAddress = () => {
    const filterAddressString = useCallback(({ addressLabels }: { addressLabels: (string | null | undefined)[] }) => {
        return addressLabels
            .filter((label): label is string => !!label && label.trim().length > 0)
            .join(', ');
    }, []);

    return { filterAddressString };
};