import {
    MaterialReactTable,
    type MRT_ColumnDef,
    type MRT_TableOptions,
    useMaterialReactTable
} from "material-react-table";
import {Box, Card, CircularProgress} from "@mui/material";
import {useDefaultMrtOptions} from "@ui/table/useDefaultMrtOptions.tsx";
import type {SyntheticEvent} from "react";

export interface BaseEntity {
    id: string | number;
}

interface GenericListProps<TData extends BaseEntity> {
    data: TData[];
    isLoading: boolean;
    isFetching?: boolean;
    columns: MRT_ColumnDef<TData>[];
    selectedId?: string | number | null | undefined;
    onRowSelect?: (id: TData["id"]) => void;
    onRowDoubleClick?: (id: TData["id"]) => void;
    additionalOptions?: Partial<MRT_TableOptions<TData>>;
    overrideOptions?: Partial<MRT_TableOptions<TData>>;
    maxHeight?: string;
    minHeight?: string;
    disableBorder?: boolean;
}

const GenericList = <TData extends BaseEntity>({
                                                   data = [],
                                                   isLoading = false,
                                                   isFetching = false,
                                                   columns,
                                                   selectedId,
                                                   onRowSelect,
                                                   onRowDoubleClick,
                                                   additionalOptions,
                                                   overrideOptions: _overrideOptions,
                                                   maxHeight = '300px',
                                                   minHeight = '300px',
                                                   disableBorder = false
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
                size: 50,
                minSize: 50,
                maxSize: 50,
                muiTableHeadCellProps: {
                    sx: {
                        padding: 0,
                        width: '50px',
                        maxWidth: '50px',
                        borderBottom: 'none',
                        pl: 0.8
                    },
                },
                muiTableBodyCellProps: {
                    sx: {
                        padding: 0,
                        width: '50px',
                        maxWidth: '50px',
                        borderBottom: 'none',
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

    const content = () => {
        return (
            <Box sx={{width: '100%', position: 'relative', minHeight: _minHeight}}>
                {(isFetching && !isLoading) && (
                    <Box sx={{
                        position: 'absolute',
                        right: 10,
                        top: additionalOptions?.enableTopToolbar ? 50 : 5,
                        zIndex: 1000
                    }}>
                        <CircularProgress size={20} thickness={5}/>
                    </Box>
                )}

                <Box sx={{overflowY: 'auto'}}>
                    <MaterialReactTable table={table}/>
                </Box>
            </Box>

        )
    }

    return (
        <>
            {!disableBorder ? (
                <Card variant={"outlined"} sx={{minHeight: _minHeight, maxHeight: maxHeight}}>
                    {content()}
                </Card>
            ) : (
                <Box>
                    {content()}
                </Box>
            )}
        </>
    );
};

export default GenericList;