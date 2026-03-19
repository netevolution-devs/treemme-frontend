import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IDeliveryNotesStoreState} from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesPanel.tsx";
import {deliveryNoteApi} from "@features/panels/shipping-invoicing/delivery-notes/api/deliveryNoteApi.ts";
import {useMemo, useRef} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IDeliveryNoteRow} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/IDeliveryNoteRow.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import {Typography} from "@mui/material";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import {openDialog} from "@ui/dialog/dialogHelper.ts";
import DeliveryNotesRowsFormDialog
    from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/DeliveryNotesRowsFormDialog.tsx";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import {NewButton} from "@features/panels/shared/CustomButton.tsx";

const DeliveryNotesRowList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IDeliveryNotesStoreState>();
    const selectedDeliveryNoteId = useStore((state) => state.uiState.selectedDeliveryNoteId);
    const selectedDeliveryNoteRowId = useStore((state) => state.uiState.selectedDeliveryNoteRowId);
    const setUIState = useStore((state) => state.setUIState);

    const {data: deliveryNote, isLoading} = deliveryNoteApi.useGetDetail(selectedDeliveryNoteId);
    const ddtRows = deliveryNote?.ddt_rows || [];

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

    const handleOpenCreateRowDialog = () => {
        setUIState({selectedDeliveryNoteRowId: null});
        openDialog(editRowDialogRef);
    }

    return (
        <>
            <DeliveryNotesRowsFormDialog ref={editRowDialogRef}/>

            <GenericList<IDeliveryNoteRow>
                data={ddtRows}
                columns={columns}
                isLoading={isLoading}
                selectedId={selectedDeliveryNoteRowId}
                onRowSelect={(id) => setUIState({selectedDeliveryNoteRowId: id as number})}
                onRowDoubleClick={() => openDialog(editRowDialogRef)}
                additionalOptions={{
                    enableTopToolbar: true,
                    renderTopToolbar:
                        <ListToolbar
                            buttons={[
                                <NewButton
                                    isEnable={!!selectedDeliveryNoteId}
                                    onClick={() => handleOpenCreateRowDialog()}
                                />
                            ]}
                            label={<Typography variant={"h5"} >{t("shipping.ddt_rows.row")}</Typography>}
                            sx={{mt: 0}}
                        />
                }}
            />
        </>
    )
};

export default DeliveryNotesRowList;