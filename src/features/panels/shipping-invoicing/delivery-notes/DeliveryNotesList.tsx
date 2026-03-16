import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IDeliveryNotesStoreState} from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesPanel.tsx";
import {deliveryNoteApi} from "@features/panels/shipping-invoicing/delivery-notes/api/deliveryNoteApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IDeliveryNote} from "@features/panels/shipping-invoicing/delivery-notes/api/IDeliveryNote.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import useGetDDTNotReturned
    from "@features/panels/shipping-invoicing/subcontracting-not-returned/api/useGetDDTNotReturned.ts";

interface DeliveryNoteListProps {
    showNotReturned?: boolean;
}

const DeliveryNotesList = ({showNotReturned = false}: DeliveryNoteListProps) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IDeliveryNotesStoreState>();
    const selectedDeliveryNoteId = useStore((state) => state.uiState.selectedDeliveryNoteId);
    const setUIState = useStore((state) => state.setUIState);

    const {data: deliveryNotes = [], isLoading} = deliveryNoteApi.useGetList();
    const {data: deliveryNotesNotReturned = [], isLoading: isLoadingNotReturned} = useGetDDTNotReturned({enabled: showNotReturned});

    const data = showNotReturned ? deliveryNotesNotReturned : deliveryNotes;

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
            data={data}
            isLoading={isLoading || isLoadingNotReturned}
            columns={columns}
            selectedId={selectedDeliveryNoteId}
            onRowSelect={(id) => setUIState({selectedDeliveryNoteId: id})}
        />
    )
}

export default DeliveryNotesList;