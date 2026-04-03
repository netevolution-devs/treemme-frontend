import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreParams, IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";
import RadioFieldControlled from "@ui/form/controlled/RadioFieldControlled.tsx";
import {contactsTypeApi} from "@features/panels/contacts/contacts/api/contacts-type/contactsTypeApi.ts";
import {Box, Typography} from "@mui/material";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled.tsx";
import {useWatch} from "react-hook-form";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst.ts";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin.ts";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import type {ICustomerOrderForm} from "@features/panels/orders/customer-orders/CustomerOrdersForm.tsx";
import {paymentApi} from "@features/panels/commercial/payment-types/api/paymentApi.ts";
import {
    shipmentConditionApi
} from "@features/panels/commercial/shipment-conditions/api/shipmentConditionApi.ts";
import useCallablePanel from "@ui/panel/useCallablePanel.ts";
import useSubscribePanel from "@ui/panel/useSubscribePanel.ts";

export type IContactForm = Omit<IContact, 'id'
    | 'contact_title'
    | 'contact_type'
    | 'contact_addresses'
    | 'contact_details'
    | 'contact_agents'
    | 'contact_subcontractors'
    | 'specific_order_reference'
    | 'agent_percentage'
    | 'agent_clients'
    | 'agent_suppliers'
    | 'payment'
    | 'shipment_condition'
    | 'subcontractor_suppliers'
> & {
    payment_id: number | null;
    shipment_condition_id: number | null;
    contact_type_id: number | null;
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

    return (
        <GenericForm<IContactForm, IContact, IContactsStoreState>
            onSuccess={handlePanelSuccess}
            selectedId={selectedContactId}
            entity={contact}
            emptyValues={{
                name: initialName ?? '',
                contact_note: '',
                // contact_title_id: null,
                contact_type_id: null,
                client: extra?.client ?? false,
                supplier: extra?.supplier ?? false,
                agent: false,
                subcontractor: false,
                client_note: '',
                client_shipment_note: '',
                agent_percentage: null,
                payment_id: null,
                shipment_condition_id: null,
            }}
            mapEntityToForm={(x) => ({
                name: x.name,
                contact_note: x.contact_note,
                contact_type_id: x.contact_type?.id || null,
                client: x.client,
                supplier: x.supplier,
                agent: x.agent,
                subcontractor: x.subcontractor,
                client_note: x.client_note ?? '',
                client_shipment_note: x.client_shipment_note ?? '',
                agent_percentage: x.agent_percentage,
                payment_id: x.payment?.id || null,
                shipment_condition_id: x.shipment_condition?.id || null,
            })}
            create={(payload) => createContact(payload)}
            onCreateSuccess={(id) => {
                setUIState({selectedContactId: id});
                setUIState({selectedAddressId: null});
                setUIState({selectedDetailId: null});
            }}
            update={(id, payload) => updateContact({id, payload})}
            remove={(id) => deleteContact(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({
                selectedContactId: null,
                selectedAddressId: null,
                selectedDetailId: null
            })}
            validateBeforeSave={(v) => !!v.name && !!v.contact_type_id}
            renderFields={() => <ContactsFormFields isFormDisabled={isFormDisabled}/>}
        />
    );
};

interface ContactsFormFieldsProps {
    isFormDisabled: boolean;
}

const ContactsFormFields = ({isFormDisabled}: ContactsFormFieldsProps) => {
    const {t} = useTranslation(["form"]);
    const isClient = useWatch({name: 'client'});
    const isAgent = useWatch({name: 'agent'});
    const isSupplier = useWatch({name: 'supplier'});

    // const {data: contactTitles} = contactsTitleApi.useGetList();
    const {data: contactTypes} = contactsTypeApi.useGetList();
    const {data: payments = []} = paymentApi.useGetList();
    const {data: shipmentConditions = []} = shipmentConditionApi.useGetList();

    const {add: addSelectPanel} = useCallablePanel();

    useSubscribePanel<IContactForm>({
        formKey: "payment_id",
        dependencyKey: "paymentTypes"
    })
    useSubscribePanel<IContactForm>({
        formKey: "shipment_condition_id",
        dependencyKey: "shipmentConditions"
    })

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
                {/*<SelectFieldControlled<IContactForm>*/}
                {/*    name="contact_title_id"*/}
                {/*    label={t("contacts.title")}*/}
                {/*    options={contactTitles?.map((x) => ({*/}
                {/*        value: x.id,*/}
                {/*        label: x.name*/}
                {/*    })) || []}*/}
                {/*    required*/}
                {/*/>*/}
                <TextFieldControlled<IContactForm>
                    name="name"
                    label={t("contacts.name")}
                    required
                />
            </Box>
            <TextFieldControlled<IContactForm>
                name="contact_note"
                label={t("contacts.notes")}
                TextFieldProps={{multiline: true, rows: 2}}
            />

            {isSupplier && (
                <Box sx={{mt: 1}}>
                    <Typography
                        color={!isFormDisabled ? "text.primary" : "textDisabled"}
                        variant="subtitle1"
                        sx={{mb: 1}}
                    >
                        {t("contacts.payment")}
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                        <SelectFieldControlled<ICustomerOrderForm>
                            name={"payment_id"}
                            label={t("orders.payment")}
                            options={payments.map(p => ({value: p.id, label: p.name}))}
                            required
                            onNoOptionsMatch={(input) => {
                                addSelectPanel({
                                    initialValue: input,
                                    menu: {
                                        component: "paymentTypes",
                                        i18nKey: "menu.commercial.payment-types"
                                    }
                                })
                            }}
                        />
                    </Box>
                </Box>
            )}

            {isClient && (
                <Box sx={{mt: 1}}>
                    <Typography
                        color={!isFormDisabled ? "text.primary" : "textDisabled"}
                        variant="subtitle1"
                        sx={{mb: 1}}
                    >
                        {t("contacts.payment")}
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                        <SelectFieldControlled<ICustomerOrderForm>
                            name={"payment_id"}
                            label={t("orders.payment")}
                            options={payments.map(p => ({value: p.id, label: p.name}))}
                            required
                            onNoOptionsMatch={(input) => {
                                addSelectPanel({
                                    initialValue: input,
                                    menu: {
                                        component: "paymentTypes",
                                        i18nKey: "menu.commercial.payment-types"
                                    }
                                })
                            }}
                        />
                        <SelectFieldControlled<ICustomerOrderForm>
                            name={"shipment_condition_id"}
                            label={t("orders.shipment-condition")}
                            options={shipmentConditions.map(p => ({value: p.id, label: p.name}))}
                            onNoOptionsMatch={(input) => {
                                addSelectPanel({
                                    initialValue: input,
                                    menu: {
                                        component: "shipmentConditions",
                                        i18nKey: "menu.commercial.shipment-conditions"
                                    }
                                })
                            }}
                        />
                    </Box>
                    <Typography
                        color={!isFormDisabled ? "text.primary" : "textDisabled"}
                        variant="subtitle1"
                        sx={{mb: 1}}
                    >
                        {t("contacts.client_data")}
                    </Typography>
                    {/*<Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>*/}
                    {/*    <NumberFieldControlled<IContactForm>*/}
                    {/*        name="tolerance_quantity"*/}
                    {/*        label={t("contacts.tolerance_quantity")}*/}
                    {/*        precision={2}*/}
                    {/*        startAdornment={"%"}*/}
                    {/*    />*/}
                    {/*    <NumberFieldControlled<IContactForm>*/}
                    {/*        name="tolerance_start_days"*/}
                    {/*        label={t("contacts.tolerance_start_days")}*/}
                    {/*        precision={0}*/}
                    {/*    />*/}
                    {/*</Box>*/}
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
                    <Typography color={!isFormDisabled ? "text.primary" : "textDisabled"} variant="subtitle1"
                                sx={{mb: 1}}>{t("contacts.agent")}</Typography>
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