import BatchesSelectionList from "@features/panels/production/batches/selection/BatchesSelectionList.tsx";
import CustomButton from "@features/panels/shared/CustomButton.tsx";
import {Box} from "@mui/material";
import {useTranslation} from "react-i18next";
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import BatchesSelectionFormDialog from "@features/panels/production/batches/selection/BatchesSelectionFormDialog.tsx";
import {useRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import {openDialog} from "@ui/dialog/dialogHelper.ts";

const BatchesSelection = () => {
    const {t} = useTranslation(["form"]);

    const selectionDialogRef = useRef<IDialogActions | null>(null);

    return (
        <Box sx={{display: 'flex', flexDirection: "column", gap: 1}}>
            <BatchesSelectionFormDialog ref={selectionDialogRef} />

            <Box>
                <CustomButton
                    label={t("production.selection")}
                    icon={<HighlightAltIcon/>}
                    color={"success"}
                    onClick={() => {openDialog(selectionDialogRef)}}
                />
            </Box>
            <BatchesSelectionList />
        </Box>
    )
}

export default BatchesSelection;