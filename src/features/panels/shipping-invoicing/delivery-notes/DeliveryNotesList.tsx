import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {
    IDeliveryNotesStoreFilter,
    IDeliveryNotesStoreState
} from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesPanel.tsx";
import {deliveryNoteApi} from "@features/panels/shipping-invoicing/delivery-notes/api/deliveryNoteApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IDeliveryNote} from "@features/panels/shipping-invoicing/delivery-notes/api/IDeliveryNote.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import SelectFieldFilter from "@ui/form/filters/SelectFieldFilter.tsx";
import {cleanFilters} from "@ui/form/filters/useCleanFilters.ts";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";

const DeliveryNotesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<IDeliveryNotesStoreFilter, IDeliveryNotesStoreState>();
    const selectedDeliveryNoteId = useStore((state) => state.uiState.selectedDeliveryNoteId);
    const setUIState = useStore((state) => state.setUIState);
    const setFilters = useStore((state) => state.setFilters);
    const filterSubcontractorId = useStore((state) => state.filters.filterSubcontractorId);

    const queryParams = useMemo(() => cleanFilters(
        {
            subcontractor_id: filterSubcontractorId,
        }
    ) as Record<string, string | number>, [filterSubcontractorId]);

    const {data: deliveryNotes = [], isLoading} = deliveryNoteApi.useGetList({queryParams});
    const {data: subcontractors = []} = contactsApi.useGetList({queryParams: {type: "subcontractor"}});

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
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar: () => (
                    <ListToolbar
                        filters={[
                            <SelectFieldFilter
                                key={"f-subcontractor"}
                                label={t("shipping.subcontractor")}
                                value={filterSubcontractorId}
                                options={subcontractors.map(s => ({value: s.id, label: s.name}))}
                                onFilterChange={(value) => setFilters({filterSubcontractorId: value as number})}
                            />
                        ]}
                    />
                )
            }}
        />
    )
}

export default DeliveryNotesList;