import type {MRT_Localization, MRT_RowData, MRT_TableOptions} from "material-react-table";
import {Box, Typography, useMediaQuery, useTheme} from "@mui/material";
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
        enableRowVirtualization: overrideProps?.enableRowVirtualization ?? false, // If true, issues displaying rows when opening before-closed dockview panels
        autoResetPageIndex: false,
        enableColumnActions: false,
        enableFullScreenToggle: false,
        enableDensityToggle: false,
        enableHiding: false,
        enablePagination: overrideProps?.enablePagination ?? false,
        enableToolbarInternalActions: false,
        enableFilterMatchHighlighting: false,
        enableStickyHeader: true,

        positionGlobalFilter: "none",
        globalFilterFn: 'contains',

        localization: tableLocale[i18n.language],
        renderEmptyRowsFallback: () => (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
                width: '100%',
                padding: '20px',
                textAlign: 'center'
            }}>
                <Typography sx={{ whiteSpace: 'nowrap', mt: -5}} color={"textSecondary"} fontStyle={"italic"}>
                    {tableLocale[i18n.language]?.noRecordsToDisplay || 'Nessun record da mostrare'}
                </Typography>
            </Box>
        ),
        enableEditing: false,

        positionPagination: "bottom",
        initialState: {
            density: 'compact',
            pagination: {
                pageSize: 10,
                pageIndex: 0,
            },
            ...overrideProps?.initialState
        },

        muiTableContainerProps: (props) => {
            const overrideContainerProps = overrideProps?.muiTableContainerProps instanceof Function
                ? overrideProps.muiTableContainerProps(props)
                : overrideProps?.muiTableContainerProps;

            return getMrtContainerProps(theme, overrideContainerProps);
        },

        muiTablePaperProps: () => getMrtTablePaperProps(),

        muiBottomToolbarProps: () => getMrtBottomToolbarProps(),
        muiTopToolbarProps: () => getMrtTopToolbarProps(),

        defaultColumn: {
            muiTableHeadCellProps: () => getMrtTableHeadCellProps(),
            muiTableBodyCellProps: () => getMrtTableBodyCellProps(),
        },

        muiTableBodyRowProps: ({table, row, staticRowIndex, isDetailPanel}) =>
            getMrtTableBodyRowProps(
                table,
                row,
                staticRowIndex,
                theme,
                isDetailPanel,
                {
                    ...overrideProps?.muiTableBodyRowProps,
                    ...(overrideProps?.muiTableBodyRowProps instanceof Function
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
