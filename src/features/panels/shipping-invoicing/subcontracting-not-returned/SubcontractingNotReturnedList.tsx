import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {useMemo, useRef} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {
    IDeliveryNoteRow
} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/IDeliveryNoteRow.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import {openDialog} from "@ui/dialog/dialogHelper.ts";
import useGetDDTNotReturned
    from "@features/panels/shipping-invoicing/subcontracting-not-returned/api/useGetDDTNotReturned.ts";
import type {
    ISubcontractingNotReturnedStoreState
} from "@features/panels/shipping-invoicing/subcontracting-not-returned/SubcontractingNotReturnedPanel.tsx";
import {MenuItem} from "@mui/material";
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import DDTReturnFormDialog
    from "@features/panels/shipping-invoicing/subcontracting-not-returned/return/DDTReturnFormDialog.tsx";
import DDTTransferFormDialog
    from "@features/panels/shipping-invoicing/subcontracting-not-returned/transfer/DDTTransferFormDialog.tsx";

const SubcontractingNotReturnedList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ISubcontractingNotReturnedStoreState>();
    const selectedSubcontractingNotReturnedId = useStore((state) => state.uiState.selectedSubcontractingNotReturnedId);
    const setUIState = useStore((state) => state.setUIState);

    const {data: ddtRowsNotReturned = [], isLoading, isFetching} = useGetDDTNotReturned();
    // const {mutateAsync: returnSubcontract, isPending} = usePostSubcontractingReturn();

    const columns = useMemo<MRT_ColumnDef<IDeliveryNoteRow>[]>(() => [
        {
            accessorKey: "batch.batch_code",
            header: t("production.batch.batch_code"),
        },
        {
            accessorKey: "pieces",
            header: t("production.batch.selections.pieces"),
        },
        {
            accessorKey: "quantity",
            header: t("orders.row.quantity"),
        },
        {
            accessorKey: "measurement_unit.name",
            header: t("orders.row.measurement_unit"),
        }
    ], [t]);

    const editRowDialogRef = useRef<IDialogActions | null>(null);

    const ddtReturnDialogRef = useRef<IDialogActions | null>(null);
    const ddtTransferDialogRef = useRef<IDialogActions | null>(null);

    return (
        <>
            <DDTReturnFormDialog ref={ddtReturnDialogRef} />
            <DDTTransferFormDialog ref={ddtTransferDialogRef} />

            <GenericList<IDeliveryNoteRow>
                minHeight={"800px"}
                data={ddtRowsNotReturned}
                columns={columns}
                isLoading={isLoading}
                isFetching={isFetching}
                selectedId={selectedSubcontractingNotReturnedId}
                onRowSelect={(id) => setUIState({selectedSubcontractingNotReturnedId: id as number})}
                onRowDoubleClick={() => openDialog(editRowDialogRef)}
                additionalOptions={{
                    enableRowActions: true,
                    renderRowActionMenuItems: ({row}) => [
                        <MenuItem key="m-return" onClick={() => {
                            setUIState({selectedSubcontractingNotReturnedId: row.original.id})
                            openDialog(ddtReturnDialogRef)
                        }}>
                            <AssignmentReturnIcon color={"primary"} sx={{mr: 1}}/>
                            {t("shipping.ddt_rows.return")}
                        </MenuItem>,
                        <MenuItem key="m-transfer" onClick={() => {
                            setUIState({selectedSubcontractingNotReturnedId: row.original.id})
                            openDialog(ddtTransferDialogRef)
                        }}>
                            <MoveDownIcon color={"warning"} sx={{mr: 1}}/>
                            {t("shipping.ddt_rows.transfer")}
                        </MenuItem>
                    ],
                }}
            />
        </>
    )
};

export default SubcontractingNotReturnedList;