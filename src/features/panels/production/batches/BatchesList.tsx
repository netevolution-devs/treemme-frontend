import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IBatchesStoreFilter, IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel.tsx";
import {batchApi} from "@features/panels/production/batches/api/batchApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IBatch} from "@features/panels/production/batches/api/IBatch.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import TextFieldFilter from "@ui/form/filters/TextFieldFilter.tsx";
import {cleanFilters} from "@ui/form/filters/useCleanFilters.ts";

const BatchesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<IBatchesStoreFilter, IBatchesStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);
    const setUIState = useStore(state => state.setUIState);
    const setFilters = useStore(state => state.setFilters);

    const filterBatchCode = useStore(state => state.filters.filterBatchCode);

    const queryParams = useMemo(() => cleanFilters(
        {
            code: filterBatchCode,
        }
    ), [filterBatchCode]);

    const {data: batches = [], isLoading} = batchApi.useGetList({queryParams});

    const columns = useMemo<MRT_ColumnDef<IBatch>[]>(() => [
        {
            accessorKey: "batch_code",
            header: t("production.batch.batch_code")
        },
        {
            header: t("orders.row.product"),
            Cell: ({row}) => row.original.leather?.name as string || row.original.article?.name as string
        },
        {
            accessorKey: "pieces",
            header: t("production.batch.pieces")
        },
        {
            accessorKey: "stock_items",
            header: t("production.batch.stock_items")
        },
        {
            accessorKey: "quantity",
            header: t("production.batch.quantity")
        },
        {
            accessorKey: "measurement_unit.prefix",
            header: t("production.batch.measurement_unit")
        }
    ], [t]);

    return (
        <GenericList<IBatch>
            data={batches}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedBatchId}
            onRowSelect={(id) => setUIState({selectedBatchId: id})}
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar: () => (
                    <ListToolbar
                        filters={[
                            <TextFieldFilter
                                key={"f-batch_code"}
                                label={t("production.batch.batch_code")}
                                value={filterBatchCode}
                                onFilterChange={(val) => setFilters({filterBatchCode: val as string})}
                            />
                        ]}
                    />
                )
            }}
        />
    );
};

export default BatchesList;