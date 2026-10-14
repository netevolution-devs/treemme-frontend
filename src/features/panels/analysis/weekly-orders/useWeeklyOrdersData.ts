import {useMemo} from "react";
import {usePanel} from "@ui/panel/PanelContext";
import {cleanFilters} from "@ui/form/filters/useCleanFilters";
import useGetWeeklyOrderAverages from "./api/useGetWeeklyOrderAverages";
import type {IWeeklyOrderAverageRow} from "./api/IWeeklyOrderAverage";
import type {IWeeklyOrdersFilters, IWeeklyOrdersUIState} from "./WeeklyOrdersPanel";

const useWeeklyOrdersData = () => {
    const {useStore} = usePanel<IWeeklyOrdersFilters, IWeeklyOrdersUIState>();
    const filters = useStore(state => state.filters);
    const queryParams = useMemo(() => cleanFilters({
        start_date: filters.filterStartDate ?? "",
        end_date: filters.filterEndDate ?? "",
        client_id: filters.filterClientId ?? "",
        date_field: filters.filterDateField ?? "order_date",
        internal: filters.filterInternal ?? "false",
    }), [filters]);
    const query = useGetWeeklyOrderAverages({queryParams});
    const rows = useMemo<IWeeklyOrderAverageRow[]>(() => query.data?.items.map(item => ({
        ...item,
        id: `${item.leather_type?.id ?? "none"}:${item.currency?.id ?? "none"}`,
    })) ?? [], [query.data]);

    return {...query, rows};
};

export default useWeeklyOrdersData;
