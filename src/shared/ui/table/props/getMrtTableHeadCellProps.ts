import type {TableCellProps as MUITableCellProps, Theme} from "@mui/material";

export const getMrtTableHeadCellProps = (theme: Theme): MUITableCellProps => ({
    sx: {
        margin: 0,
        paddingLeft: 1,
        paddingTop: 0.5,
        paddingBottom: 0.5,
        backgroundColor: theme.palette.mode === "light" ? theme.palette.primary.light : theme.palette.action.hover,
        color: theme.palette.mode === "light" ? theme.palette.primary.contrastText : theme.palette.primary.main,
        fontWeight: 600,
        border: 'none'
    }
})
