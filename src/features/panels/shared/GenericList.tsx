import React from "react";
import {
    MaterialReactTable,
    type MRT_ColumnDef,
    type MRT_TableOptions,
    useMaterialReactTable
} from "material-react-table";
import { Box } from "@mui/material";
import { useDefaultMrtOptions } from "@ui/table/useDefaultMrtOptions.ts";

export interface BaseEntity {
    id: string | number;
}

interface GenericListProps<TData extends BaseEntity> {
    data: TData[] | undefined;
    isLoading: boolean;
    columns: MRT_ColumnDef<TData>[];
    selectedId?: string | number | null | undefined;
    onRowSelect: (id: TData["id"]) => void;
    onRowDoubleClick?: (id: TData["id"]) => void;
    additionalOptions?: Partial<MRT_TableOptions<TData>>;
    maxHeight?: string;
}

const GenericList = <TData extends BaseEntity>({
                                                   data,
                                                   isLoading,
                                                   columns,
                                                   selectedId,
                                                   onRowSelect,
                                                   onRowDoubleClick,
                                                   additionalOptions,
                                                   maxHeight = '400px'
                                               }: GenericListProps<TData>) => {

    const overrideOptions: Partial<MRT_TableOptions<TData>> = {
        enablePagination: false,
        muiTableContainerProps: {
            sx: { maxHeight },
        },
        muiTableBodyRowProps: ({ row }) => ({
            onDoubleClick: () => {
                onRowSelect(row.original.id);
                onRowDoubleClick?.(row.original.id);
            },
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                onRowSelect(row.original.id);
            },
            selected: row.original.id === selectedId,
            sx: { cursor: 'pointer' }
        }),
        ...additionalOptions,
    };

    const defaultMrtOptions = useDefaultMrtOptions<TData>(overrideOptions);

    const table = useMaterialReactTable<TData>({
        ...defaultMrtOptions,
        columns,
        data: data || [],
        enableRowActions: false,
        autoResetPageIndex: false,
        state: {
            isLoading: isLoading,
            ...additionalOptions?.state
        },
        enableRowVirtualization: true,
        enableTopToolbar: false,
        enableBottomToolbar: false,
    });

    return (
        <Box sx={{width: '100%', overflowY: 'auto'}}>
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default GenericList;