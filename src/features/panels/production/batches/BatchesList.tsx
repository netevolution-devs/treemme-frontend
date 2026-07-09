import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IBatchesStoreFilter, IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import {useEffect, useMemo} from "react";
import type {MRT_ColumnDef, MRT_TableOptions} from "material-react-table";
import type {IBatch} from "@features/panels/production/batches/api/IBatch";
import GenericList from "@features/panels/shared/GenericList";
import ListToolbar from "@features/panels/shared/ListToolbar";
import TextFieldFilter from "@ui/form/filters/TextFieldFilter";
import {cleanFilters} from "@ui/form/filters/useCleanFilters";
import SelectFieldFilter from "@ui/form/filters/SelectFieldFilter";
import {batchTypeApi} from "@features/panels/production/batches/api/batch-type/batchTypeApi";
import DateFieldFilter from "@ui/form/filters/DateFieldFilter";
import {originApi} from "@features/panels/leathers/origins/api/originApi";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import {selectionApi} from "@features/panels/products/selection/api/selectionApi";
import {thicknessApi} from "@features/panels/leathers/thicknesses/api/thicknessApi";

interface BatchesListProps {
    disableBorder?: boolean;
    enableFilters?: boolean;
    data?: IBatch[];
    minHeight?: string;
    additionalOptions?: Partial<MRT_TableOptions<IBatch>>;
    preselectedBatchTypeId?: number;
    disableExtraFilters?: boolean;
}

const BatchesList = ({data, enableFilters = true, disableBorder = false, minHeight = "300px", additionalOptions, preselectedBatchTypeId, disableExtraFilters = false}: BatchesListProps) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<IBatchesStoreFilter, IBatchesStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);
    const setUIState = useStore(state => state.setUIState);

    const filterBatchTypeId = useStore(state => state.filters.filterBatchTypeId);
    const filterBatchCode = useStore(state => state.filters.filterBatchCode);
    const filterYear = useStore(state => state.filters.filterYear);
    const filterProvenanceId = useStore(state => state.filters.filterProvenanceId);
    const filterSupplierId = useStore(state => state.filters.filterSupplierId);
    const filterSelectionId = useStore(state => state.filters.filterSelectionId);
    const filterThicknessId = useStore(state => state.filters.filterThicknessId);
    const setFilters = useStore(state => state.setFilters);


    const queryParams = useMemo(() => cleanFilters(
        {
            code: filterBatchCode,
            type: filterBatchTypeId as number,
            year: filterYear as number,
            provenance_id: filterProvenanceId as number,
            supplier_id: filterSupplierId as number,
            selection_id: filterSelectionId as number,
            thickness_id: filterThicknessId as number,
        }
    ), [filterBatchCode, filterBatchTypeId, filterYear, filterProvenanceId, filterSupplierId, filterSelectionId, filterThicknessId]);

    const {data: batches = [], isLoading, isFetching} = batchApi.useGetList({queryParams});
    const {data: batchTypes = []} = batchTypeApi.useGetList();
    const {data: origins = []} = originApi.useGetList();
    const {data: suppliers = []} = contactsApi.useGetList({queryParams: {type: "supplier"}});
    const {data: selections = []} = selectionApi.useGetList();
    const {data: thicknesses = []} = thicknessApi.useGetList();

    const batchesFetched = data ? data : batches;

    useEffect(() => {
        if (preselectedBatchTypeId) {
            setFilters({filterBatchTypeId: preselectedBatchTypeId});
        }
    }, [preselectedBatchTypeId])

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
                            <>
                                {!disableExtraFilters && (
                                    <SelectFieldFilter
                                        key={"f-provenance"}
                                        label={t("production.batch.provenance")}
                                        value={filterProvenanceId}
                                        options={origins.map(s => ({value: s.id, label: `${s?.area?.name || ""} - ${s?.nation.name  || ""}`}))}
                                        onFilterChange={(value) => setFilters({filterProvenanceId: value as number})}
                                    />
                                )}
                            </>,
                            <>
                                {!disableExtraFilters && (
                                    <SelectFieldFilter
                                        key={"f-supplier"}
                                        label={t("production.batch.supplier")}
                                        value={filterSupplierId}
                                        options={suppliers.map(s => ({value: s.id, label: s.name}))}
                                        onFilterChange={(value) => setFilters({filterSupplierId: value as number})}
                                    />
                                )}
                            </>,
                            <>
                                {!disableExtraFilters && (
                                    <SelectFieldFilter
                                        key={"f-selection"}
                                        label={t("production.batch.selection")}
                                        value={filterSelectionId}
                                        options={selections.map(s => ({value: s.id, label: s.name}))}
                                        onFilterChange={(value) => setFilters({filterSelectionId: value as number})}
                                    />
                                )}
                            </>,
                            <>
                                {!disableExtraFilters && (
                                    <SelectFieldFilter
                                        key={"f-thickness"}
                                        label={t("production.batch.thickness")}
                                        value={filterThicknessId}
                                        options={thicknesses.map(s => ({value: s.id, label: s.name}))}
                                        onFilterChange={(value) => setFilters({filterThicknessId: value as number})}
                                    />
                                )}
                            </>,
                        ]}
                    />
                ),
                ...additionalOptions
            }}
        />
    );
};

export default BatchesList;