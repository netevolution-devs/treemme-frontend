import {
    MaterialReactTable,
    type MRT_ColumnDef,
    type MRT_TableOptions,
    useMaterialReactTable
} from "material-react-table";
import {Box} from "@mui/material";
import {useDefaultMrtOptions} from "@ui/table/useDefaultMrtOptions.ts";
import type {SyntheticEvent} from "react";

export interface BaseEntity {
    id: string | number;
}

interface GenericListProps<TData extends BaseEntity> {
    data: TData[];
    isLoading: boolean;
    columns: MRT_ColumnDef<TData>[];
    selectedId?: string | number | null | undefined;
    onRowSelect?: (id: TData["id"]) => void;
    onRowDoubleClick?: (id: TData["id"]) => void;
    additionalOptions?: Partial<MRT_TableOptions<TData>>;
    overrideOptions?: Partial<MRT_TableOptions<TData>>;
    maxHeight?: string;
    minHeight?: string;
}

const GenericList = <TData extends BaseEntity>({
                                                   data = [],
                                                   isLoading,
                                                   columns,
                                                   selectedId,
                                                   onRowSelect,
                                                   onRowDoubleClick,
                                                   additionalOptions,
                                                   overrideOptions: _overrideOptions,
                                                   maxHeight = '300px',
                                                   minHeight = '300px',
                                               }: GenericListProps<TData>) => {

    const calculateMin = parseInt(minHeight.split('px')[0]);
    const filterHeight = additionalOptions?.enableTopToolbar ? 50 : 0;
    const _minHeight = calculateMin + filterHeight;

    const overrideOptions: Partial<MRT_TableOptions<TData>> = {
        muiTableContainerProps: {
            sx: {maxHeight, minHeight},
        },
        muiTableBodyRowProps: ({row}) => ({
            onDoubleClick: () => {
                onRowSelect?.(row.original.id);
                onRowDoubleClick?.(row.original.id);
            },
            onClick: (e: SyntheticEvent) => {
                e.preventDefault();
                onRowSelect?.(row.original.id);
            },
            selected: row.original.id === selectedId,
            sx: {cursor: 'pointer'}
        }),
        enableRowVirtualization: data.length > 50,
        ..._overrideOptions,
    };

    const defaultMrtOptions = useDefaultMrtOptions<TData>(overrideOptions);

    const table = useMaterialReactTable<TData>({
        enableBottomToolbar: false,
        enableTopToolbar: false,
        ...defaultMrtOptions,
        ...additionalOptions,
        displayColumnDefOptions: ({
            'mrt-row-actions': {
                size: 30,
                minSize: 30,
                maxSize: 30,
                muiTableHeadCellProps: {
                    sx: {
                        padding: 0,
                        width: '30px',
                        maxWidth: '30px',
                    },
                },
                muiTableBodyCellProps: {
                    sx: {
                        padding: 0,
                        width: '30px',
                        maxWidth: '30px',
                    },
                },
            },
        }),
        columns,
        data: data || [],
        state: {
            isLoading: isLoading,
            ...additionalOptions?.state
        },
    });

    return (
        <Box sx={{width: '100%', overflowY: 'scroll', minHeight: _minHeight}}>
            <MaterialReactTable table={table}/>
        </Box>
    );
};

export default GenericList;