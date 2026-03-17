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
import usePostSubcontractingReturn
    from "@features/panels/shipping-invoicing/subcontracting-not-returned/api/usePostSubcontractingReturn.ts";
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';

const SubcontractingNotReturnedList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ISubcontractingNotReturnedStoreState>();
    const selectedSubcontractingNotReturnedId = useStore((state) => state.uiState.selectedSubcontractingNotReturnedId);
    const setUIState = useStore((state) => state.setUIState);

    const {data: ddtRowsNotReturned = [], isLoading} = useGetDDTNotReturned();
    const {mutateAsync: returnSubcontract} = usePostSubcontractingReturn();

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

    return (
        <GenericList<IDeliveryNoteRow>
            data={ddtRowsNotReturned}
            columns={columns}
            isLoading={isLoading}
            selectedId={selectedSubcontractingNotReturnedId}
            onRowSelect={(id) => setUIState({selectedSubcontractingNotReturnedId: id as number})}
            onRowDoubleClick={() => openDialog(editRowDialogRef)}
            additionalOptions={{
                enableRowActions: true,
                renderRowActionMenuItems: ({row}) => [
                    <MenuItem key="dye" onClick={async () => {
                        setUIState({selectedSubcontractingNotReturnedId: row.original.id})
                        await returnSubcontract({ddtRowId: row.original.id});
                    }}>
                        <AssignmentReturnIcon color={"primary"} sx={{mr: 1}} />
                        {t("shipping.ddt_rows.return")}
                    </MenuItem>,
                ],
            }}
        />
    )
};

export default SubcontractingNotReturnedList;