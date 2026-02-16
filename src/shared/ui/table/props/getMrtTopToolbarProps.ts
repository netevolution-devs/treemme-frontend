import type {BoxProps as MUIBoxProps} from "@mui/material";

export const getMrtTopToolbarProps = (): MUIBoxProps => ({
    sx: {
        background: 'transparent',
        margin: 0,
        boxShadow: 'none',
        p: 0,
        '& .MuiBox-root': {
            p: 0,
        }
    }
})
