import type {TableCellProps as MUITableCellProps} from "@mui/material";

export const getMrtTableBodyCellProps = (): MUITableCellProps => {
    return {
        sx: {
            border: 0,
            paddingLeft: 1.5,
            paddingTop: 0.5,
            paddingBottom: 0.5,
            textTransform: "uppercase",
        }
    };
}
