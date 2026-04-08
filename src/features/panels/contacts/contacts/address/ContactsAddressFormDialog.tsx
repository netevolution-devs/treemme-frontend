import {usePanel} from "@ui/panel/PanelContext";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel";
import {useTranslation} from "react-i18next";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericForm from "@features/panels/shared/GenericForm";
import type {IContactAddress} from "@features/panels/contacts/contacts/api/contacts-address/IContactAddress";
import {contactsAddressApi} from "@features/panels/contacts/contacts/api/contacts-address/contactsAddressApi";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import {nationsApi} from "@features/panels/contacts/nations/api/nationsApi";
import {capApi} from "@features/panels/contacts/cap/api/capApi";
import {Box, Stack} from "@mui/material";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import BaseDialog from "@ui/dialog/BaseDialog";

type Props = unknown;

export type IContactAddressForm = Omit<IContactAddress,
    'id' |
    'nation' |
    'town'
> & {
    nation_id: number | null;
    town_id: number | null;
    contact_id: number | null;
};

const ContactsAddressFormDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const selectedAddressId = useStore(state => state.uiState.selectedAddressId);
    const setUIState = useStore(state => state.setUIState);

    const {data: contact} = contactsApi.useGetDetail(selectedContactId);

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
    } = useDelete({invalidateQueries: ['CONTACT', 'CONTACT_ADDRESS', String(contact?.id)]});

    const {data: nations} = nationsApi.useGetList();
    const {data: caps} = capApi.useGetList();

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <GenericForm<IContactAddressForm, IContactAddress, IPanelUIState>
                resource="contatti - contatti"
                dialogMode
                dialogRef={ref}
                selectedId={selectedAddressId}
                entity={address}
                emptyValues={{
                    address: '',
                    address_2: '',
                    address_3: '',
                    address_4: '',
                    address_name: '',
                    nation_id: null,
                    town_id: null,
                    contact_id: null,
                }}
                mapEntityToForm={(x) => ({
                    address: x.address,
                    address_2: x.address_2,
                    address_3: x.address_3,
                    address_4: x.address_4,
                    address_name: x.address_name,
                    nation_id: x.nation.id,
                    town_id: x.town.id,
                    contact_id: selectedContactId as number
                })}
                create={(payload) => createAddress({...payload, contact_id: selectedContactId as number})}
                update={(id, payload) => updateAddress({
                    id,
                    payload: {...payload, contact_id: selectedContactId as number}
                })}
                remove={(id) => deleteAddress(id)}
                isSaving={isPosting || isPutting}
                isDeleting={isDeleting}
                onClearSelection={() => setUIState({selectedAddressId: null})}
                validateBeforeSave={(v) => !!v.address_name && !!v.address && !!v.nation_id && !!v.town_id}
                renderFields={() => (
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
                            <SelectFieldControlled<IContactAddressForm>
                                name={"town_id"}
                                label={t("contacts.address.cap")}
                                options={caps?.map((x) => ({
                                    value: x.id,
                                    label: `${x.cap} - ${x.name} - ${x.province.name}`
                                })) || []}
                                minWidth={400}
                                required
                            />
                            <SelectFieldControlled<IContactAddressForm>
                                name={"nation_id"}
                                label={t("nations.name")}
                                options={nations?.map((x) => ({
                                    value: x.id,
                                    label: x.name
                                })) || []}
                                required
                            />
                        </Box>
                    </>
                )}
            />
        </BaseDialog>
    )
})

export default ContactsAddressFormDialog;