import type {TableCellProps as MUITableCellProps, Theme} from "@mui/material";
import type {MRT_Column, MRT_RowData} from "material-react-table";

export const getMrtTableBodyCellProps = <TData extends MRT_RowData>(
    column: MRT_Column<TData>,
    theme: Theme,
): MUITableCellProps => {
    const columnsAmount: number = column?.columns ? column.columns.length : 0;
    const columnIndex: number = column.getIndex();

    return {
        sx: {
            borderLeft: columnIndex === 0 ? `1px solid ${theme.palette.tableColors.border}` : "",
            borderRight: columnIndex === columnsAmount ? "" : `1px solid ${theme.palette.tableColors.border}`,
            border: 0,
            paddingLeft: 1.5,
            paddingTop: 0.5,
            paddingBottom: 0.5,
        }
    };
}
