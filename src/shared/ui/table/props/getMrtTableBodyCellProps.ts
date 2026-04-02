import type {TableCellProps as MUITableCellProps, Theme} from "@mui/material";
import type {MRT_Column, MRT_RowData} from "material-react-table";

export const getMrtTableBodyCellProps = <TData extends MRT_RowData>(
    _column: MRT_Column<TData>,
    _theme: Theme,
): MUITableCellProps => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const __ = { _column, _theme };
    return {
        sx: {
            border: 0,
            paddingLeft: 1.5,
            paddingTop: 0.5,
            paddingBottom: 0.5,
        }
    };
}
