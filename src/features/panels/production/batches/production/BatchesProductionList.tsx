import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel.tsx";
import {batchApi} from "@features/panels/production/batches/api/batchApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IBatchProduction} from "@features/panels/production/batches/production/api/IBatchProduction.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import dayjs from "dayjs";
import {Typography} from "@mui/material";

const BatchesProductionList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore((state) => state.uiState.selectedBatchId);

    const {data: batch, isLoading, isFetching} = batchApi.useGetDetail(selectedBatchId);
    const productionList = batch?.productions ?? [];

    const columns = useMemo<MRT_ColumnDef<IBatchProduction>[]>(() => [
        {
            accessorKey: "machine.name",
            header: t("production.batch.machine"),
        },
        {
            accessorKey: "scheduled_date",
            header: t("production.batch.scheduled_date"),
            Cell: ({row}) => (
                dayjs(row.original.scheduled_date).format("DD/MM/YYYY")
            )
        },
        {
            accessorKey: "production_note",
            header: t("production.batch.production_note"),
        }
    ], [t])

    return (
        <>
            <Typography variant="h6">{t("production.title")}</Typography>
            <GenericList<IBatchProduction>
                data={productionList}
                isLoading={isLoading}
                isFetching={isFetching}
                columns={columns}
            />
        </>
    )
}

export default BatchesProductionList;