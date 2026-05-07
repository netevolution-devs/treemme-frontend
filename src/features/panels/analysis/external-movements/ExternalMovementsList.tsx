import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList";
import useGetExternalProcessingMovements, {
    type IFlatExternalProcessingMovement
} from "@features/panels/analysis/external-movements/api/useGetExternalProcessingMovements";
import type {
    IExternalMovementsStoreFilter,
    IExternalMovementsStoreState
} from "@features/panels/analysis/external-movements/ExternalMovementsPanel";
import ListToolbar from "@features/panels/shared/ListToolbar";
import {cleanFilters} from "@ui/form/filters/useCleanFilters";
import DateFieldRangeFilter from "@ui/form/filters/DateFieldRangeFilter";
import SelectFieldFilter from "@ui/form/filters/SelectFieldFilter";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import dayjs from "dayjs";
import useGetExternalProcessingReturnsPrint
    from "@features/panels/analysis/external-movements/api/useGetExternalProcessingReturnsPrint";
import {PrintButton} from "@features/panels/shared/CustomButton";
import TextFieldFilter from "@ui/form/filters/TextFieldFilter";

const ExternalMovementsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<IExternalMovementsStoreFilter, IExternalMovementsStoreState>();
    const setUIState = useStore((state) => state.setUIState);

    const filterStartDate = useStore(state => state.filters.filterStartDate)
    const filterEndDate = useStore(state => state.filters.filterEndDate)
    const filterSubcontractorId = useStore(state => state.filters.filterSubcontractorId)
    const filterBatchCode = useStore(state => state.filters.filterBatchCode)
    const setFilters = useStore(state => state.setFilters)

    const queryParams = useMemo(() => cleanFilters(
        {
            start_date: filterStartDate,
            end_date: filterEndDate,
            subcontractor_id: filterSubcontractorId,
            batch_code: filterBatchCode,
        }
    ), [filterStartDate, filterEndDate, filterSubcontractorId, filterBatchCode])

    const {data: movements = [], isLoading, isFetching} = useGetExternalProcessingMovements({queryParams});
    const {data: subcontractors = []} = contactsApi.useGetList({queryParams: {type: "subcontractor"}});
    const {mutateAsync: getReturnsPdf, isPending} = useGetExternalProcessingReturnsPrint();

    const canPrint = movements.length > 0;

    const columns = useMemo<MRT_ColumnDef<IFlatExternalProcessingMovement>[]>(() => [
        {
            accessorKey: "ddt.ddt_date",
            header: t("shipping.ddt_date"),
            Cell: ({row}) => row.original.ddt?.ddt_date ? dayjs(row.original.ddt.ddt_date).format("DD/MM/YYYY") : ""
        },
        {
            accessorKey: "ddt.ddt_number",
            header: t("production.ddt.ddt_number"),
        },
        {
            accessorKey: "subcontractor.name",
            header: t("production.ddt.subcontractor_name")
        },
        {
            accessorKey: "batch.batch_code",
            header: t("production.batch.batch_code"),
        },
        {
            accessorKey: "ddt_row_processings",
            header: t("production.batch.selections.processings"),
            Cell: ({row}) => row.original.ddt_row_processings?.map(p => p.processing.name).join(", ") || ""
        },
        {
            accessorKey: "pieces",
            header: t("shipping.pieces"),
        },
        {
            accessorKey: "quantity",
            header: t("shipping.quantity"),
        },
        {
            accessorKey: "measurement_unit.prefix",
            header: t("shipping.um"),
        }
    ], [t]);

    return (
        <GenericList<IFlatExternalProcessingMovement>
            minHeight={"835px"}
            data={movements}
            columns={columns}
            isLoading={isLoading}
            isFetching={isFetching}
            selectedId={useStore((state) => state.uiState.selectedExternalMovementId)}
            onRowSelect={(id) => setUIState({selectedExternalMovementId: id as number})}
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar: () => (
                    <ListToolbar
                        alignButtons={"flex-end"}
                        sx={{mr: 1}}
                        filters={[
                            <TextFieldFilter
                                key={"f-batch_code"}
                                label={t("production.batch.batch_code")}
                                value={filterBatchCode}
                                onFilterChange={(val) => setFilters({filterBatchCode: val as string})}
                            />,
                            <DateFieldRangeFilter
                                key={"f-date-range"}
                                startValue={filterStartDate}
                                endValue={filterEndDate}
                                onStartFilterChange={(value) => setFilters({filterStartDate: value as string})}
                                onEndFilterChange={(value) => setFilters({filterEndDate: value as string})}
                                startLabel={t("shipping.date_start")}
                                endLabel={t("shipping.date_end")}
                            />,
                            <SelectFieldFilter
                                key={"f-subcontractor"}
                                label={t("production.ddt.subcontractor_name")}
                                value={filterSubcontractorId}
                                options={subcontractors.map(s => ({value: s.id, label: s.name}))}
                                onFilterChange={(value) => setFilters({filterSubcontractorId: value as number})}
                            />,
                        ]}
                        buttons={[
                            <PrintButton
                                key={"print-returns"}
                                canPrint={canPrint}
                                isPending={isPending}
                                onClick={() => getReturnsPdf({
                                    params: {
                                        start_date: queryParams.start_date as string,
                                        end_date: queryParams.end_date as string,
                                        subcontractor_id: queryParams.subcontractor_id as number
                                    }
                                })}
                            />
                        ]}
                    />
                ),
            }}
        />
    )
};

export default ExternalMovementsList;