import type {TableCellProps as MUITableCellProps, Theme} from "@mui/material";

export const getMrtTableBodyCellProps = (theme?: Theme): MUITableCellProps => {
    return {
        sx: {
            borderBottom: 'none',
            borderLeft: '1px solid',
            borderLeftColor: theme?.palette.mode === 'light' ? 'grey.400' : 'divider',
            paddingLeft: 1.5,
            paddingTop: 0.5,
            paddingBottom: 0.5,
            textTransform: "uppercase",
            '&:first-of-type': {
                borderLeft: 'none',
            },
        }
    };
}
