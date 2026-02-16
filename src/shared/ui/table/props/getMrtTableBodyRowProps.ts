import type {TableRowProps as MUITableRowProps, Theme} from "@mui/material";
import type {MRT_Row, MRT_RowData, MRT_TableInstance} from "material-react-table";

export const getMrtTableBodyRowProps = <D extends MRT_RowData, >(
    table: MRT_TableInstance<D>,
    row: MRT_Row<D>,
    staticRowIndex: number,
    theme: Theme,
    isDetailPanel?: boolean,
    overrideProps = {},
): MUITableRowProps => ({
    onDoubleClick: () => (table.setEditingRow(row)),
    sx: {
        borderRadius: 20,
        // zebra rows
        backgroundColor: !isDetailPanel
            ? (staticRowIndex % 2
                ? theme.palette.tableColors.tableRow1
                : theme.palette.tableColors.tableRow2)
            : undefined,
        "&:hover": {
            backgroundColor: !isDetailPanel
                ? theme.palette.tableColors.hover
                : undefined,
            "& *": {
                // color: `${theme.palette.primary.}`,
            },
            "& button.pending svg": {
                fill: `${theme.palette.warning.main} !important`,
            },
            "& button.partner-accepted svg": {
                fill: `${theme.palette.primary.main} !important`,
            },
            "& button.partner-declined svg": {
                fill: `${theme.palette.error.main} !important`,
            },
        },
        "& button.pending svg": {
            fill: `${theme.palette.warning.main} !important`,
        },
        "& button.partner-accepted svg": {
            fill: `${theme.palette.primary.main} !important`,
        },
        "& button.partner-declined svg": {
            fill: `${theme.palette.error.main} !important`,
        },
        "& .Mui-disabled": {
            color: 'inherit',
            opacity: 0.5,
        },
    },
    ...overrideProps,
});
