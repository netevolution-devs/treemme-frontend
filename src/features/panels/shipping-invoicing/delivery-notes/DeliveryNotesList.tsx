import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IDeliveryNotesStoreState} from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesPanel.tsx";
import {deliveryNoteApi} from "@features/panels/shipping-invoicing/delivery-notes/api/deliveryNoteApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IDeliveryNote} from "@features/panels/shipping-invoicing/delivery-notes/api/IDeliveryNote.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";

const DeliveryNotesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IDeliveryNotesStoreState>();
    const selectedDeliveryNoteId = useStore((state) => state.uiState.selectedDeliveryNoteId);
    const setUIState = useStore((state) => state.setUIState);

    const {data: deliveryNotes = [], isLoading} = deliveryNoteApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IDeliveryNote>[]>(() => [
        {
            accessorKey: "ddt_number",
            header: t("shipping.ddt_number"),
        },
        {
            accessorKey: "reason.name",
            header: t("shipping.reason"),
        }
    ], [t]);

    return (
        <GenericList<IDeliveryNote>
            data={deliveryNotes}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedDeliveryNoteId}
            onRowSelect={(id) => setUIState({selectedDeliveryNoteId: id})}
        />
    )
}

export default DeliveryNotesList;