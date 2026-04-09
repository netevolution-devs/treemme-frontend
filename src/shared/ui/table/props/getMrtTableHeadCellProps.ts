import type {TableCellProps as MUITableCellProps} from "@mui/material";

export const getMrtTableHeadCellProps = (): MUITableCellProps => ({
    sx: {
        margin: 0,
        paddingLeft: 1,
        paddingTop: 0.5,
        paddingBottom: 0.5,
        fontWeight: 600,
        border: 'none',
    }
})
