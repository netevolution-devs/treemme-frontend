import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import {useTranslation} from "react-i18next";
// import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import type {IContactAddress} from "@features/panels/contacts/contacts/api/contacts-address/IContactAddress.ts";
import {contactsAddressApi} from "@features/panels/contacts/contacts/api/contacts-address/contactsAddressApi.ts";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";

export interface IContactsStoreAddressState extends IPanelUIState {
    selectedAddressId?: number | null | undefined;
}

export type IContactAddressForm = Omit<IContactAddress,
    'id' |
    'nation' |
    'town'
> & {
    nation_id: number;
    town_id: number;
};

const ContactsAddressForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const selectedAddressId = useStore(state => state.uiState.selectedAddressId);
    const setUIState = useStore(state => state.setUIState);

    // const {data: contact} = contactsApi.useGetDetail(selectedContactId);

    const {useGetDetail, usePost, usePut, useDelete} = contactsAddressApi;
    const {data: address} = useGetDetail(selectedAddressId);
    const {mutateAsync: createAddress, isPending: isPosting} = usePost();
    const {mutateAsync: updateAddress, isPending: isPutting} = usePut();
    const {mutateAsync: deleteAddress, isPending: isDeleting} = useDelete();

    if (!selectedContactId) {
        return null;
    }

    const initialUiState: IContactsStoreAddressState = {
        isFormDisabled: true,
        buttonsState: BaseButtonState,
        selectedAddressId: selectedAddressId,
    };

    return (
        <GenericPanel<unknown, IContactsStoreAddressState>
            kind={'contacts'}
            initialState={{uiState: initialUiState}}
        >
            <GenericForm<IContactAddressForm, IContactAddress, IContactsStoreAddressState>
                selectedId={null}
                entity={address}
                emptyValues={{
                    address: '',
                    address_2: '',
                    address_3: '',
                    address_4: '',
                    address_note: '',
                    nation_id: 0,
                    town_id: 0
                }}
                mapEntityToForm={(x) => ({
                    address: x.address,
                    address_2: x.address_2,
                    address_3: x.address_3,
                    address_4: x.address_4,
                    address_note: x.address_note,
                    nation_id: x.nation.id,
                    town_id: x.town.id
                })}
                create={(payload) => createAddress({...payload, contact_id: selectedContactId})}
                update={(id, payload) => updateAddress({id, payload: {...payload, contact_id: selectedContactId}})}
                remove={(id) => deleteAddress(id)}
                isSaving={isPosting || isPutting}
                isDeleting={isDeleting}
                onClearSelection={() => setUIState({selectedAddressId: null})}
                validateBeforeSave={(v) => !!v.address && !!v.nation_id && !!v.town_id}
                renderFields={() => (
                    <>
                        <TextFieldControlled<IContactAddressForm>
                            name="address"
                            label={t("contacts.address.address-1")}
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
                    </>
                )}
            />
        </GenericPanel>
    )
}

export default ContactsAddressForm;