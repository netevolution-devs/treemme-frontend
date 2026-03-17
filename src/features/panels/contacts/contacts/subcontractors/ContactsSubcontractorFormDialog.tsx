import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import BaseDialog from "@ui/dialog/BaseDialog.tsx";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import useAddSubcontractorToContact from "@features/panels/contacts/contacts/subcontractors/api/useAddSubcontractorToContact.ts";
import {Typography} from "@mui/material";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import CustomButton from "@features/panels/shared/CustomButton.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

type Props = unknown;

export type IContactSubcontractorForm = {
    subcontractor_id: number;
}

const ContactsSubcontractorFormDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore((state) => state.uiState.selectedContactId);

    const {data: client } = contactsApi.useGetDetail(selectedContactId as number);
    const assignedSubcontractorIds = client?.contact_subcontractors?.map(x => x.subcontractor.id) ?? [];

    const {data: subcontractors = []} = contactsApi.useGetList({queryParams: {type: 'subcontractor'}});
    const filteredSubcontractors = subcontractors.filter(sub =>
        !assignedSubcontractorIds.includes(sub.id) && sub.id !== selectedContactId
    );

    const {mutateAsync: addSubcontractor, isPending} = useAddSubcontractorToContact(selectedContactId as number) ;

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <Typography variant={"h5"} sx={{mb: 2}}>{t("contacts.subcontractors.add")}</Typography>

            <GenericForm<IContactSubcontractorForm>
                dialogMode
                dialogRef={ref}
                disabledBasicButtons
                bypassConfirm
                selectedId={selectedContactId}
                entity={{
                    subcontractor_id: 0,
                }}
                emptyValues={{
                    subcontractor_id: 0,
                }}
                mapEntityToForm={(x) => ({subcontractor_id: x.subcontractor_id})}
                create={(payload) => addSubcontractor(payload)}
                validateBeforeSave={(v) => !!v.subcontractor_id}
                extraButtons={[
                    <CustomButton
                        label={t("common:button.execute")}
                        color={"success"}
                        icon={<PersonAddIcon/>}
                        isSubmit
                    />
                ]}
                isSaving={isPending}
                renderFields={() => (
                    <>
                        <SelectFieldControlled<IContactSubcontractorForm>
                            name={"subcontractor_id"}
                            label={t("shipping.subcontractor")}
                            options={filteredSubcontractors.map((x) => ({label: x.name, value: x.id}))}
                        />
                    </>
                )}
            />
        </BaseDialog>
    )
});

export default ContactsSubcontractorFormDialog;
