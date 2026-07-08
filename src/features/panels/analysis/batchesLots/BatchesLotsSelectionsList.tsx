import {Box, Link, Typography} from "@mui/material";
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

    const {useStore} = usePanel<unknown, IBatchesLotsStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);

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
            id: `batches:${batch.id}`,
            component: "batches",
            params: {id: batch.id, batch_code: batch.code},
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
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar: () => <ListToolbar label={t("batches.tabs.selections")}/>,
                renderDetailPanel: ({row}) => {
                    const batches = row.original.batches;
                    if (!batches || batches.length === 0) {
                        return (
                            <Box sx={{pl: 4, py: 1}}>
                                <Typography variant="body2" sx={{fontStyle: "italic"}}>
                                    Nessun lotto associato
                                </Typography>
                            </Box>
                        );
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
                            Cell: ({row: batchRow}) => (
                                <Link
                                    component="button"
                                    variant="body2"
                                    underline="hover"
                                    onClick={() => handleOpenBatch(batchRow.original)}
                                >
                                    {batchRow.original.code}
                                </Link>
                            ),
                        },
                        {
                            accessorKey: "pieces",
                            header: "Pezzi",
                            size: 100,
                        },
                    ];

                    return (
                        <Box sx={{pl: 4, pr: 2, py: 1}}>
                            <GenericList<(typeof batchData)[number]>
                                disablePadding
                                data={batchData}
                                columns={batchColumns}
                                disableBorder
                                maxHeight={"200px"}
                                minHeight={"100px"}
                                isLoading={false}
                            />
                        </Box>
                    );
                },
            }}
        />
    )
}

export default BatchesLotsSelectionsList;
