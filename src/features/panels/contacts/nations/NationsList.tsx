import {
    MaterialReactTable,
    type MRT_ColumnDef,
    type MRT_TableOptions,
    useMaterialReactTable
} from "material-react-table";
import {Box} from "@mui/material";
import React, {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {nationsApi} from "@features/panels/contacts/nations/api/nationsApi.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {INationsStoreState} from "@features/panels/contacts/nations/NationsPanel.tsx";
import {useDefaultMrtOptions} from "@ui/table/useDefaultMrtOptions.ts";
import type {INation} from "@features/panels/contacts/nations/api/INation.ts";

const NationsList = () => {
    const {t} = useTranslation(["form"]);
    const {useGetList} = nationsApi;
    const {data: nations, isLoading} = useGetList();

    const {useStore} = usePanel<unknown, INationsStoreState>();
    const {selectedNationId} = useStore(state => state.uiState);
    const setUIState = useStore(state => state.setUIState);

    const overrideOptions: Partial<MRT_TableOptions<INation>> = {
        enablePagination: false,
        muiTableContainerProps: {
            sx: {
                maxHeight: '400px',
            },
        },
        muiTableBodyRowProps: ({row}) => ({
            onDoubleClick: () => {
                setUIState({selectedNationId: row.original.id});
            },
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                setUIState({selectedNationId: row.original.id});
            },
            selected: row.original.id === selectedNationId,
        }),
    };
    const defaultMrtOptions = useDefaultMrtOptions<INation>(overrideOptions);

    const columns = useMemo<MRT_ColumnDef<INation>[]>(
        () => [
            {
                accessorKey: "name",
                header: t("nations.name")
            },
        ],
        [t]
    );

    const table = useMaterialReactTable<INation>({
        ...defaultMrtOptions,
        columns,
        data: nations || [],
        enableRowActions: false,
        autoResetPageIndex: false,
        state: {
            isLoading: isLoading
        },
        enableRowVirtualization: true,
        enableTopToolbar: false,
        enableBottomToolbar: false,
    })

    return (
        <Box>
            <MaterialReactTable table={table}/>
        </Box>
    )
}

export default NationsList;