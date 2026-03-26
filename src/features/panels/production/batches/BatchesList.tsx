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
import SelectFieldFilter from "@ui/form/filters/SelectFieldFilter.tsx";
import {batchTypeApi} from "@features/panels/production/batches/api/batch-type/batchTypeApi.ts";

const BatchesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<IBatchesStoreFilter, IBatchesStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);
    const setUIState = useStore(state => state.setUIState);
    const filterBatchTypeId = useStore(state => state.filters.filterBatchTypeId);
    const setFilters = useStore(state => state.setFilters);

    const filterBatchCode = useStore(state => state.filters.filterBatchCode);

    const queryParams = useMemo(() => cleanFilters(
        {
            code: filterBatchCode,
            type: filterBatchTypeId as number,
        }
    ), [filterBatchCode, filterBatchTypeId]);

    const {data: batches = [], isLoading, isFetching} = batchApi.useGetList({queryParams});
    const {data: batchTypes = []} = batchTypeApi.useGetList();

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
        // {
        //     accessorKey: "quantity",
        //     header: t("production.batch.quantity")
        // },
        // {
        //     accessorKey: "stock_quantity",
        //     header: t("production.batch.stock_quantity")
        // },
        // {
        //     accessorKey: "measurement_unit.prefix",
        //     header: t("production.batch.measurement_unit")
        // }
    ], [t]);

    return (
        <GenericList<IBatch>
            data={batches}
            isLoading={isLoading}
            isFetching={isFetching}
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
                            />,
                            <SelectFieldFilter
                                key={"f-batch_type"}
                                label={t("production.batch.batch_type")}
                                value={filterBatchTypeId}
                                options={batchTypes.map(s => ({value: s.id, label: s.name}))}
                                onFilterChange={(value) => setFilters({filterBatchTypeId: value as number})}
                            />,
                        ]}
                    />
                )
            }}
        />
    );
};

export default BatchesList;