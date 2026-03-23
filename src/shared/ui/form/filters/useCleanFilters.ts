export const cleanFilters = <T extends Record<string, unknown>>(filters: T): Partial<T> => {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) =>
            value !== undefined &&
            value !== null &&
            value !== ""
        )
    ) as Partial<T>;
};