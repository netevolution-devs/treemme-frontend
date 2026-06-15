import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import {useEffect} from "react";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import useAddProcessingToContact from "@features/panels/contacts/contacts/processings/api/useAddProcessingToContact";
import CustomButton from "@features/panels/shared/CustomButton";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";
import type {
    IContactsProcessingsStoreParams,
    IContactsProcessingsStoreState
} from "@features/panels/contacts/contacts/processings/ContactsProcessingsPanel";
import {workingApi} from "@features/panels/production/workings/api/workingApi";
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';

export type IContactProcessingForm = {
    processing_id: number | null;
}

const ContactsProcessingsForm = ({
                                     initialName,
                                     onSuccess,
                                     extra
                                 }: ICustomPanelFormProps<IContactsProcessingsStoreParams>) => {
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

    const {mutateAsync: addProcessing, isPending} = useAddProcessingToContact(selectedContactId);

    useEffect(() => {
        if (floatingPanelUUID?.includes("create")) {
            setFormState("new");
        }
    }, [floatingPanelUUID, setFormState]);

    return (
        <GenericForm<IContactProcessingForm, IContactProcessingForm, IContactsProcessingsStoreState>
            resource="contatti - contatti"
            floatingPanelMode
            floatingPanelUUID={extra?.panelId as string}
            disabledBasicButtons
            disableCreateButton
            disableEditButton
            disableUpdateButton
            bypassConfirm
            selectedId={null}
            entity={{
                processing_id: null,
            }}
            emptyValues={{
                processing_id: null,
            }}
            mapEntityToForm={(x) => ({processing_id: x.processing_id})}
            create={async (payload) => {
                await addProcessing({processing_id: payload.processing_id as number});
                handlePanelSuccess({id: 0});
            }}
            validateBeforeSave={(v) => !!v.processing_id}
            extraButtons={[
                <CustomButton
                    key="submit-processing"
                    label={t("common:button.execute")}
                    color={"success"}
                    icon={<DeveloperBoardIcon/>}
                    isSubmit
                />
            ]}
            isSaving={isPending}
            renderFields={() => <ContactsProcessingsFormFields selectedContactId={selectedContactId}/>}
        />
    );
};

interface IContactsProcessingsFormProps {
    selectedContactId: number;
}

const ContactsProcessingsFormFields = ({selectedContactId}: IContactsProcessingsFormProps) => {
    const {t} = useTranslation(["form"]);

    const {data: client} = contactsApi.useGetDetail(selectedContactId);
    const assignedProcessingIds = client?.contact_processings?.map(x => x.processing.id) ?? [];

    const {data: allProcessings = []} = workingApi.useGetList();
    const filteredProcessings = allProcessings.filter(p =>
        !assignedProcessingIds.includes(p.id)
    );

    return (
        <SelectFieldControlled<IContactProcessingForm>
            name={"processing_id"}
            label={t("production.working.name")}
            options={filteredProcessings.map((x) => ({label: x.name, value: x.id}))}
            required
        />
    )
}

export default ContactsProcessingsForm;
