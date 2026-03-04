import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel.tsx";
import {batchApi} from "@features/panels/production/batches/api/batchApi.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IBatchSelection} from "@features/panels/production/batches/selection/api/IBatchSelection.ts";

const BatchesSelectionList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);
    // const setUIState = useStore(state => state.setUIState);

    const {data: batch, isLoading} = batchApi.useGetDetail(selectedBatchId);
    const selections = batch?.batch_selections || [];

    const columns = useMemo<MRT_ColumnDef<IBatchSelection>[]>(() => [
        {
            accessorKey: "pieces",
            header: t("production.batch.selections.pieces")
        },
        {
            accessorKey: "selection.name",
            header: t("production.batch.selections.selection")
        },
        {
            accessorKey: "stock_items",
            header: t("production.batch.selections.stock_items")
        }
    ], [t]);

    return (
        <GenericList<IBatchSelection>
            data={selections}
            isLoading={isLoading}
            columns={columns}
        />
    )
};

export default BatchesSelectionList;