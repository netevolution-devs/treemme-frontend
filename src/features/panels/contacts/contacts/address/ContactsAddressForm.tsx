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
import {useEffect} from "react";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import useCallablePanel from "@ui/panel/useCallablePanel";
import useSubscribePanel from "@ui/panel/useSubscribePanel";

export type IContactAddressForm = Omit<IContactAddress,
    'id' |
    'nation' |
    'town'
> & {
    nation_id: number | null;
    contact_id: number | null;
    zip_code: string;
    default_address: boolean;
};

const ContactsAddressForm = ({extra}: ICustomPanelFormProps<IContactsAddressStoreParams>) => {
    const {useStore} = usePanel<unknown, IContactsAddressStoreState>();
    const selectedStoreId = useStore((state) => state.uiState.selectedAddressId);
    const selectedAddressId = extra?.address_id ?? selectedStoreId;
    const setUIState = useStore(state => state.setUIState);

    const {data: contact} = contactsApi.useGetDetail(extra?.contact_id);

    const {useGetDetail, usePost, usePut, useDelete} = contactsAddressApi;
    const {data: address} = useGetDetail(selectedAddressId);
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

    return (
        <GenericForm<IContactAddressForm, IContactAddress, IContactsAddressStoreState>
            resource="contatti - contatti"
            selectedId={selectedAddressId}
            floatingPanelMode
            floatingPanelUUID={floatingPanelUUID}
            disableCreateButton
            entity={address}
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
            }}
            mapEntityToForm={(x) => ({
                address: x.address,
                address_2: x.address_2,
                address_3: x.address_3,
                address_4: x.address_4,
                address_name: x.address_name,
                nation_id: x.nation.id,
                contact_id: extra?.contact_id as number,
                zip_code: x.zip_code,
                default_address: x.default_address,
            })}
            create={(payload) => createAddress({...payload, contact_id: extra?.contact_id as number})}
            update={(id, payload) => updateAddress({
                id,
                payload: {...payload, contact_id: extra?.contact_id as number}
            })}
            remove={(id) => deleteAddress(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedAddressId: null})}
            validateBeforeSave={(v) => !!v.address_name && !!v.address && !!v.nation_id}
            renderFields={() => (
                <ContactAddressFormFields/>
            )}
        />
    )
}

const ContactAddressFormFields = () => {
    const {t} = useTranslation(["form"]);

    const {data: nations} = nationsApi.useGetList();

    const {add: addSelectPanel} = useCallablePanel();

    useSubscribePanel<IContactAddressForm>({
        formKey: "nation_id",
        dependencyKey: "nations"
    })

    return (
        <>
            <Stack gap={1} sx={{mb: 1}}>
                <TextFieldControlled<IContactAddressForm>
                    name="address_name"
                    label={t("contacts.address.name")}
                    required
                />
                <TextFieldControlled<IContactAddressForm>
                    name="address"
                    label={t("contacts.address.address-1")}
                    required
                />
                <TextFieldControlled<IContactAddressForm>
                    name="address_2"
                    label={t("contacts.address.address-2")}
                />
                <TextFieldControlled<IContactAddressForm>
                    name="address_3"
                    label={t("contacts.address.address-3")}
                />
                <TextFieldControlled<IContactAddressForm>
                    name="address_4"
                    label={t("contacts.address.address-4")}
                />
            </Stack>
            <Box sx={{display: 'flex', gap: 1}}>
                <TextFieldControlled<IContactAddressForm>
                    name={"zip_code"}
                    label={t("contacts.address.cap")}
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
                    required
                />
            </Box>
            <FlagCheckBoxFieldControlled<IContactAddressForm>
                name="default_address"
                label={t("contacts.address.default")}
            />
        </>
    )
}


export default ContactsAddressForm;
