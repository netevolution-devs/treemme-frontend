import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IBatchesStoreFilter, IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import {useMemo} from "react";
import type {MRT_ColumnDef, MRT_TableOptions} from "material-react-table";
import type {IBatch} from "@features/panels/production/batches/api/IBatch";
import GenericList from "@features/panels/shared/GenericList";
import ListToolbar from "@features/panels/shared/ListToolbar";
import TextFieldFilter from "@ui/form/filters/TextFieldFilter";
import {cleanFilters} from "@ui/form/filters/useCleanFilters";
import SelectFieldFilter from "@ui/form/filters/SelectFieldFilter";
import {batchTypeApi} from "@features/panels/production/batches/api/batch-type/batchTypeApi";
import DateFieldFilter from "@ui/form/filters/DateFieldFilter";

interface BatchesListProps {
    disableBorder?: boolean;
    enableFilters?: boolean;
    data?: IBatch[];
    minHeight?: string;
    additionalOptions?: Partial<MRT_TableOptions<IBatch>>;
}

const BatchesList = ({data, enableFilters = true, disableBorder = false, minHeight = "300px", additionalOptions}: BatchesListProps) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<IBatchesStoreFilter, IBatchesStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);
    const setUIState = useStore(state => state.setUIState);

    const filterBatchTypeId = useStore(state => state.filters.filterBatchTypeId);
    const filterBatchCode = useStore(state => state.filters.filterBatchCode);
    const filterYear = useStore(state => state.filters.filterYear);
    const setFilters = useStore(state => state.setFilters);

    const queryParams = useMemo(() => cleanFilters(
        {
            code: filterBatchCode,
            type: filterBatchTypeId as number,
            year: filterYear as number,
        }
    ), [filterBatchCode, filterBatchTypeId, filterYear]);

    const {data: batches = [], isLoading, isFetching} = batchApi.useGetList({queryParams});
    const {data: batchTypes = []} = batchTypeApi.useGetList();

    const batchesFetched = data ? data : batches;

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
            disableBorder={disableBorder}
            data={batchesFetched}
            isLoading={isLoading}
            isFetching={isFetching}
            minHeight={minHeight}
            columns={columns}
            selectedId={selectedBatchId}
            onRowSelect={(id) => setUIState({selectedBatchId: id})}
            additionalOptions={{
                enableTopToolbar: enableFilters,
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
                            <DateFieldFilter
                                key={"f-year"}
                                label={t("production.batch.year")}
                                value={filterYear as number}
                                type={"year"}
                                onFilterChange={(value) => setFilters({filterYear: value as number})}
                            />,
                        ]}
                    />
                ),
                ...additionalOptions
            }}
        />
    );
};

export default BatchesList;