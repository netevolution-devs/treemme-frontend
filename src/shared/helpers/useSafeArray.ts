import {useMemo} from "react";

export function useSafeArray<T>(data: T[] | undefined | null): T[] {
    return useMemo(() => data ?? [], [data]);
}