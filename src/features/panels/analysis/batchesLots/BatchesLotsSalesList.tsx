import GenericList from "@features/panels/shared/GenericList";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IBatchesLotsStoreState} from "@features/panels/analysis/batchesLots/BatchesLotsPanel";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import dayjs from "dayjs";
import type {ISaleBatchDetailReport} from "@features/panels/analysis/batchesLots/api/IBatchDetailReport";

const BatchesLotsSalesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IBatchesLotsStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);

    const {data: batchReport, isLoading, isFetching} = batchApi.useGetBatchReport(selectedBatchId as number);

    const sales = useMemo(() => {
        return (batchReport?.sales || []).map((sale, index) => ({
            ...sale,
            id: sale.id || index // Assicuriamoci che ci sia un id per GenericList
        }));
    }, [batchReport?.sales]);

    const columns = useMemo<MRT_ColumnDef<ISaleBatchDetailReport>[]>(() => [
        {
            accessorKey: "ddt_date",
            header: t("batches.sales.ddt_date"),
            Cell: ({row}) => (
                dayjs(row.original.ddt_date).format("DD/MM/YYYY")
            )
        },
        {
            accessorKey: "ddt_number",
            header: t("batches.sales.ddt_number")
        },
        {
            accessorKey: "client",
            header: t("batches.sales.client")
        },
        {
            accessorKey: "pieces",
            header: t("batches.sales.pieces"),
        },
        {
            accessorKey: "quantity",
            header: t("batches.sales.quantity"),
        },
        {
            accessorKey: "total_value",
            header: t("batches.sales.total_value")
        },
        {
            accessorKey: "note",
            header: t("batches.sales.note")
        }
    ], [t]);

    return (
        <GenericList<ISaleBatchDetailReport>
            disableBorder
            data={sales}
            minHeight={"400px"}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
        />
    )
}

export default BatchesLotsSalesList;
