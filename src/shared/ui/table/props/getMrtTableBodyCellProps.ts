import type {TableCellProps as MUITableCellProps} from "@mui/material";

export const getMrtTableBodyCellProps = (): MUITableCellProps => {
    return {
        sx: {
            borderBottom: 'none',
            borderLeft: '1px solid',
            borderLeftColor: 'grey.400',
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
