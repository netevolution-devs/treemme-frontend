import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import {useEffect} from "react";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import useAddSubcontractorToContact from "@features/panels/contacts/contacts/subcontractors/api/useAddSubcontractorToContact";
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import CustomButton from "@features/panels/shared/CustomButton";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";
import type {
    IContactsSubcontractorsStoreParams,
    IContactsSubcontractorsStoreState
} from "@features/panels/contacts/contacts/subcontractors/ContactsSubcontractorsPanel";
import useCallablePanel from "@ui/panel/useCallablePanel";
import useSubscribePanel from "@ui/panel/useSubscribePanel";

export type IContactSubcontractorForm = {
    subcontractor_id: number | null;
}

const ContactsSubcontractorsForm = ({
                                        initialName,
                                        onSuccess,
                                        extra
                                    }: ICustomPanelFormProps<IContactsSubcontractorsStoreParams>) => {
    const {t} = useTranslation(["common"]);
    const selectedContactId = extra?.selectedContactId ?? 0;
    const floatingPanelUUID = extra?.panelId as string;

    const {setFormState} = usePanelFormButtons();

    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: null,
        onSuccess,
        setFormState
    });

    const {mutateAsync: addSubcontractor, isPending} = useAddSubcontractorToContact(selectedContactId);

    useEffect(() => {
        if (floatingPanelUUID?.includes("create")) {
            setFormState("new");
        }
    }, [floatingPanelUUID, setFormState]);

    return (
        <GenericForm<IContactSubcontractorForm, IContactSubcontractorForm, IContactsSubcontractorsStoreState>
            resource="contatti - contatti"
            floatingPanelMode
            floatingPanelUUID={extra?.panelId as string}
            disabledBasicButtons
            disableCreateButton
            disableEditButton
            bypassConfirm
            selectedId={null}
            entity={{
                subcontractor_id: null,
            }}
            emptyValues={{
                subcontractor_id: null,
            }}
            mapEntityToForm={(x) => ({subcontractor_id: x.subcontractor_id})}
            create={async (payload) => {
                await addSubcontractor({subcontractor_id: payload.subcontractor_id as number});
                handlePanelSuccess({id: 0});
            }}
            validateBeforeSave={(v) => !!v.subcontractor_id}
            extraButtons={[
                <CustomButton
                    key="submit-subcontractor"
                    label={t("common:button.execute")}
                    color={"success"}
                    icon={<DomainAddIcon/>}
                    isSubmit
                />
            ]}
            isSaving={isPending}
            renderFields={() => <ContactsSubcontractorsFormFields selectedContactId={selectedContactId}/>}
        />
    );
};

interface IContactsSubcontractorsFormProps {
    selectedContactId: number;
}

const ContactsSubcontractorsFormFields = ({selectedContactId}: IContactsSubcontractorsFormProps) => {
    const {t} = useTranslation(["form"]);

    const {data: client} = contactsApi.useGetDetail(selectedContactId);
    const assignedSubcontractorIds = client?.contact_subcontractors?.map(x => x.subcontractor.id) ?? [];

    const {data: subcontractors = []} = contactsApi.useGetList({queryParams: {type: 'subcontractor'}});
    const filteredSubcontractors = subcontractors.filter(sub =>
        !assignedSubcontractorIds.includes(sub.id) && sub.id !== selectedContactId
    );

    const {add: addSelectPanel} = useCallablePanel();

    useSubscribePanel<IContactSubcontractorForm>({
        formKey: "subcontractor_id",
        dependencyKey: "contacts"
    })

    return (
        <>
            <SelectFieldControlled<IContactSubcontractorForm>
                name={"subcontractor_id"}
                label={t("contacts.subcontractor")}
                options={filteredSubcontractors.map((x) => ({label: x.name, value: x.id}))}
                required
                onNoOptionsMatch={(input) => {
                    addSelectPanel({
                        extra: {
                            subcontractor: true
                        },
                        initialValue: input,
                        menu: {
                            component: "contacts",
                            i18nKey: "menu.contacts.contacts"
                        },
                        customId: input
                    })
                }}
            />
        </>
    )
}

export default ContactsSubcontractorsForm;
