import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import {useMemo, useRef} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import {openDialog} from "@ui/dialog/dialogHelper";
import useGetDDTNotReturned
    , {
    type IDDTRowNotReturned
} from "@features/panels/shipping-invoicing/subcontracting-not-returned/api/useGetDDTNotReturned";
import useGetDDTNotReturnedPrint
    from "@features/panels/shipping-invoicing/subcontracting-not-returned/api/useGetDDTNotReturnedPrint";
import useGetMassiveReturn
    from "@features/panels/shipping-invoicing/subcontracting-not-returned/api/useGetMassiveReturn";
import type {
    ISubcontractingNotReturnedStoreFilter,
    ISubcontractingNotReturnedStoreState
} from "@features/panels/shipping-invoicing/subcontracting-not-returned/SubcontractingNotReturnedPanel";
import {MenuItem} from "@mui/material";
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import ChecklistIcon from '@mui/icons-material/Checklist';
import DDTReturnFormDialog
    from "@features/panels/shipping-invoicing/subcontracting-not-returned/return/DDTReturnFormDialog";
import DDTTransferFormDialog
    from "@features/panels/shipping-invoicing/subcontracting-not-returned/transfer/DDTTransferFormDialog";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {useDockviewStore} from "@ui/panel/store/DockviewStore";
import ListToolbar from "@features/panels/shared/ListToolbar";
import CustomButton, {PrintButton} from "@features/panels/shared/CustomButton";
import {cleanFilters} from "@ui/form/filters/useCleanFilters";
import DateFieldRangeFilter from "@ui/form/filters/DateFieldRangeFilter";
import SelectFieldFilter from "@ui/form/filters/SelectFieldFilter";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import {useState} from "react";
import type {MRT_RowSelectionState} from "material-react-table";

const SubcontractingNotReturnedList = () => {
    const {t} = useTranslation(["form"]);
    const addPanel = useDockviewStore(state => state.addPanel);

    const {useStore} = usePanel<ISubcontractingNotReturnedStoreFilter, ISubcontractingNotReturnedStoreState>();
    const selectedSubcontractingNotReturnedId = useStore((state) => state.uiState.selectedSubcontractingNotReturnedId);
    const setUIState = useStore((state) => state.setUIState);

    const filterStartDate = useStore(state => state.filters.filterStartDate)
    const filterEndDate = useStore(state => state.filters.filterEndDate)
    const filterSubcontractorId = useStore(state => state.filters.filterSubcontractorId)
    const setFilters = useStore(state => state.setFilters)

    const queryParams = useMemo(() => cleanFilters(
        {
            start_date: filterStartDate,
            end_date: filterEndDate,
            subcontractor_id: filterSubcontractorId,
        }
    ), [filterStartDate, filterEndDate, filterSubcontractorId])

    const {data: ddtRowsNotReturned = [], isLoading, isFetching} = useGetDDTNotReturned({queryParams});
    const {mutateAsync: getDdtNotReturnedPdf, isPending} = useGetDDTNotReturnedPrint();
    const {mutateAsync: massiveReturn, isPending: isMassiveReturnPending} = useGetMassiveReturn();

    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
    const [multiSelectionEnabled, setMultiSelectionEnabled] = useState(false);

    const {data: subcontractors = []} = contactsApi.useGetList({queryParams: {type: "subcontractor"}});

    const columns = useMemo<MRT_ColumnDef<IDDTRowNotReturned>[]>(() => [
        {
            accessorKey: "batch.batch_code",
            header: t("production.batch.batch_code"),
        },
        {
            accessorKey: "stock_pieces",
            header: t("production.batch.selections.external-pieces"),
        },
        {
            accessorKey: "ddt.ddt_number",
            header: t("production.ddt.ddt_number"),
        },
        {
            accessorKey: "ddt.subcontractor.name",
            header: t("production.ddt.subcontractor_name")
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

    const ddtReturnDialogRef = useRef<IDialogActions | null>(null);
    const ddtTransferDialogRef = useRef<IDialogActions | null>(null);

    const canPrint = ddtRowsNotReturned.length > 0;

    return (
        <>
            <DDTReturnFormDialog ref={ddtReturnDialogRef} />
            <DDTTransferFormDialog ref={ddtTransferDialogRef} />

            <GenericList<IDDTRowNotReturned>
                minHeight={"835px"}
                data={ddtRowsNotReturned}
                columns={columns}
                isLoading={isLoading}
                isFetching={isFetching}
                selectedId={multiSelectionEnabled ? null : selectedSubcontractingNotReturnedId}
                onRowSelect={(id) => {
                    if (!multiSelectionEnabled && id !== undefined) {
                        setUIState({selectedSubcontractingNotReturnedId: id as number});
                    }
                }}
                additionalOptions={{
                    enableTopToolbar: true,
                    renderTopToolbar: () => (
                        <ListToolbar
                            alignButtons={"flex-end"}
                            sx={{mr: 1}}
                            filters={[
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
                                <CustomButton
                                    key={"b-multi-selection"}
                                    variant={"outlined"}
                                    color={multiSelectionEnabled ? "warning" : "primary"}
                                    icon={<ChecklistIcon/>}
                                    onClick={() => {
                                        setMultiSelectionEnabled(prev => !prev);
                                        setRowSelection({});
                                    }}
                                    label={multiSelectionEnabled ? "common:button.cancel" : "form:shipping.ddt_rows.massive_return"}
                                />,
                                multiSelectionEnabled && (
                                    <CustomButton
                                        key={"b-massive-return"}
                                        variant={"outlined"}
                                        color={"success"}
                                        isEnable={Object.keys(rowSelection).length > 0 && !isMassiveReturnPending}
                                        isLoading={isMassiveReturnPending}
                                        icon={<AssignmentReturnIcon/>}
                                        onClick={async () => {
                                            const selectedIds = Object.keys(rowSelection).map(Number);
                                            if (selectedIds.length > 0) {
                                                await massiveReturn({
                                                    rows: selectedIds.map(id => ({id}))
                                                });
                                                setRowSelection({});
                                                setMultiSelectionEnabled(false);
                                            }
                                        }}
                                        label={"form:shipping.ddt_rows.confirm_return"}
                                    />
                                ),
                                <PrintButton
                                    key={"b-print"}
                                    canPrint={canPrint}
                                    isPending={isPending}
                                    onClick={() => getDdtNotReturnedPdf({
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
                    enableRowActions: true,
                    enableRowSelection: multiSelectionEnabled,
                    onRowSelectionChange: setRowSelection,
                    state: {
                        rowSelection,
                    },
                    getRowId: (row) => row.id?.toString(),
                    renderRowActionMenuItems: ({row, closeMenu}) => [
                        <MenuItem key={"view_batch"} onClick={() => {
                            addPanel({
                                id: `batches:${crypto.randomUUID()}`,
                                title: t("menu:menu.production.batches"),
                                component: 'batches',
                                params: {
                                    extra: {
                                        id: row.original.batch.id,
                                        batch_code: row.original.batch.batch_code
                                    }
                                }
                            });
                            closeMenu();
                        }}>
                            <VisibilityIcon color={"primary"} sx={{mr: 1}} />
                            {t("processes.view_batch")}
                        </MenuItem>,
                        <MenuItem key="m-return" onClick={() => {
                            setUIState({selectedSubcontractingNotReturnedId: row.original.id})
                            openDialog(ddtReturnDialogRef)
                            closeMenu()
                        }}>
                            <AssignmentReturnIcon color={"primary"} sx={{mr: 1}}/>
                            {t("form:shipping.ddt_rows.return")}
                        </MenuItem>,
                        <MenuItem key="m-transfer" onClick={() => {
                            setUIState({selectedSubcontractingNotReturnedId: row.original.id})
                            openDialog(ddtTransferDialogRef)
                            closeMenu()
                        }}>
                            <MoveDownIcon color={"warning"} sx={{mr: 1}}/>
                            {t("form:shipping.ddt_rows.transfer")}
                        </MenuItem>
                    ],
                }}
            />
        </>
    )
};

export default SubcontractingNotReturnedList;