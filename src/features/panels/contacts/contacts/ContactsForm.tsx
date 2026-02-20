import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import {contactsTitleApi} from "@features/panels/shared/api/contacts-title/contactsTitleApi.ts";

export type IContactForm = Omit<IContact, 'id' | 'contact_title' | 'contact_type'> & {
    contact_title_id: number;
    contact_type_id: number;
};

const ContactsForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = contactsApi;
    const {data: contact} = useGetDetail(selectedContactId);
    const {mutateAsync: createContact, isPending: isPosting} = usePost();
    const {mutateAsync: updateContact, isPending: isPutting} = usePut();
    const {mutateAsync: deleteContact, isPending: isDeleting} = useDelete();

    const {useGetList: useGetContactTitles} = contactsTitleApi;
    const {data: contactTitles} = useGetContactTitles();

    return (
        <GenericForm<IContactForm, IContact, IContactsStoreState>
            selectedId={selectedContactId}
            entity={contact}
            emptyValues={{
                name: '',
                contact_note: '',
                contact_title_id: 0,
                contact_type_id: 0
            }}
            mapEntityToForm={(x) => ({
                name: x.name,
                contact_note: x.contact_note,
                contact_title_id: x.contact_title.id,
                contact_type_id: x.contact_type.id
            })}
            create={(payload) => createContact(payload)}
            update={(id, payload) => updateContact({ id, payload })}
            remove={(id) => deleteContact(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({ selectedContactId: null })}
            validateBeforeSave={(v) => !!v.name && !!v.contact_title_id && !!v.contact_type_id}
            renderFields={() => (
                <>
                    <SelectFieldControlled<IContactForm>
                        name="contact_title_id"
                        label={t("contacts.title")}
                        options={contactTitles?.map((x) => ({
                            value: x.id,
                            label: x.name
                        })) || []}
                    />
                    <TextFieldControlled<IContactForm>
                        name="name"
                        label={t("contacts.name")}
                    />
                    <TextFieldControlled<IContactForm>
                        name="contact_note"
                        label={t("contacts.notes")}
                    />
                </>
            )}
        />
    );
};

export default ContactsForm;