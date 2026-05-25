import GenericList from "@features/panels/shared/GenericList";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IBatchesLotsStoreState} from "@features/panels/analysis/batchesLots/BatchesLotsPanel";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import dayjs from "dayjs";
import type {ICostBatchDetailReport} from "@features/panels/analysis/batchesLots/api/IBatchDetailReport";

const BatchesLotsCostsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IBatchesLotsStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);

    const {data: batchReport, isLoading, isFetching} = batchApi.useGetBatchReport(selectedBatchId as number);
    
    const costs = useMemo(() => {
        return (batchReport?.costs || []).map((cost, index) => ({
            ...cost,
            id: cost.id || index
        }));
    }, [batchReport?.costs]);

    const columns = useMemo<MRT_ColumnDef<ICostBatchDetailReport>[]>(() => [
        {
            accessorKey: "date",
            header: t("batches.costs.date"),
            Cell: ({row}) => (
                dayjs(row.original.date).format("DD/MM/YYYY")
            )
        },
        {
            accessorKey: "type",
            header: t("batches.costs.type")
        },
        {
            accessorKey: "amount",
            header: t("batches.costs.amount")
        },
        {
            accessorKey: "note",
            header: t("batches.costs.note")
        }
    ], [t]);

    return (
        <GenericList<ICostBatchDetailReport>
            disableBorder
            data={costs}
            minHeight={"400px"}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
        />
    )
}

export default BatchesLotsCostsList;
