import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ILeathersStoreState, ILeatherStoreFilter} from "@features/panels/leathers/leathers/LeathersPanel.tsx";
import {leatherApi} from "@features/panels/leathers/leathers/api/leatherApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {ILeather} from "@features/panels/leathers/leathers/api/ILeather.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import TextFieldFilter from "@ui/form/filters/TextFieldFilter.tsx";
import {cleanFilters} from "@ui/form/filters/useCleanFilters.ts";

interface LeatherListProps {
    enableFilters?: boolean;
    panelFilter?:
        "flay" |
        "provenance" |
        "species" |
        "status" |
        "thickness" |
        "type" |
        "weight" |
        undefined
    selectedQueryId?: number;
}

const LeatherList = ({enableFilters = false, panelFilter, selectedQueryId}: LeatherListProps) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<ILeatherStoreFilter, ILeathersStoreState>();
    const selectedLeatherId = useStore(state => state.uiState.selectedLeatherId);
    const setUIState = useStore(state => state.setUIState);
    const setFilters = useStore(state => state.setFilters);

    const filterProvenance = useStore(state => state.filters.filterProvenance);

    const queryParams = useMemo(() => cleanFilters(
            {
                [panelFilter as string]: selectedQueryId,
            }
        ),
        [panelFilter]
    ) as Record<string, string | number>

    const {data: leathers = [], isLoading} = leatherApi.useGetList({queryParams});

    const columns = useMemo<MRT_ColumnDef<ILeather>[]>(() => [
        {
            accessorKey: "code",
            header: t("leathers.leather.code"),
            size: 0
        },
        {
            accessorKey: "name",
            header: t("leathers.leather.name"),
        }
    ], [t])

    return (
        <GenericList<ILeather>
            data={leathers}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedLeatherId}
            onRowSelect={(id) => setUIState({selectedLeatherId: id})}
            additionalOptions={{
                enableTopToolbar: enableFilters,
                renderTopToolbar: () => (
                    <ListToolbar
                        filters={[
                            <TextFieldFilter
                                key="f-leather_provenance"
                                label={t("leathers.leather.provenance")}
                                value={filterProvenance}
                                onFilterChange={(val) => setFilters({filterProvenance: val as string})}
                            />
                        ]}
                    />
                )
            }}
        />
    )
}

export default LeatherList;