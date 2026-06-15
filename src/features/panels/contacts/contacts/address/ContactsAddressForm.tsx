import {usePanel} from "@ui/panel/PanelContext";
import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm";
import type {IContactAddress} from "@features/panels/contacts/contacts/api/contacts-address/IContactAddress";
import {contactsAddressApi} from "@features/panels/contacts/contacts/api/contacts-address/contactsAddressApi";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled";
import {nationsApi} from "@features/panels/contacts/nations/api/nationsApi";
import {Box, Stack} from "@mui/material";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import type {
    IContactsAddressStoreParams,
    IContactsAddressStoreState
} from "@features/panels/contacts/contacts/address/ContactsAddressPanel";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {useEffect, useMemo} from "react";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import useCallablePanel from "@ui/panel/useCallablePanel";
import useSubscribePanel from "@ui/panel/useSubscribePanel";
import {useFormContext} from "react-hook-form";
import {useFilteringAddress} from "@features/panels/shared/hooks/useFilteringAddress";

export type IContactAddressForm = Omit<IContactAddress,
    'id' |
    'nation' |
    'town' |
    'different_destination' |
    'contact'
> & {
    nation_id: number | null;
    contact_id: number | null;
    zip_code: string;
    default_address: boolean;
    different_destination_id?: number | null;
    selected_contact_id?: number | null;
    selected_contact_address_id?: number | null;
};

const ContactsAddressForm = ({extra}: ICustomPanelFormProps<IContactsAddressStoreParams>) => {
    const {useStore} = usePanel<unknown, IContactsAddressStoreState>();
    const selectedStoreId = useStore((state) => state.uiState.selectedAddressId);
    const selectedAddressId = extra?.address_id ?? selectedStoreId;
    const setUIState = useStore(state => state.setUIState);
    const contactId = extra?.contact_id;

    const {data: contact} = contactsApi.useGetDetail(contactId);

    const {useGetDetail, usePost, usePut, useDelete} = contactsAddressApi;
    const {data: address} = useGetDetail(selectedAddressId);

    const differentDestination = address?.different_destination;

    const {
        mutateAsync: createAddress,
        isPending: isPosting
    } = usePost({invalidateQueries: ['CONTACT', 'CONTACT_ADDRESS', String(contact?.id)]});
    const {
        mutateAsync: updateAddress,
        isPending: isPutting
    } = usePut({invalidateQueries: ['CONTACT', 'CONTACT_ADDRESS', String(contact?.id)]});
    const {
        mutateAsync: deleteAddress,
        isPending: isDeleting
    } = useDelete({invalidateQueries: ['CONTACT', 'LIST']});

    const {setFormState} = usePanelFormButtons();
    const floatingPanelUUID = extra?.panelId as string;

    useEffect(() => {
        if (floatingPanelUUID.includes("create")) {
            setFormState("new");
        }
    }, [floatingPanelUUID]);

    const buildPayload = (payload: IContactAddressForm) => {
        if (extra?.associateContact) {
            return {
                different_destination_id: payload.selected_contact_address_id,
                default_address: payload.default_address,
                contact_id: contactId as number,
            }
        }
        return {
            address: payload.address,
            address_2: payload.address_2,
            address_3: payload.address_3,
            address_4: payload.address_4,
            address_name: payload.address_name,
            nation_id: payload.nation_id,
            zip_code: payload.zip_code,
            default_address: payload.default_address,
            contact_id: contactId as number,
        }
    };

    return (
        <GenericForm<IContactAddressForm, IContactAddress, IContactsAddressStoreState>
            resource="contatti - contatti"
            selectedId={selectedAddressId}
            floatingPanelMode
            floatingPanelUUID={floatingPanelUUID}
            disableCreateButton
            entity={differentDestination ? differentDestination : address}
            selectedIdKey={"selectedAddressId"}
            emptyValues={{
                address: '',
                address_2: '',
                address_3: '',
                address_4: '',
                address_name: '',
                nation_id: null,
                contact_id: null,
                zip_code: '',
                default_address: false,
                different_destination_id: null,
                selected_contact_id: null,
                selected_contact_address_id: null,
            }}
            mapEntityToForm={(x) => ({
                address: x.address,
                address_2: x.address_2,
                address_3: x.address_3,
                address_4: x.address_4,
                address_name: x.address_name,
                nation_id: x.nation.id,
                contact_id: contactId as number,
                zip_code: x.zip_code,
                default_address: x.default_address,
                different_destination_id: null,
                selected_contact_id: extra?.contact_id as number,
                selected_contact_address_id: null,
            })}
            create={(payload) => createAddress(buildPayload(payload) as unknown as IContactAddressForm)}
            update={(id, payload) => updateAddress({
                id,
                payload: buildPayload(payload) as unknown as IContactAddressForm,
            })}
            remove={(id) => deleteAddress(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedAddressId: null})}
            validateBeforeSave={(v) => !!(
                v.selected_contact_address_id ||
                (v.address_name && v.address && v.nation_id)
            )}
            renderFields={() => (
                <ContactAddressFormFields
                    contactId={contactId}
                    isAssociationMode={extra?.associateContact as boolean}
                    differentDestination={differentDestination as IContactAddress}
                />
            )}
        />
    )
}

const ContactAddressFormFields = ({contactId, isAssociationMode, differentDestination}: {
    contactId: number | undefined;
    isAssociationMode: boolean,
    differentDestination: IContactAddress | undefined;
}) => {
    const {t} = useTranslation(["form"]);

    const {data: nations} = nationsApi.useGetList();
    const {data: contacts} = contactsApi.useGetList();

    const {add: addSelectPanel} = useCallablePanel();

    const {watch} = useFormContext();
    const watchedSelectedContactId = watch("selected_contact_id");

    const {data: contactAddresses = []} = contactsApi.useGetContactAddressDetail(watchedSelectedContactId as number);

    const {filterAddressString} = useFilteringAddress();

    useSubscribePanel<IContactAddressForm>({
        formKey: "nation_id",
        dependencyKey: "nations"
    })

    const otherContacts = useMemo(() => {
        return contacts?.filter((x) => x.id !== contactId) || [];
    }, [contacts, contactId]);

    const disabledFormMode = isAssociationMode || !!differentDestination;

    return (
        <>
            <>
                <Stack gap={1} sx={{mb: 1}}>
                    <TextFieldControlled<IContactAddressForm>
                        name="address_name"
                        label={t("contacts.address.name")}
                        required={!disabledFormMode}
                        deactivated={disabledFormMode}
                    />
                    <TextFieldControlled<IContactAddressForm>
                        name="address"
                        label={t("contacts.address.address-1")}
                        required={!disabledFormMode}
                        deactivated={disabledFormMode}
                    />
                    <TextFieldControlled<IContactAddressForm>
                        name="address_2"
                        label={t("contacts.address.address-2")}
                        deactivated={disabledFormMode}
                    />
                    <TextFieldControlled<IContactAddressForm>
                        name="address_3"
                        label={t("contacts.address.address-3")}
                        deactivated={disabledFormMode}
                    />
                    <TextFieldControlled<IContactAddressForm>
                        name="address_4"
                        label={t("contacts.address.address-4")}
                        deactivated={disabledFormMode}
                    />
                </Stack>
                <Box sx={{display: 'flex', gap: 1}}>
                    <TextFieldControlled<IContactAddressForm>
                        name={"zip_code"}
                        label={t("contacts.address.cap")}
                        deactivated={disabledFormMode}
                    />
                    <SelectFieldControlled<IContactAddressForm>
                        name={"nation_id"}
                        label={t("nations.name")}
                        options={nations?.map((x) => ({
                            value: x.id,
                            label: x.name
                        })) || []}
                        onNoOptionsMatch={(input) => {
                            addSelectPanel({
                                initialValue: input,
                                menu: {
                                    component: "nations",
                                    i18nKey: "menu.contacts.nations"
                                }
                            })
                        }}
                        required={!disabledFormMode}
                        deactivated={disabledFormMode}
                    />
                </Box>
                <FlagCheckBoxFieldControlled<IContactAddressForm>
                    name="default_address"
                    label={t("contacts.address.default")}
                    disabled={disabledFormMode}
                />
            </>
            {disabledFormMode && (
                <>
                    <SelectFieldControlled<IContactAddressForm>
                        name={"selected_contact_id"}
                        label={"Contatto"}
                        options={otherContacts.map((x) => ({
                            value: x.id,
                            label: x.name
                        }))}
                    />
                    <SelectFieldControlled<IContactAddressForm>
                        name={"selected_contact_address_id"}
                        label={"Indirizzo del contatto da associare"}
                        options={contactAddresses.map((x) => ({
                            value: x.id,
                            label: `${x.address_name} - ${filterAddressString({addressLabels: [x.address, x.address_2, x.address_3, x.address_4]})} - ${x.zip_code} - ${x.nation?.name || ''}`
                        }))}
                        deactivated={!watchedSelectedContactId}
                    />
                </>
            )}
        </>
    )
}


export default ContactsAddressForm;
