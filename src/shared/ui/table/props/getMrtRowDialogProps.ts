import type {DialogProps as MUIDialogProps} from "@mui/material";

export const getMrtRowDialogProps = (overrideProps = {}, isLargeScreen: boolean): MUIDialogProps => ({
    maxWidth: false,
    fullWidth: false,
    fullScreen: !isLargeScreen,
    ...overrideProps,
    open: true, //Managed by component, leave on true
})
