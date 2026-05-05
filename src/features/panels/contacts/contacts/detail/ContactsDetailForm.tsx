import {usePanel} from "@ui/panel/PanelContext";
import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm";
import type {IContactDetail} from "@features/panels/contacts/contacts/api/contacts-detail/IContactDetail";
import {contactsDetailApi} from "@features/panels/contacts/contacts/api/contacts-detail/contactDetailApi";
import {
    contactsDetailTypeApi
} from "@features/panels/contacts/contacts/api/contacts-detail-type/contactDetailTypeApi";
import RadioFieldControlled from "@ui/form/controlled/RadioFieldControlled";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import type {
    IContactsDetailStoreParams,
    IContactsDetailStoreState
} from "@features/panels/contacts/contacts/detail/ContactsDetailPanel";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {useEffect} from "react";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";

export type IContactDetailForm = Omit<IContactDetail, "id" | "detail_type"> & {
    detail_type_id: number;
};

const ContactsDetailForm = ({extra}: ICustomPanelFormProps<IContactsDetailStoreParams>) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsDetailStoreState>();
    const selectedStoreId = useStore(state => state.uiState.selectedDetailId);
    const selectedDetailId = extra?.detail_id ?? selectedStoreId;
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = contactsDetailApi;
    const {data: detail} = useGetDetail(selectedDetailId);
    const {
        mutateAsync: createDetail,
        isPending: isPosting
    } = usePost({invalidateQueries: ['CONTACT', 'CONTACT_DETAIL', String(extra?.contact_id)]});
    const {
        mutateAsync: updateDetail,
        isPending: isPutting
    } = usePut({invalidateQueries: ['CONTACT', 'CONTACT_DETAIL', String(extra?.contact_id)]});
    const {
        mutateAsync: deleteDetail,
        isPending: isDeleting
    } = useDelete({invalidateQueries: ['CONTACT']});

    const {data: detailTypes} = contactsDetailTypeApi.useGetList();

    const {setFormState} = usePanelFormButtons();
    const floatingPanelUUID = extra?.panelId as string;
    useEffect(() => {
        if (floatingPanelUUID.includes("create")) {
            setFormState("new");
        }
    }, [floatingPanelUUID]);

    return (
        <GenericForm<IContactDetailForm, IContactDetail, IContactsDetailStoreState>
            resource="contatti - contatti"
            selectedId={selectedDetailId}
            floatingPanelMode
            floatingPanelUUID={floatingPanelUUID}
            entity={detail}
            selectedIdKey={"selectedDetailId"}
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
            create={(payload) => createDetail({...payload, contact_id: extra?.contact_id as number})}
            update={(id, payload) => updateDetail({
                id,
                payload: {...payload, contact_id: extra?.contact_id as number}
            })}
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
                        options={detailTypes?.map(x => ({
                            label: x.name,
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
    )
}

export default ContactsDetailForm;
