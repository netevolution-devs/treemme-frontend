import BatchesSelectionList from "@features/panels/production/batches/selection/BatchesSelectionList.tsx";
import CustomButton from "@features/panels/shared/CustomButton.tsx";
import {Box} from "@mui/material";
import {useTranslation} from "react-i18next";
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import BatchesSelectionFormDialog from "@features/panels/production/batches/selection/BatchesSelectionFormDialog.tsx";
import {useRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import {openDialog} from "@ui/dialog/dialogHelper.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel.tsx";
import {batchApi} from "@features/panels/production/batches/api/batchApi.ts";

const BatchesSelection = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore((state) => state.uiState.selectedBatchId);

    const {data: batch} = batchApi.useGetDetail(selectedBatchId);

    const selectionDialogRef = useRef<IDialogActions | null>(null);

    return (
        <Box sx={{display: 'flex', flexDirection: "column", gap: 1}}>
            <BatchesSelectionFormDialog ref={selectionDialogRef} />

            <Box>
                <CustomButton
                    label={t("production.batch.selection")}
                    icon={<HighlightAltIcon/>}
                    color={"success"}
                    onClick={() => {openDialog(selectionDialogRef)}}
                    isEnable={!!selectedBatchId && batch?.batch_type.name === 'Spaccato'}
                />
            </Box>
            <BatchesSelectionList />
        </Box>
    )
}

export default BatchesSelection;