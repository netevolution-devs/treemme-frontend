import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IBatchProduction} from "@features/panels/production/batches/production/api/IBatchProduction";
import GenericList from "@features/panels/shared/GenericList";
import dayjs from "dayjs";
import {Typography} from "@mui/material";
import ListToolbar from "@features/panels/shared/ListToolbar";

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
            <GenericList<IBatchProduction>
                disableBorder
                data={productionList}
                isLoading={isLoading}
                isFetching={isFetching}
                columns={columns}
                additionalOptions={{
                    enableTopToolbar: true,
                    renderTopToolbar: () => (
                        <ListToolbar
                            label={<Typography variant="h6">{t("production.title")}</Typography>}
                        />
                    )
                }}
            />
        </>
    )
}

export default BatchesProductionList;