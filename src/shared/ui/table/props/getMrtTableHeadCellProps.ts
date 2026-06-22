import type {TableCellProps as MUITableCellProps, Theme} from "@mui/material";

export const getMrtTableHeadCellProps = (theme?: Theme): MUITableCellProps => ({
    sx: {
        margin: 0,
        paddingLeft: 1,
        paddingTop: 0.5,
        paddingBottom: 0.5,
        fontWeight: 600,
        borderBottom: 'none',
        borderLeft: '1px solid',
        borderLeftColor: theme?.palette.mode === 'light' ? 'grey.400' : 'divider',
        '&:first-of-type': {
            borderLeft: 'none',
        },
    },
})
