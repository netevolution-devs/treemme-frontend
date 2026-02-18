import {Box} from "@mui/material";
import useGetListProvince from "@features/panels/contacts/province/api/useGetListProvince.tsx";
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
import type {IProvinceStoreState} from "@features/panels/contacts/province/ProvincePanel.tsx";
import type {IProvince} from "@features/panels/contacts/province/api/IProvince.ts";

const ProvinceList = () => {
    const {t} = useTranslation(["form"]);
    const {data: provinces, isLoading} = useGetListProvince();

    const {useStore} = usePanel<unknown, IProvinceStoreState>();
    const setUIState = useStore(state => state.setUIState);

    const overrideOptions: Partial<MRT_TableOptions<IProvince>> = {
        muiTableBodyRowProps: ({row}) => ({
            onDoubleClick: () => {
                setUIState({selectedProvinceId: row.original.id});
            },
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                setUIState({selectedProvinceId: row.original.id});
            },
        }),
    };
    const defaultMrtOptions = useDefaultMrtOptions<IProvince>(overrideOptions);

    const columns = useMemo<MRT_ColumnDef<IProvince>[]>(
        () => [
            {
                accessorKey: "acronym",
                header: t("province.acronym")
            },
            {
                accessorKey: "name",
                header: t("province.name")
            }
        ],
        [t]
    );

    const table = useMaterialReactTable<IProvince>({
        ...defaultMrtOptions,
        columns,
        data: provinces || [],
        enableRowActions: false,
        autoResetPageIndex: false,
        state: {
            isLoading: isLoading
        },
        enableRowVirtualization: true,
        enableTopToolbar: false,
        // enableTableHead:false
    })

    return (
        <Box>
            <MaterialReactTable table={table}/>
        </Box>
    )
}

export default ProvinceList;