import BaseDialog from "@ui/dialog/BaseDialog";
import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import GenericForm from "@features/panels/shared/GenericForm";
import type {IContactDetail} from "@features/panels/contacts/contacts/api/contacts-detail/IContactDetail";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel";
import {contactsDetailApi} from "@features/panels/contacts/contacts/api/contacts-detail/contactDetailApi";
import {
    contactsDetailTypeApi
} from "@features/panels/contacts/contacts/api/contacts-detail-type/contactDetailTypeApi";
import RadioFieldControlled from "@ui/form/controlled/RadioFieldControlled";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";

type Props = unknown;

type IContactDetailForm = Omit<IContactDetail, "id" | "detail_type"> & {
    detail_type_id: number;
};

const ContactsDetailFormDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore((state) => state.uiState.selectedContactId);
    const selectedDetailId = useStore((state) => state.uiState.selectedDetailId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = contactsDetailApi;
    const {data: detail} = useGetDetail(selectedDetailId);
    const {
        mutateAsync: createDetail,
        isPending: isPosting
    } = usePost({invalidateQueries: ['CONTACT', 'CONTACT_DETAIL', String(selectedContactId)]});
    const {
        mutateAsync: updateDetail,
        isPending: isPutting
    } = usePut({invalidateQueries: ['CONTACT', 'CONTACT_DETAIL', String(selectedContactId)]});
    const {
        mutateAsync: deleteDetail,
        isPending: isDeleting
    } = useDelete({invalidateQueries: ['CONTACT', 'CONTACT_DETAIL', String(selectedContactId)]});

    const {data: detailTypes} = contactsDetailTypeApi.useGetList();

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <GenericForm<IContactDetailForm, IContactDetail, IPanelUIState>
                resource="contatti - contatti"
                dialogMode
                dialogRef={ref}
                selectedId={selectedDetailId}
                entity={detail}
                emptyValues={{
                    name: '',
                    note: '',
                    detail_type_id: 0,
                }}
                mapEntityToForm={(x) => ({
                    name: x.name,
                    note: x.note,
                    detail_type_id: x.detail_type.id,
                })}
                create={(payload) => createDetail({...payload, contact_id: selectedContactId as number})}
                update={(id, payload) => updateDetail({id, payload: {...payload, contact_id: selectedContactId as number}})}
                remove={(id) => deleteDetail(id)}
                isSaving={isPosting || isPutting}
                isDeleting={isDeleting}
                onClearSelection={() => setUIState({selectedDetailId: null})}
                validateBeforeSave={(v) => !!v.name && !!v.detail_type_id}
                renderFields={() => (
                    <>
                        <RadioFieldControlled<IContactDetailForm>
                            name={'detail_type_id'}
                            label={t("contacts.details.types.type")}
                            options={detailTypes?.map(x => ({label:
                                x.name,
                                value: x.id
                            })) || []}
                            required
                        />
                        <TextFieldControlled<IContactDetailForm>
                            name={"name"}
                            label={t("contacts.details.value")}
                            showUpperCase={false}
                            required
                        />
                        <TextFieldControlled<IContactDetailForm>
                            name={"note"}
                            label={t("contacts.details.note")}
                        />
                    </>
                )}
            />
        </BaseDialog>
    )
})

export default ContactsDetailFormDialog;