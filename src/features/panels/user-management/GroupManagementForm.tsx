import {useTranslation} from "react-i18next";
import type {IGroupManagement, IGroupManagementPayload} from "@features/panels/user-management/api/IGroupManagement.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IUserManagementStoreState} from "@features/panels/user-management/UserManagementPanel.tsx";
import {groupManagementApi} from "@features/panels/user-management/api/groupManagementApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";

type IGroupForm = IGroupManagementPayload;

const GroupManagementForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IUserManagementStoreState>();
    const selectedGroupId = useStore(state => state.uiState.selectedGroupId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = groupManagementApi;
    const {data: group} = useGetDetail(selectedGroupId);
    const {mutateAsync: createGroup, isPending: isPosting} = usePost();
    const {mutateAsync: updateGroup, isPending: isPutting} = usePut();
    const {mutateAsync: deleteGroup, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IGroupForm, IGroupManagement, IUserManagementStoreState>
            selectedId={selectedGroupId}
            entity={group}
            emptyValues={{name: "", description: ""}}
            mapEntityToForm={(g) => ({
                name: g.name,
                description: g.description,
            })}
            create={(payload) => createGroup(payload)}
            update={(id, payload) => updateGroup({id, payload})}
            remove={(id) => deleteGroup(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedGroupId: null})}
            validateBeforeSave={(v) => !!v.name}
            renderFields={() => (
                <>
                    <TextFieldControlled<IGroupForm>
                        name="name"
                        label={t("group_management.name")}
                        required
                    />
                    <TextFieldControlled<IGroupForm>
                        name="description"
                        label={t("group_management.description")}
                        TextFieldProps={{multiline: true, rows: 2}}
                    />
                </>
            )}
        />
    );
};

export default GroupManagementForm;
