import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IDeliveryNotesStoreState} from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesPanel";
import {deliveryNoteApi, type IDeliveryNotePayload} from "@features/panels/shipping-invoicing/delivery-notes/api/deliveryNoteApi";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import {deliveryReasonApi} from "@features/panels/shipping-invoicing/reasons/api/deliveryReasonApi";
import type {IDeliveryNote} from "@features/panels/shipping-invoicing/delivery-notes/api/IDeliveryNote";
import GenericForm from "@features/panels/shared/GenericForm";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled";
import {Box} from "@mui/material";
import dayjs from "dayjs";
import {useWatch} from "react-hook-form";

import type {IContact} from "@features/panels/contacts/contacts/api/IContact";
import type {IDeliveryReason} from "@features/panels/shipping-invoicing/reasons/api/IDeliveryReason";

export type IDeliveryNoteForm = Omit<IDeliveryNote, 'id' | 'subcontractor' | 'reason' | 'ddt_rows' | 'client'> & {
    subcontractor_id: number | null;
    client_id: number | null;
    reason_id: number | null;
};

const Fields = ({subcontractors, clients, reasons}: {subcontractors: IContact[], clients: IContact[], reasons: IDeliveryReason[]}) => {
    const {t} = useTranslation(["form"]);
    const reasonId = useWatch<IDeliveryNoteForm>({name: 'reason_id'});
    const selectedReason = reasons.find(r => r.id === reasonId);
    const isSale = selectedReason?.name.toLowerCase() === 'vendita';

    const contactLabel = isSale ? t("orders.client") : t("shipping.subcontractor");
    const combinedLabel = `${t("shipping.subcontractor")} / ${t("orders.client")}`;

    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldControlled<IDeliveryNoteForm>
                    name="ddt_number"
                    label={t("shipping.ddt_number")}
                    required
                />
                <DateFieldControlled<IDeliveryNoteForm>
                    name="ddt_date"
                    label={t("shipping.ddt_date")}
                    required
                />
                <DateFieldControlled<IDeliveryNoteForm>
                    name="ddt_start_date"
                    label={t("shipping.ddt_start_date")}
                />
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <SelectFieldControlled<IDeliveryNoteForm>
                    name="reason_id"
                    label={t("shipping.reason")}
                    options={reasons.map(r => ({value: r.id, label: r.name}))}
                    required
                />
                {!reasonId ? (
                    <SelectFieldControlled<IDeliveryNoteForm>
                        name="subcontractor_id"
                        label={combinedLabel}
                        options={[]}
                        deactivated
                    />
                ) : isSale ? (
                    <SelectFieldControlled<IDeliveryNoteForm>
                        name="client_id"
                        label={contactLabel}
                        options={clients.map(c => ({value: c.id, label: c.name}))}
                        required
                    />
                ) : (
                    <SelectFieldControlled<IDeliveryNoteForm>
                        name="subcontractor_id"
                        label={contactLabel}
                        options={subcontractors.map(s => ({value: s.id, label: s.name}))}
                        required
                    />
                )}
            </Box>
        </>
    );
};

const DeliveryNotesForm = () => {
    const {useStore} = usePanel<unknown, IDeliveryNotesStoreState>();
    const selectedDeliveryNoteId = useStore(state => state.uiState.selectedDeliveryNoteId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = deliveryNoteApi;
    const {data: deliveryNote} = useGetDetail(selectedDeliveryNoteId);
    const {mutateAsync: createDeliveryNote, isPending: isPosting} = usePost({invalidateQueries: ['DDT-NOT-RETURNED', 'LIST']});
    const {mutateAsync: updateDeliveryNote, isPending: isPutting} = usePut();
    const {mutateAsync: deleteDeliveryNote, isPending: isDeleting} = useDelete();

    const {data: subcontractors = []} = contactsApi.useGetList({queryParams: {type: 'subcontractor'}});
    const {data: clients = []} = contactsApi.useGetList({queryParams: {type: 'client'}});
    const {data: reasons = []} = deliveryReasonApi.useGetList();

    return (
        <GenericForm<IDeliveryNoteForm, IDeliveryNote, IDeliveryNotesStoreState>
            resource="ddt & fatture - documenti di trasporto"
            selectedId={selectedDeliveryNoteId}
            entity={deliveryNote}
            emptyValues={{
                subcontractor_id: null,
                client_id: null,
                reason_id: null,
                ddt_number: "",
                ddt_date: dayjs().format("YYYY-MM-DD"),
                ddt_start_date: dayjs().format("YYYY-MM-DD"),
            }}
            mapEntityToForm={(x) => ({
                subcontractor_id: x.subcontractor?.id || null,
                client_id: x.client?.id || null,
                reason_id: x.reason?.id || null,
                ddt_number: x.ddt_number,
                ddt_date: x.ddt_date,
                ddt_start_date: x.ddt_start_date,
            })}
            create={(payload) => createDeliveryNote(payload as IDeliveryNotePayload)}
            onCreateSuccess={(id) => {setUIState({selectedDeliveryNoteId: id})}}
            update={(id, payload) => updateDeliveryNote({id, payload: payload as IDeliveryNotePayload})}
            remove={(id) => deleteDeliveryNote(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedDeliveryNoteId: null})}
            validateBeforeSave={(v) => (!!v.subcontractor_id || !!v.client_id) && !!v.reason_id && !!v.ddt_number && !!v.ddt_date}
            renderFields={() => <Fields subcontractors={subcontractors} clients={clients} reasons={reasons} />}
        />
    )
};

export default DeliveryNotesForm;