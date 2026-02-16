import type {PaperProps as MUIPaperProps} from "@mui/material";

export const getMrtTablePaperProps = (): MUIPaperProps => ({
    elevation: 0,
    sx: {
        paddingRight: 0.2,
        bgcolor: 'transparent',
        overflow: 'hidden'
    }
});
