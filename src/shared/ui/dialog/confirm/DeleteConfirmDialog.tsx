import {forwardRef, type ForwardedRef} from "react";
import {Button, CircularProgress, DialogActions, DialogContent, DialogTitle, Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import BaseDialog from "@shared/ui/dialog/BaseDialog";
import {closeDialog} from "@shared/ui/dialog/dialogHelper";
import type {IDialogActions} from "@shared/ui/dialog/IDialogActions";
import DeleteIcon from '@mui/icons-material/Delete';

interface DeleteConfirmDialogProps {
    onConfirm: () => Promise<void> | void;
    title?: string;
    description?: string;
    isPending?: boolean;
}

const DeleteConfirmDialog = (
    {
        onConfirm,
        title,
        description,
        isPending = false
    }: DeleteConfirmDialogProps,
    ref: ForwardedRef<IDialogActions>
) => {
    const {t} = useTranslation(["common"]);

    const handleConfirm = async () => {
        await onConfirm();
        closeDialog(ref);
    };

    return (
        <BaseDialog ref={ref} minWidth={400} minHeight={200}>
            <DialogTitle sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <DeleteIcon color="error" />
                {title || t("common:dialog.delete.title")}
            </DialogTitle>
            <DialogContent>
                <Typography>
                    {description || t("common:dialog.delete.description")}
                </Typography>
            </DialogContent>
            <DialogActions sx={{px: 3, pb: 2}}>
                <Button 
                    onClick={() => closeDialog(ref)} 
                    disabled={isPending}
                    variant="outlined"
                    color="inherit"
                >
                    {t("common:button.cancel")}
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="error"
                    disabled={isPending}
                    sx={{minWidth: 120}}
                >
                    {isPending ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <CircularProgress size={18} color="inherit" />
                            <Typography variant="button">
                                {t("common:dialog.delete.pending")}...
                            </Typography>
                        </Stack>
                    ) : (
                        t("common:button.delete")
                    )}
                </Button>
            </DialogActions>
        </BaseDialog>
    );
};

export default forwardRef(DeleteConfirmDialog);
