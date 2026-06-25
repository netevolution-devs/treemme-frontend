import {warehouseMovementsApi} from "@features/panels/warehouse/movements/api/warehouseMovementsApi";
import {usePanel} from "@ui/panel/PanelContext";
import type {IMovementsStoreState, IMovementStoreFilter} from "@features/panels/warehouse/movements/MovementsPanel";
import {useTranslation} from "react-i18next";
import {useMemo} from "react";
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

    const {useStore} = usePanel<IMovementStoreFilter, IMovementsStoreState>();
    const selectedMovementId = useStore(state => state.uiState.selectedMovementId);
    const setUIState = useStore(state => state.setUIState);

    const filterBatchCode = useStore(state => state.filters.filterBatchCode);
    const setFilters = useStore(state => state.setFilters);

    const queryParams = useMemo(() => cleanFilters(
        {
            code: filterBatchCode,
        }
    ), [filterBatchCode]);

    const {data: movements = [], isLoading, isFetching} = warehouseMovementsApi.useGetList({queryParams});
    const {mutateAsync: getReturnsPdf, isPending} = useGetExternalProcessingReturnsPrint();

    const columns = useMemo<MRT_ColumnDef<IWarehouseMovement>[]>(() => [
        {
            accessorKey: "date",
            header: t("date"),
            Cell: ({row}) => (
                dayjs(row.original.date).format("DD/MM/YYYY")
            )
        },
        {
            accessorKey: "batch.batch_code",
            header: t("production.batch.batch_code"),
        },
        {
            accessorKey: "reason.name",
            header: t("movements.reason"),
        },
        {
            accessorKey: "piece",
            header: t("movements.piece"),
        },
        {
            accessorKey: "price",
            header: t("sales.ddt-price"),
            Cell: ({row}) => row.original.price ? `${row.original.price} €` : "-"
        },
        {
            accessorKey: "ddt_number",
            header: t("movements.ddt_number"),
        },
        {
            accessorKey: "ddt_date",
            header: t("movements.ddt_date"),
            Cell: ({row}) => row.original.ddt_date ? dayjs(row.original.ddt_date).format("DD/MM/YYYY") : "-"
        },
        {
            accessorKey: "contact.name",
            header: t("movements.contact"),
        },
        {
            accessorKey: "movement_note",
            header: t("movements.movement_note"),
        }
    ], [t]);

    return (
        <GenericList<IWarehouseMovement>
            data={movements}
            isLoading={isLoading}
            isFetching={isFetching}
            minHeight={"780px"}
            columns={columns}
            selectedId={selectedMovementId}
            onRowSelect={(id) => setUIState({selectedMovementId: id})}
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar: () => (
                    <ListToolbar
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