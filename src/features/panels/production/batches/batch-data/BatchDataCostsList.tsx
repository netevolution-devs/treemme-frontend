import {useTranslation} from "react-i18next";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import {Box} from "@mui/material";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import type {IBatchCost} from "@features/panels/production/batches/api/IBatchCost";
import GenericList from "@features/panels/shared/GenericList";

interface BatchDataCostsListProps {
    batchId?: number | null;
}

const BatchDataCostsList = ({batchId}: BatchDataCostsListProps) => {
    const {t} = useTranslation(["form"]);
    const {data: costs = [], isLoading: isLoadingCosts} = batchApi.useGetBatchCosts(batchId);

    const columns = useMemo<MRT_ColumnDef<IBatchCost>[]>(() => [
        {
            accessorKey: "batch_cost_type.name",
            header: t("production.batch.batch-data.type"),
        },
        {
            accessorKey: "date",
            header: t("production.batch.batch-data.date"),
            Cell: ({cell}) => cell.getValue<string>() && new Date(cell.getValue<string>()).toLocaleDateString(),
        },
        {
            accessorKey: "cost",
            header: t("production.batch.batch-data.cost"),
            muiTableBodyCellProps: {
                align: 'right',
            },
            Cell: ({cell, row}) => (
                <Box>
                    {cell.getValue<number>()?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })} {row.original.currency?.sign}
                </Box>
            ),
        },
        {
            accessorKey: "cost_note",
            header: t("production.batch.batch-data.note"),
        }
    ], [t]);

    return (
        <GenericList<IBatchCost>
            data={costs}
            isLoading={isLoadingCosts}
            columns={columns}
            minHeight="200px"
            maxHeight="400px"
        />
    );
};

export default BatchDataCostsList;
