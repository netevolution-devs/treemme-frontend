import type {MRT_Localization, MRT_RowData, MRT_TableOptions} from "material-react-table";
import {useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {MRT_Localization_IT} from "material-react-table/locales/it";
import {getMrtContainerProps} from "@ui/table/props/getMrtContainerProps.ts";
import {getMrtTableHeadCellProps} from "@ui/table/props/getMrtTableHeadCellProps.ts";
import {getMrtTableBodyCellProps} from "@ui/table/props/getMrtTableBodyCellProps.ts";
import {getMrtBottomToolbarProps} from "@ui/table/props/getMrtBottomToolbarProps.ts";
import {getMrtTopToolbarProps} from "@ui/table/props/getMrtTopToolbarProps.ts";
import {getMrtTablePaperProps} from "@ui/table/props/getMrtTablePaperProps.ts";
import {getMrtTableBodyRowProps} from "@ui/table/props/getMrtTableBodyRowProps.ts";
import {getMrtRowDialogProps} from "@ui/table/props/getMrtRowDialogProps.ts";
import {MRT_Localization_EN} from "material-react-table/locales/en";

const tableLocale: Record<string, MRT_Localization> = {
    "en": MRT_Localization_EN,
    "it": MRT_Localization_IT,
}

export const useDefaultMrtOptions = <TData extends MRT_RowData>(
    overrideProps?: Partial<MRT_TableOptions<TData>>,
): Partial<MRT_TableOptions<TData>> => {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
    const {i18n} = useTranslation()

    return {
        enableColumnActions: false,
        enableFilters: true,
        enableFullScreenToggle: false,
        enableDensityToggle: false,
        enableHiding: false,
        enableRowActions: true,
        enableToolbarInternalActions: false,
        enableFilterMatchHighlighting: false,
        columnFilterDisplayMode: 'popover',

        positionGlobalFilter: "none",
        globalFilterFn: 'contains',

        localization: tableLocale[i18n.language],
        enableEditing: false,
        createDisplayMode: "modal",
        editDisplayMode: "modal",

        positionPagination: "bottom",
        initialState: {
            density: 'comfortable',
            pagination: {
                pageSize: 10,
                pageIndex: 0,
            },
        },

        displayColumnDefOptions: {
            "mrt-row-actions": {
                size: 0,
            },
        },

        muiTableContainerProps: (props) => {
            const overrideContainerProps = typeof overrideProps?.muiTableContainerProps === 'function'
                ? overrideProps.muiTableContainerProps(props)
                : overrideProps?.muiTableContainerProps;

            return getMrtContainerProps(theme, overrideContainerProps);
        },

        defaultColumn: {
            muiTableHeadCellProps: () => getMrtTableHeadCellProps(theme),
            muiTableBodyCellProps: (props) => getMrtTableBodyCellProps<TData>(props.column, theme),
        },
        muiBottomToolbarProps: () => getMrtBottomToolbarProps(),
        muiTopToolbarProps: () => getMrtTopToolbarProps(),

        muiTablePaperProps: () => getMrtTablePaperProps(),
        muiTableBodyRowProps: ({table, row, staticRowIndex, isDetailPanel}) =>
            getMrtTableBodyRowProps(
                table,
                row,
                staticRowIndex,
                theme,
                isDetailPanel,
                {
                    ...overrideProps?.muiTableBodyRowProps,
                    ...(typeof overrideProps?.muiTableBodyRowProps === 'function'
                        ? overrideProps.muiTableBodyRowProps({
                            table,
                            row,
                            staticRowIndex,
                            isDetailPanel: isDetailPanel ?? false,
                        })
                        : {}),
                },
            ),

        muiCreateRowModalProps: () =>
            getMrtRowDialogProps({
                ...overrideProps?.muiCreateRowModalProps,
                ...overrideProps?.muiEditRowDialogProps,
            }, isLargeScreen),
        muiEditRowDialogProps: () =>
            getMrtRowDialogProps({
                ...overrideProps?.muiCreateRowModalProps,
                ...overrideProps?.muiEditRowDialogProps,
            }, isLargeScreen),
    };
};
