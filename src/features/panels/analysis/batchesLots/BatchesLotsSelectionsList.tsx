import GenericList from "@features/panels/shared/GenericList";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IBatchesLotsStoreState} from "@features/panels/analysis/batchesLots/BatchesLotsPanel";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IBatchSelectionQuantityItem} from "@features/panels/analysis/batchesLots/api/IBatchDetailReport";
import type {BaseEntity} from "@features/panels/shared/GenericList";
import ListToolbar from "@features/panels/shared/ListToolbar";

type IBatchSelectionQuantityRow = IBatchSelectionQuantityItem & BaseEntity;

const BatchesLotsSelectionsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IBatchesLotsStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);

    const {data: raw = [], isLoading, isFetching} = batchApi.useGetBatchSelectionQuantities(selectedBatchId as number);

    const selections = Array.isArray(raw) ? raw : [];

    const data = useMemo(() => {
        return selections.map((item, index) => ({
            ...item,
            id: item.selection_id || index
        }));
    }, [selections]);

    const columns = useMemo<MRT_ColumnDef<IBatchSelectionQuantityRow>[]>(() => [
        {
            accessorKey: "selection_name",
            header: t("batches.selections.selection_name"),
        },
        {
            accessorKey: "total.pieces",
            header: t("batches.selections.total_pieces"),
        },
        {
            accessorKey: "total.quantity",
            header: t("batches.selections.total_quantity"),
        },
        {
            accessorKey: "available.pieces",
            header: t("batches.selections.available_pieces"),
        },
        {
            accessorKey: "available.quantity",
            header: t("batches.selections.available_quantity"),
        },
        // {
        //     accessorKey: "available.quantity_ftsq",
        //     header: t("batches.selections.quantity_ftsq"),
        // },
    ], [t]);

    return (
        <GenericList<IBatchSelectionQuantityRow>
            disableBorder
            data={data}
            minHeight={"400px"}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar: () => <ListToolbar label={t("batches.tabs.selections")}/>
            }}
        />
    )
}

export default BatchesLotsSelectionsList;
