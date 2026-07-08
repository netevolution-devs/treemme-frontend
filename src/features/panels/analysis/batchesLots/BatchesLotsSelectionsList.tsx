import {Box, MenuItem, useTheme} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GenericList from "@features/panels/shared/GenericList";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IBatchesLotsStoreState} from "@features/panels/analysis/batchesLots/BatchesLotsPanel";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IBatchInSelection, IBatchSelectionQuantityItem} from "@features/panels/analysis/batchesLots/api/IBatchDetailReport";
import type {BaseEntity} from "@features/panels/shared/GenericList";
import ListToolbar from "@features/panels/shared/ListToolbar";
import {useDockviewStore} from "@ui/panel/store/DockviewStore";

type IBatchSelectionQuantityRow = IBatchSelectionQuantityItem & BaseEntity;

const BatchesLotsSelectionsList = () => {
    const {t} = useTranslation(["form"]);
    const theme = useTheme();

    const {useStore} = usePanel<unknown, IBatchesLotsStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);
    const selectedBatchSelectionId = useStore(state => state.uiState.selectedBatchSelectionId);
    const setUIState = useStore(state => state.setUIState);

    const addPanel = useDockviewStore(state => state.addPanel);

    const {data: raw = [], isLoading, isFetching} = batchApi.useGetBatchSelectionQuantities(selectedBatchId as number);

    const selections = Array.isArray(raw) ? raw : [];

    const data = useMemo(() => {
        return selections.map((item, index) => ({
            ...item,
            id: item.selection_id || index
        }));
    }, [selections]);

    const columns = useMemo<MRT_ColumnDef<IBatchSelectionQuantityRow>[]>(() => [
        {
            accessorKey: "selection_name",
            header: t("batches.selections.selection_name"),
        },
        {
            accessorKey: "total.pieces",
            header: t("batches.selections.total_pieces"),
        },
        {
            accessorKey: "total.quantity",
            header: t("batches.selections.total_quantity"),
        },
        {
            accessorKey: "available.pieces",
            header: t("batches.selections.available_pieces"),
        },
        {
            accessorKey: "available.quantity",
            header: t("batches.selections.available_quantity"),
        },
    ], [t]);

    const handleOpenBatch = (batch: IBatchInSelection) => {
        addPanel({
            id: `batches:${crypto.randomUUID()}`,
            title: t("menu:menu.production.batches"),
            component: 'batches',
            params: {
                extra: {
                    id: batch.id,
                    batch_code: batch.code,
                }
            }
        });
    };

    return (
        <GenericList<IBatchSelectionQuantityRow>
            disableBorder
            data={data}
            minHeight={"400px"}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedBatchSelectionId}
            onRowSelect={(id) => setUIState({selectedBatchSelectionId: id as number})}
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar: () => <ListToolbar label={t("batches.tabs.selections")}/>,
                muiExpandButtonProps: {
                    sx: {
                        '&.Mui-disabled': {
                            opacity: 0.15,
                        },
                    },
                },
                muiDetailPanelProps: {
                    sx: {p: 0},
                    style: {color: `${theme.palette.text.primary} !important`} as React.CSSProperties,
                },
                renderDetailPanel: ({row}) => {
                    const batches = row.original.batches;
                    if (!batches || batches.length === 0) {
                        return null;
                    }

                    const batchData = batches.map((batch, i) => ({
                        ...batch,
                        id: batch.id || i,
                    }));

                    const batchColumns: MRT_ColumnDef<(typeof batchData)[number]>[] = [
                        {
                            accessorKey: "code",
                            header: "Codice Lotto",
                            size: 200,
                        },
                        {
                            accessorKey: "pieces",
                            header: "Pezzi",
                            size: 100,
                        },
                    ];

                    return (
                        <Box sx={{pl: 4, pb: 2}}>
                            <GenericList<(typeof batchData)[number]>
                                disablePadding
                                data={batchData}
                                columns={batchColumns}
                                disableBorder
                                maxHeight={"400px"}
                                minHeight={"0px"}
                                isLoading={false}
                                additionalOptions={{
                                    enableRowActions: true,
                                    renderRowActionMenuItems: ({row, closeMenu}) => [
                                        <MenuItem key={"view_batch"} onClick={() => {
                                            handleOpenBatch(row.original);
                                            closeMenu();
                                        }}>
                                            <VisibilityIcon color={"primary"} sx={{mr: 1}} />
                                            {t("processes.view_batch")}
                                        </MenuItem>,
                                    ],
                                }}
                            />
                        </Box>
                    );
                },
            }}
        />
    )
}

export default BatchesLotsSelectionsList;
