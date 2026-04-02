import type {PaperProps as MUIPaperProps} from "@mui/material";

export const getMrtTablePaperProps = (): MUIPaperProps => ({
    elevation: 0,
    sx: {
        bgcolor: 'transparent',
        overflow: 'hidden'
    }
});
