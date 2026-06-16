import type {TableCellProps as MUITableCellProps} from "@mui/material";

export const getMrtTableHeadCellProps = (): MUITableCellProps => ({
    sx: {
        margin: 0,
        paddingLeft: 1,
        paddingTop: 0.5,
        paddingBottom: 0.5,
        fontWeight: 600,
        borderBottom: 'none',
        borderLeft: '1px solid',
        borderLeftColor: 'grey.400',
        '&:first-of-type': {
            borderLeft: 'none',
        },
    },
})
