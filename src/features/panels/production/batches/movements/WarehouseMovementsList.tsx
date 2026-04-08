import GenericList from "@features/panels/shared/GenericList";
import type {IWarehouseMovement} from "@features/panels/shared/api/warehouse-movement/IWarehouseMovement";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import dayjs from "dayjs";

const WarehouseMovementsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);

    const {data: batch, isLoading, isFetching} = batchApi.useGetDetail(selectedBatchId);
    const movements = batch?.warehouse_movements || [];

    const columns = useMemo<MRT_ColumnDef<IWarehouseMovement>[]>(() => [
        {
            accessorKey: "date",
            header: t("movements.date"),
            Cell: ({row}) => (
                dayjs(row.original.date).format("DD/MM/YYYY")
            )
        },
        {
            accessorKey: "contact.name",
            header: t("movements.contact")
        },
        {
            accessorKey: "reason.name",
            header: t("movements.reason")
        },
        {
            accessorKey: "piece",
            header: t("movements.piece")
        },
        {
            accessorKey: "movement_note",
            header: t("movements.movement_note")
        }
    ], [t]);

    return (
        <GenericList<IWarehouseMovement>
            disableBorder
            data={movements}
            minHeight={"400px"}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
        />
    )
}

export default WarehouseMovementsList;