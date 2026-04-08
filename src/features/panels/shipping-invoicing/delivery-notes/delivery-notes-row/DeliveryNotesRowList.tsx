import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IDeliveryNotesStoreState} from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesPanel";
import {deliveryNoteApi} from "@features/panels/shipping-invoicing/delivery-notes/api/deliveryNoteApi";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IDeliveryNoteRow} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/IDeliveryNoteRow";
import GenericList from "@features/panels/shared/GenericList";
import {MenuItem, Typography} from "@mui/material";
import ListToolbar from "@features/panels/shared/ListToolbar";
import {NewButton} from "@features/panels/shared/CustomButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {useDockviewStore} from "@ui/panel/store/DockviewStore";
import useCallablePanel from "@ui/panel/useCallablePanel";

const DeliveryNotesRowList = () => {
    const {t} = useTranslation(["form"]);
    const addPanel = useDockviewStore(state => state.addPanel);

    const {useStore} = usePanel<unknown, IDeliveryNotesStoreState>();
    const selectedDeliveryNoteId = useStore((state) => state.uiState.selectedDeliveryNoteId);
    const selectedDeliveryNoteRowId = useStore((state) => state.uiState.selectedDeliveryNoteRowId);
    const setUIState = useStore((state) => state.setUIState);

    const {add: addSelectPanel} = useCallablePanel();

    const {data: deliveryNote, isLoading, isFetching} = deliveryNoteApi.useGetDetail(selectedDeliveryNoteId);
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

    const handleOpenCreateRowDialog = () => {
        setUIState({selectedDeliveryNoteRowId: null});
        addSelectPanel({
            initialValue: '',
            extra: {
                ddt_id: selectedDeliveryNoteId,
                panelId: "createDeliveryNotesRows"
            },
            menu: {
                component: "deliveryNotesRows",
                i18nKey: "menu.shipping-invoicing.rows"
            },
            customId: "createDeliveryNotesRows"
        });
    }

    return (
        <GenericList<IDeliveryNoteRow>
            disableBorder
            minHeight={"405px"}
            data={ddtRows}
            columns={columns}
            isLoading={isLoading}
            isFetching={isFetching}
            selectedId={selectedDeliveryNoteRowId}
            onRowSelect={(id) => setUIState({selectedDeliveryNoteRowId: id as number})}
            onRowDoubleClick={() => {
                addSelectPanel({
                    initialValue: '',
                    extra: {
                        ddt_id: selectedDeliveryNoteId,
                        ddt_row_id: selectedDeliveryNoteRowId,
                        panelId: "updateDeliveryNotesRows:" + selectedDeliveryNoteRowId
                    },
                    menu: {
                        component: "deliveryNotesRows",
                        i18nKey: "menu.shipping-invoicing.rows"
                    },
                    customId: "updateDeliveryNotesRows:" + selectedDeliveryNoteRowId
                });
            }}
            additionalOptions={{
                enableRowActions: true,
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
                    </MenuItem>
                ],
                enableTopToolbar: true,
                renderTopToolbar: () => (
                    <ListToolbar
                        buttons={[
                            <NewButton
                                isEnable={!!selectedDeliveryNoteId}
                                onClick={() => handleOpenCreateRowDialog()}
                            />
                        ]}
                        label={<Typography variant={"h6"} >{t("shipping.ddt_rows.row")}</Typography>}
                        sx={{mt: 0}}
                    />
                )
            }}
        />
    );
};

export default DeliveryNotesRowList;