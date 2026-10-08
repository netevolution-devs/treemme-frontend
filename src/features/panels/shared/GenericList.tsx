import {
    MaterialReactTable,
    type MRT_ColumnDef,
    type MRT_TableOptions,
    useMaterialReactTable
} from "material-react-table";
import {Box, Card, CircularProgress} from "@mui/material";
import {useDefaultMrtOptions} from "@ui/table/useDefaultMrtOptions";
import {useEffect, useMemo, useState} from "react";

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
    disablePadding?: boolean;
    fullHeight?: boolean;
    fillHeight?: boolean;
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
                                                   maxHeight = '500px',
                                                   minHeight = '500px',
                                                   disableBorder = false,
                                                   disablePadding = false,
                                                   fullHeight = false,
                                                   fillHeight = fullHeight,
                                               }: GenericListProps<TData>) => {
    const [skeletonRowCount, setSkeletonRowCount] = useState(15);
    const showSkeletons = additionalOptions?.state?.showSkeletons !== false &&
        ((additionalOptions?.state?.isLoading ?? isLoading) || additionalOptions?.state?.showSkeletons);
    const skeletonData = useMemo(() => Array.from({length: skeletonRowCount}, (_, index) => ({
        ...Object.fromEntries(columns.map(column => [column.accessorKey ?? column.id ?? '', null])),
        id: `skeleton-${index}`,
    } as TData)), [columns, skeletonRowCount]);

    const calculateMin = parseInt(minHeight.split('px')[0]);
    const filterHeight = additionalOptions?.enableTopToolbar ? 50 : 0;
    const _minHeight = calculateMin + filterHeight;

    const overrideOptions: Partial<MRT_TableOptions<TData>> = {
        muiTableContainerProps: {
            sx: fillHeight
                ? {flex: 1, minHeight: 0, maxHeight: 'none'}
                : {maxHeight, minHeight},
        },
        muiTableBodyRowProps: ({row}) => ({
            onDoubleClick: () => {
                if (showSkeletons) return;
                onRowDoubleClick?.(row.original.id);
            },
            onClick: () => {
                if (showSkeletons) return;
                onRowSelect?.(row.original.id);
            },
            selected: row.original.id === selectedId,
            sx: {cursor: 'pointer'}
        }),
        // Dockview visibility changes can leave virtual rows unmeasured and blank.
        // MRT fixes this option at mount, so it must not depend on data.length.
        enableRowVirtualization: false,
        ..._overrideOptions,
    };

    const defaultMrtOptions = useDefaultMrtOptions<TData>(overrideOptions);

    const table = useMaterialReactTable<TData>({
        enableBottomToolbar: false,
        enableTopToolbar: false,
        ...defaultMrtOptions,
        muiSkeletonProps: {
            height: 24,
        },
        ...additionalOptions,
        ...(fillHeight && {
            muiTablePaperProps: {
                elevation: 0,
                sx: {
                    bgcolor: 'transparent',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    minHeight: 0,
                },
            },
        }),
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
        data: showSkeletons && !data.length ? skeletonData : data,
        state: {
            isLoading: isLoading,
            ...additionalOptions?.state
        },
    });

    useEffect(() => {
        if (!showSkeletons || data.length) return;
        const container = table.refs.tableContainerRef.current;
        if (!container) return;

        const updateRowCount = () => {
            const headerHeight = table.refs.tableHeadRef.current?.getBoundingClientRect().height ?? 0;
            const footerHeight = table.refs.tableFooterRef.current?.getBoundingClientRect().height ?? 0;
            const rowHeight = container.querySelector('tbody tr')?.getBoundingClientRect().height || 32;
            setSkeletonRowCount(Math.max(1, Math.ceil((container.clientHeight - headerHeight - footerHeight) / rowHeight)));
        };
        updateRowCount();
        const observer = new ResizeObserver(updateRowCount);
        observer.observe(container);
        if (table.refs.tableHeadRef.current) observer.observe(table.refs.tableHeadRef.current);
        return () => observer.disconnect();
    }, [showSkeletons, data.length, table]);

    const content = () => {
        return (
            <Box sx={{width: '100%', position: 'relative', minHeight: fillHeight ? 0 : _minHeight,
                ...(fillHeight && {flex: 1, display: 'flex', flexDirection: 'column'})}}>
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

                <Box sx={fillHeight ? {flex: 1, minHeight: 0, overflow: 'hidden'} : {overflowY: 'auto'}}>
                    <MaterialReactTable table={table}/>
                </Box>
            </Box>

        )
    }

    return (
        <>
            {!disableBorder ? (
                <Card variant={"outlined"} sx={{bgcolor: "background.card.default",
                    ...(fillHeight ? {flex: 1, minHeight: 0, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column'} : {minHeight: _minHeight, maxHeight})}}>
                    {content()}
                </Card>
            ) : (
                <Box sx={{bgcolor: "background.card.default", border: "1px solid", borderColor: !disablePadding ? 'divider' : 'transparent', borderRadius: 1, p: !disablePadding ? 1 : 0,
                    ...(fillHeight && {flex: 1, minHeight: 0, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column'})}}>
                    {content()}
                </Box>
            )}
        </>
    );
};

export default GenericList;
