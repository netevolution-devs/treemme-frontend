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
        [panelFilter, selectedQueryId]
    ) as Record<string, string | number>

    const {data: leathers = [], isLoading} = leatherApi.useGetList({queryParams});

    const columns = useMemo<MRT_ColumnDef<ILeather>[]>(() => [
        {
            accessorKey: "code",
            header: t("leathers.leather.code"),
        },
        {
            accessorKey: "name",
            header: t("leathers.leather.name"),
        }
    ], [t]);

    const specificColumns = useMemo<MRT_ColumnDef<ILeather>[]>(() => [
        {
            accessorKey: "supplier.name",
            header: t("leathers.leather.table.supplier"),
        },
        {
            accessorKey: "code",
            header: t("leathers.leather.code"),
        },
        {
            accessorKey: "species.name",
            header: t("leathers.leather.species"),
        },
        {
            accessorKey: "type.name",
            header: t("leathers.leather.type")
        },
        {
            accessorKey: "status.name",
            header: t("leathers.leather.status"),
        },
        {
            accessorKey: "weight.name",
            header: t("leathers.leather.weight"),
        },
        {
            accessorKey: "provenance.code",
            header: t("leathers.leather.provenance"),
        },
        {
            accessorKey: "flay.name",
            header: t("leathers.leather.flay"),
        },
        // sps ?
        // pqp ?
        {
            accessorKey: "sqft_leather_expected",
            header: t("leathers.leather.table.pqp"),
        },
        {
            accessorKey: "sqft_leather_min",
            header: t("leathers.leather.table.pqp_min"),
        },
        {
            accessorKey: "sqft_leather_max",
            header: t("leathers.leather.table.pqp_max"),
        },
        {
            accessorKey: "sqft_leather_media",
            header: t("leathers.leather.table.pqp_m"),
        },
        {
            accessorKey: "sqft_leather_max",
            header: t("leathers.leather.table.pqp_max"),
        },
        // kgp
        {
            accessorKey: "kg_leather_expected",
            header: t("leathers.leather.table.kgp"),
        },
        {
            accessorKey: "kg_leather_min",
            header: t("leathers.leather.table.kg_min"),
        },
        {
            accessorKey: "kg_leather_max",
            header: t("leathers.leather.table.kg_max"),
        },
        {
            accessorKey: "kg_leather_media",
            header: t("leathers.leather.table.kg_m"),
        },
        {
            accessorKey: "kg_leather_max",
            header: t("leathers.leather.table.kg_max"),
        },
        // gcz
    ], [t]);

    return (
        <GenericList<ILeather>
            data={leathers}
            isLoading={isLoading}
            columns={panelFilter ? specificColumns : columns}
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