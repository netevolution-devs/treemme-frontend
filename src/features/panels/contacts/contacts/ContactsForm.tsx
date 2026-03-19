import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreParams, IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import {contactsTitleApi} from "@features/panels/contacts/contacts/api/contacts-title/contactsTitleApi.ts";
import RadioFieldControlled from "@ui/form/controlled/RadioFieldControlled.tsx";
import {contactsTypeApi} from "@features/panels/contacts/contacts/api/contacts-type/contactsTypeApi.ts";
import {Box, Typography} from "@mui/material";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled.tsx";
import {useWatch} from "react-hook-form";
import type {IContactType} from "@features/panels/contacts/contacts/api/contacts-type/IContactType.ts";
import type {IContactTitle} from "@features/panels/contacts/contacts/api/contacts-title/IContactTitle.ts";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst.ts";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin.ts";

export type IContactForm = Omit<IContact, 'id'
    | 'contact_title'
    | 'contact_type'
    | 'contact_addresses'
    | 'contact_details'
    | 'contact_agents'
    | 'contact_subcontractors'
    | 'specific_order_reference'
    | 'agent_percentage'
    | 'tolerance_quantity'
    | 'tolerance_start_days'
> & {
    contact_title_id: number | null;
    contact_type_id: number | null;
    tolerance_quantity: number | null;
    tolerance_start_days: number | null;
    agent_percentage: number | null;
};

const ContactsForm = ({initialName, onSuccess, extra}: ICustomPanelFormProps<IContactsStoreParams>) => {
    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const setUIState = useStore(state => state.setUIState);

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedContactId,
        onSuccess,
        setFormState
    });

    const isFormDisabled = useStore(state => state.uiState.isFormDisabled);

    const {useGetDetail, usePost, usePut, useDelete} = contactsApi;
    const {data: contact} = useGetDetail(selectedContactId);
    const {mutateAsync: createContact, isPending: isPosting} = usePost();
    const {mutateAsync: updateContact, isPending: isPutting} = usePut();
    const {mutateAsync: deleteContact, isPending: isDeleting} = useDelete();

    const {useGetList: useGetContactTitles} = contactsTitleApi;
    const {data: contactTitles} = useGetContactTitles();

    const {useGetList: useGetContactTypes} = contactsTypeApi;
    const {data: contactTypes} = useGetContactTypes();

    return (
        <GenericForm<IContactForm, IContact, IContactsStoreState>
            onSuccess={handlePanelSuccess}
            selectedId={selectedContactId}
            entity={contact}
            emptyValues={{
                name: initialName ?? '',
                contact_note: '',
                contact_title_id: null,
                contact_type_id: null,
                client: false,
                supplier: extra?.supplier ?? false,
                agent: false,
                subcontractor: false,
                client_note: '',
                client_shipment_note: '',
                tolerance_quantity: null,
                tolerance_start_days: null,
                agent_percentage: null
            }}
            mapEntityToForm={(x) => ({
                name: x.name,
                contact_note: x.contact_note,
                contact_title_id: x.contact_title?.id || null,
                contact_type_id: x.contact_type?.id || null,
                client: x.client,
                supplier: x.supplier,
                agent: x.agent,
                subcontractor: x.subcontractor,
                client_note: x.client_note ?? '',
                client_shipment_note: x.client_shipment_note ?? '',
                tolerance_quantity: x.tolerance_quantity,
                tolerance_start_days: x.tolerance_start_days,
                agent_percentage: x.agent_percentage,
            })}
            create={(payload) => createContact(payload)}
            update={(id, payload) => updateContact({id, payload})}
            remove={(id) => deleteContact(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({
                selectedContactId: null,
                selectedAddressId: null,
                selectedDetailId: null
            })}
            validateBeforeSave={(v) => !!v.name && !!v.contact_title_id && !!v.contact_type_id}
            renderFields={() => <ContactsFormFields isFormDisabled={isFormDisabled} contactTypes={contactTypes} contactTitles={contactTitles}/>}
        />
    );
};

interface ContactsFormFieldsProps {
    isFormDisabled: boolean;
    contactTypes: IContactType[] | undefined;
    contactTitles: IContactTitle[] | undefined;
}

const ContactsFormFields = ({isFormDisabled, contactTypes, contactTitles}: ContactsFormFieldsProps) => {
    const {t} = useTranslation(["form"]);
    const isClient = useWatch({name: 'client'});
    const isAgent = useWatch({name: 'agent'});

    return (
        <>
            {/* Contact typology selection */}
            <Box>
                <Typography color={!isFormDisabled ? "text.primary" : "textDisabled"}>
                    {t("contacts.select")}
                </Typography>
                <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, ml: 1}}>
                    <FlagCheckBoxFieldControlled<IContactForm>
                        name="client"
                        label={t("contacts.client")}
                        width={100}
                    />
                    <FlagCheckBoxFieldControlled<IContactForm>
                        name="agent"
                        label={t("contacts.agent")}
                        width={100}
                    />
                    <FlagCheckBoxFieldControlled<IContactForm>
                        name="supplier"
                        label={t("contacts.supplier")}
                        width={100}
                    />
                    <FlagCheckBoxFieldControlled<IContactForm>
                        name="subcontractor"
                        label={t("contacts.subcontractor")}
                        width={100}
                    />
                </Box>
            </Box>

            {/* Contact type selection */}
            <RadioFieldControlled<IContactForm>
                name="contact_type_id"
                label={t("contacts.type")}
                options={contactTypes?.map((x) => ({
                    value: x.id,
                    label: x.name
                })) || []}
                required
            />

            {/* Basic information */}
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <SelectFieldControlled<IContactForm>
                    name="contact_title_id"
                    label={t("contacts.title")}
                    options={contactTitles?.map((x) => ({
                        value: x.id,
                        label: x.name
                    })) || []}
                    required
                />
                <TextFieldControlled<IContactForm>
                    name="name"
                    label={t("contacts.name")}
                    required
                />
            </Box>
            <TextFieldControlled<IContactForm>
                name="contact_note"
                label={t("contacts.notes")}
            />

            {isClient && (
                <Box sx={{mt: 1, borderRadius: 1}}>
                    <Typography color={!isFormDisabled ? "text.primary" : "textDisabled"} variant="subtitle1" sx={{mb: 1}}>{t("contacts.client_data")}</Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                        <NumberFieldControlled<IContactForm>
                            name="tolerance_quantity"
                            label={t("contacts.tolerance_quantity")}
                            precision={2}
                            startAdornment={"%"}
                        />
                        <NumberFieldControlled<IContactForm>
                            name="tolerance_start_days"
                            label={t("contacts.tolerance_start_days")}
                            precision={0}
                        />
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                        <TextFieldControlled<IContactForm>
                            name="client_note"
                            label={t("contacts.client_note")}
                            TextFieldProps={{multiline: true, rows: 2}}
                        />
                        <TextFieldControlled<IContactForm>
                            name="client_shipment_note"
                            label={t("contacts.client_shipment_note")}
                            TextFieldProps={{multiline: true, rows: 2}}
                        />
                    </Box>
                </Box>
            )}

            {isAgent && (
                <Box sx={{mt: 1, borderRadius: 1}}>
                    <Typography color={!isFormDisabled ? "text.primary" : "textDisabled"} variant="subtitle1" sx={{mb: 1}}>{t("contacts.agent")}</Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                        <NumberFieldControlled<IContactForm>
                            name="agent_percentage"
                            label={t("contacts.agent_percentage")}
                            precision={2}
                            startAdornment={"%"}
                        />
                    </Box>
                </Box>
            )}
        </>
    );
}

export default ContactsForm;