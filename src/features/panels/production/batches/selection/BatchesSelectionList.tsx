import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel.tsx";
import {batchApi} from "@features/panels/production/batches/api/batchApi.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import {useMemo, useRef} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IBatchSelection} from "@features/panels/production/batches/selection/api/IBatchSelection.ts";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import BatchesSelectionFormDialog from "@features/panels/production/batches/selection/BatchesSelectionFormDialog.tsx";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import CustomButton from "@features/panels/shared/CustomButton.tsx";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import {openDialog} from "@ui/dialog/dialogHelper.ts";

const BatchesSelectionList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);

    const {data: batch, isLoading, isFetching} = batchApi.useGetDetail(selectedBatchId);
    const selections = batch?.batch_selections || [];

    const columns = useMemo<MRT_ColumnDef<IBatchSelection>[]>(() => [
        {
            accessorKey: "pieces",
            header: t("production.batch.selections.pieces")
        },
        {
            accessorKey: "stock_pieces",
            header: t("production.batch.selections.stock_items")
        },
        {
            accessorKey: "selection.name",
            header: t("production.batch.selections.selection")
        },
        {
            accessorKey: "thickness.name",
            header: t("production.batch.selections.thickness")
        },
        {
            accessorKey: "note",
            header: t("production.batch.selections.note")
        }
    ], [t]);

    const selectionDialogRef = useRef<IDialogActions | null>(null);

    return (
        <>
            <BatchesSelectionFormDialog ref={selectionDialogRef} />

            <GenericList<IBatchSelection>
                disableBorder
                minHeight={"350px"}
                data={selections}
                isLoading={isLoading}
                isFetching={isFetching}
                columns={columns}
                additionalOptions={{
                    enableTopToolbar: true,
                    renderTopToolbar: () => (
                        <ListToolbar
                            buttons={[
                                <CustomButton
                                    label={t("production.batch.selection")}
                                    icon={<HighlightAltIcon/>}
                                    color={"success"}
                                    onClick={() => {openDialog(selectionDialogRef)}}
                                    isEnable={!!selectedBatchId
                                        && batch?.batch_type.name === 'Spaccato'
                                        && !batch.batch_code.includes("SC")
                                    }
                                />
                            ]}
                        />
                    )
                }}
            />
        </>
    )
};

export default BatchesSelectionList;