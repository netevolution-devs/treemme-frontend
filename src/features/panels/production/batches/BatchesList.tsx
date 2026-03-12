import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel.tsx";
import {batchApi} from "@features/panels/production/batches/api/batchApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IBatch} from "@features/panels/production/batches/api/IBatch.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";

const BatchesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);
    const setUIState = useStore(state => state.setUIState);

    const {data: batches = [], isLoading} = batchApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IBatch>[]>(() => [
        {
            accessorKey: "batch_code",
            header: t("production.batch.batch_code")
        },
        // {
        //     accessorKey: "leather.provenance.nation.name",
        //     header: t("nations.name")
        // },
        {
            header: t("leathers.leather.name"),
            Cell: ({row}) => row.original.leather?.name as string || row.original.article?.name as string
        },
        {
            accessorKey: "pieces",
            header: t("production.batch.pieces")
        },
        {
            accessorKey: "quantity",
            header: t("production.batch.quantity")
        },
        {
            accessorKey: "measurement_unit.prefix",
            header: t("production.batch.measurement_unit")
        }
    ], [t]);

    return (
        <GenericList<IBatch>
            data={batches}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedBatchId}
            onRowSelect={(id) => setUIState({selectedBatchId: id})}
        />
    );
};

export default BatchesList;