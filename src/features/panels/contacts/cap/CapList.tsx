import {Box} from "@mui/material";
import {useDefaultMrtOptions} from "@ui/table/useDefaultMrtOptions.ts";
import {
    MaterialReactTable,
    type MRT_ColumnDef,
    type MRT_TableOptions,
    useMaterialReactTable
} from "material-react-table";
import React, {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ICapStoreState} from "@features/panels/contacts/cap/CapPanel.tsx";
import type {ICap} from "@features/panels/contacts/cap/api/ICap.ts";
import {capApi} from "@features/panels/contacts/cap/api/capApi.ts";

const CapList = () => {
    const {t} = useTranslation(["form"]);
    const {useGetList} = capApi;
    const {data: caps, isLoading} = useGetList();

    const {useStore} = usePanel<unknown, ICapStoreState>();
    const {selectedCapId} = useStore(state => state.uiState);
    const setUIState = useStore(state => state.setUIState);

    const overrideOptions: Partial<MRT_TableOptions<ICap>> = {
        enablePagination: false,
        muiTableContainerProps: {
            sx: {
                maxHeight: '400px',
            },
        },
        muiTableBodyRowProps: ({row}) => ({
            onDoubleClick: () => {
                setUIState({selectedCapId: row.original.id});
            },
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                setUIState({selectedCapId: row.original.id});
            },
            selected: row.original.id === selectedCapId,
        }),
    };

    const defaultMrtOptions = useDefaultMrtOptions<ICap>(overrideOptions);

    const columns = useMemo<MRT_ColumnDef<ICap>[]>(
        () => [
            {
                accessorKey: "cap",
                header: t("cap.code"),
            },
            {
                accessorKey: "name",
                header: t("cap.name"),
            },
            {
                accessorKey: "province.name",
                header: t("province.name"),
            }
        ],
        [t]
    );

    const table = useMaterialReactTable<ICap>({
        ...defaultMrtOptions,
        columns,
        data: caps || [],
        enableRowActions: false,
        autoResetPageIndex: false,
        state: {
            isLoading: isLoading
        },
        enableRowVirtualization: true,
        enableTopToolbar: false,
        enableBottomToolbar: false,
    });

    return (
        <Box>
            <MaterialReactTable table={table}/>
        </Box>
    );
};

export default CapList;