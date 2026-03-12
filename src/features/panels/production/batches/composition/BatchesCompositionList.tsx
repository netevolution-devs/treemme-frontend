import GenericList from "@features/panels/shared/GenericList.tsx";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel.tsx";
import {batchApi} from "@features/panels/production/batches/api/batchApi.ts";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import {NewButton} from "@features/panels/shared/CustomButton.tsx";
import {openDialog} from "@ui/dialog/dialogHelper.ts";
import BatchCompositionFormDialog from "@features/panels/production/batches/composition/BatchCompositionFormDialog.tsx";
import {useMemo, useRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import type {MRT_ColumnDef} from "material-react-table";
import type {
    IBatchCompositionResponse
} from "@features/panels/production/batches/composition/api/IBatchComposition.ts";
import {Typography} from "@mui/material";

const BatchesCompositionList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);
    // const setUIState = useStore(state => state.setUIState);

    const {data: batch, isLoading} = batchApi.useGetDetail(selectedBatchId);
    const compositions = batch?.batch_compositions ?? [];

    const columns = useMemo<MRT_ColumnDef<IBatchCompositionResponse>[]>(() => [
        {
            accessorKey: "father_batch_piece",
            header: t("composition.father_batch_piece"),
        },
        {
            accessorKey: "father_batch_quantity",
            header: t("composition.father_batch_quantity"),
        },
        {
            accessorKey: "composition_note",
            header: t("composition.composition_note"),
        }
    ], [t]);

    const compositionDialogRef = useRef<IDialogActions | null>(null);

    return (
        <>
            <BatchCompositionFormDialog ref={compositionDialogRef} />

            <Typography variant="h6">Composizione</Typography>
            <GenericList<IBatchCompositionResponse>
                columns={columns}
                data={compositions}
                isLoading={isLoading}
                minHeight={"200px"}
                maxHeight={"200px"}
                additionalOptions={{
                    enableTopToolbar: true,
                    renderTopToolbar: () => <ListToolbar
                        buttons={[
                            <NewButton onClick={() => openDialog(compositionDialogRef)} />
                        ]}
                    />
                }}
            />
        </>
    )
};

export default BatchesCompositionList;