import type {TableRowProps as MUITableRowProps, Theme} from "@mui/material";
import type {MRT_Row, MRT_RowData, MRT_TableInstance} from "material-react-table";

export const getMrtTableBodyRowProps = <D extends MRT_RowData, >(
    table: MRT_TableInstance<D>,
    row: MRT_Row<D>,
    staticRowIndex: number,
    theme: Theme,
    isDetailPanel?: boolean,
    overrideProps: MUITableRowProps = {},
): MUITableRowProps => {
    const isSelected = overrideProps.selected;

    return {
        onDoubleClick: () => (table.setEditingRow(row)),
        ...overrideProps,
        sx: {
            // zebra rows
            backgroundColor: !isDetailPanel
                ? (isSelected
                    ? `${theme.palette.primary.light} !important`
                    : (staticRowIndex % 2
                        ? theme.palette.tableColors.tableRow1
                        : theme.palette.tableColors.tableRow2))
                : undefined,
            "&:hover": {
                backgroundColor: !isDetailPanel
                    ? (isSelected
                        ? `${theme.palette.primary.main} !important`
                        : theme.palette.tableColors.hover)
                    : undefined,
                "& .MuiTableCell-root": isSelected ? {
                    color: `${theme.palette.primary.contrastText} !important`,
                } : {},
            },
            "& .MuiTableCell-root": isSelected ? {
                color: `${theme.palette.primary.contrastText} !important`,
            } : {},
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
            ...(overrideProps.sx instanceof Function
                    ? overrideProps.sx(theme)
                    : (overrideProps.sx || {})
            ),
        },
    };
};
