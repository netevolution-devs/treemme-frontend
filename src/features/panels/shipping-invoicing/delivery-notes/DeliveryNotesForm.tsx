import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IDeliveryNotesStoreState} from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesPanel.tsx";
import {deliveryNoteApi, type IDeliveryNotePayload} from "@features/panels/shipping-invoicing/delivery-notes/api/deliveryNoteApi.ts";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import {deliveryReasonApi} from "@features/panels/shipping-invoicing/reasons/api/deliveryReasonApi.ts";
import type {IDeliveryNote} from "@features/panels/shipping-invoicing/delivery-notes/api/IDeliveryNote.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled.tsx";
import {Box} from "@mui/material";
import dayjs from "dayjs";

export type IDeliveryNoteForm = Omit<IDeliveryNote, 'id' | 'subcontractor' | 'reason'> & {
    subcontractor_id: number;
    reason_id: number;
};

const DeliveryNotesForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IDeliveryNotesStoreState>();
    const selectedDeliveryNoteId = useStore(state => state.uiState.selectedDeliveryNoteId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = deliveryNoteApi;
    const {data: deliveryNote} = useGetDetail(selectedDeliveryNoteId);
    const {mutateAsync: createDeliveryNote, isPending: isPosting} = usePost();
    const {mutateAsync: updateDeliveryNote, isPending: isPutting} = usePut();
    const {mutateAsync: deleteDeliveryNote, isPending: isDeleting} = useDelete();

    const {data: subcontractors = []} = contactsApi.useGetList({queryParams: {type: 'subcontractor'}});
    const {data: reasons = []} = deliveryReasonApi.useGetList();

    return (
        <GenericForm<IDeliveryNoteForm, IDeliveryNote, IDeliveryNotesStoreState>
            selectedId={selectedDeliveryNoteId}
            entity={deliveryNote}
            emptyValues={{
                subcontractor_id: 0,
                reason_id: 0,
                ddt_number: "",
                ddt_date: dayjs().format("YYYY-MM-DD"),
                ddt_start_date: dayjs().format("YYYY-MM-DD"),
            }}
            mapEntityToForm={(x) => ({
                subcontractor_id: x.subcontractor?.id || 0,
                reason_id: x.reason?.id || 0,
                ddt_number: x.ddt_number,
                ddt_date: x.ddt_date,
                ddt_start_date: x.ddt_start_date,
            })}
            create={(payload) => createDeliveryNote(payload as IDeliveryNotePayload)}
            update={(id, payload) => updateDeliveryNote({id, payload: payload as IDeliveryNotePayload})}
            remove={(id) => deleteDeliveryNote(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedDeliveryNoteId: null})}
            validateBeforeSave={(v) => !!v.subcontractor_id && !!v.reason_id && !!v.ddt_number && !!v.ddt_date}
            renderFields={() => (
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
                            name="subcontractor_id"
                            label={t("shipping.subcontractor")}
                            options={subcontractors.map(s => ({value: s.id, label: s.name}))}
                            required
                        />
                        <SelectFieldControlled<IDeliveryNoteForm>
                            name="reason_id"
                            label={t("shipping.reason")}
                            options={reasons.map(r => ({value: r.id, label: r.name}))}
                            required
                        />
                    </Box>
                </>
            )}
        />
    )
};

export default DeliveryNotesForm;