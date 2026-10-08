import {warehouseMovementsApi} from "@features/panels/warehouse/movements/api/warehouseMovementsApi";
import {usePanel} from "@ui/panel/PanelContext";
import type {IMovementsStoreState, IMovementStoreFilter} from "@features/panels/warehouse/movements/MovementsPanel";
import {useTranslation} from "react-i18next";
import {useEffect, useMemo} from "react";
import {useDockviewStore} from "@ui/panel/store/DockviewStore";
import {cleanFilters} from "@ui/form/filters/useCleanFilters";
import type {MRT_ColumnDef} from "material-react-table";
import type {IWarehouseMovement} from "@features/panels/shared/api/warehouse-movement/IWarehouseMovement";
import dayjs from "dayjs";
import GenericList from "@features/panels/shared/GenericList";
import ListToolbar from "@features/panels/shared/ListToolbar";
import TextFieldFilter from "@ui/form/filters/TextFieldFilter";
import {PrintButton} from "@features/panels/shared/CustomButton";
import useGetExternalProcessingReturnsPrint
    from "@features/panels/analysis/external-movements/api/useGetExternalProcessingReturnsPrint";

const MovementsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore, panelId} = usePanel<IMovementStoreFilter, IMovementsStoreState>();
    const selectedMovementId = useStore(state => state.uiState.selectedMovementId);
    const setUIState = useStore(state => state.setUIState);

    const filterBatchCode = useStore(state => state.filters.filterBatchCode);
    const setFilters = useStore(state => state.setFilters);

    const queryParams = useMemo(() => cleanFilters(
        {
            batch_code: filterBatchCode,
        }
    ), [filterBatchCode]);

    const {data: movements = [], isLoading, isFetching, refetch} = warehouseMovementsApi.useGetList({queryParams, staleTime: 0});

    useEffect(() => useDockviewStore.subscribe((state, previousState) => {
        if (state.activePanelId === panelId && previousState.activePanelId !== panelId) {
            void refetch({cancelRefetch: false});
        }
    }), [panelId, refetch]);

    const exportMutation = warehouseMovementsApi.useExport(queryParams);
    const {mutateAsync: getReturnsPdf, isPending} = useGetExternalProcessingReturnsPrint();

    const columns = useMemo<MRT_ColumnDef<IWarehouseMovement>[]>(() => [
        {
            id: "year",
            accessorFn: movement => movement.date ? dayjs(movement.date).year() : null,
            header: t("movements.year"),
            size: 80,
            minSize: 80,
            grow: false,
        },
        {
            id: "month",
            accessorFn: movement => movement.date ? dayjs(movement.date).month() + 1 : null,
            header: t("movements.month"),
            size: 80,
            minSize: 80,
            grow: false,
        },
        {
            accessorKey: "date",
            header: t("movements.date"),
            size: 115,
            minSize: 115,
            grow: false,
            Cell: ({row}) => row.original.date ? dayjs(row.original.date).format("DD/MM/YYYY") : "-",
        },
        {
            accessorKey: "reason.name",
            header: t("movements.reason"),
        },
        {
            id: "product",
            accessorFn: movement => movement.batch?.article?.name ?? movement.batch?.leather?.name ?? "-",
            header: t("movements.product"),
        },
        {
            accessorKey: "piece",
            header: t("movements.piece"),
            size: 85,
            minSize: 85,
            grow: false,
        },
        {
            accessorKey: "quantity",
            header: t("movements.quantity"),
            size: 105,
            minSize: 105,
            grow: false,
            Cell: ({cell}) => cell.getValue<number | null>() ?? "-",
        },
        {
            accessorKey: "batch.batch_code",
            header: t("movements.batch_code"),
            size: 110,
            minSize: 110,
            grow: false,
        },
        {
            // The API does not currently identify the movement's selection.
            id: "selection",
            accessorFn: () => "-",
            header: t("movements.selection"),
            enableSorting: false,
            enableColumnFilter: false,
        },
        {
            accessorKey: "contact.name",
            header: t("movements.contact"),
        },
    ], [t]);

    return (
        <GenericList<IWarehouseMovement>
            fullHeight={selectedMovementId == null}
            data={movements}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedMovementId}
            onRowSelect={(id) => setUIState({selectedMovementId: id})}
            additionalOptions={{
                layoutMode: "grid",
                enableTopToolbar: true,
                renderTopToolbar: () => (
                    <ListToolbar
                        onExport={() => exportMutation.mutate()}
                        exportLoading={exportMutation.isPending}
                        alignButtons={"flex-end"}
                        filters={[
                            <TextFieldFilter
                                key={"f-batch_code"}
                                label={t("production.batch.batch_code")}
                                value={filterBatchCode}
                                onFilterChange={(val) => setFilters({filterBatchCode: val as string})}
                            />,
                        ]}
                        buttons={[
                            <PrintButton
                                key={"b-print"}
                                canPrint={true}
                                isPending={isPending}
                                onClick={() => getReturnsPdf({})}
                            />
                        ]}
                    />
                )
            }}
        />
    )
}

export default MovementsList;
