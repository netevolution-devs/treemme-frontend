import {useTranslation} from "react-i18next";
import type {IRoleManagement, IRoleManagementPayload} from "@features/panels/user-management/api/IRoleManagement.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {roleManagementApi} from "@features/panels/user-management/api/roleManagementApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import type {IOrganizationManagementStoreState} from "@features/panels/user-management/OrganizationManagementPanel.tsx";

type IRoleForm = IRoleManagementPayload;

const RoleManagementForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IOrganizationManagementStoreState>();
    const selectedRoleId = useStore(state => state.uiState.selectedRoleId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = roleManagementApi;
    const {data: role} = useGetDetail(selectedRoleId);
    const {mutateAsync: createRole, isPending: isPosting} = usePost();
    const {mutateAsync: updateRole, isPending: isPutting} = usePut();
    const {mutateAsync: deleteRole, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IRoleForm, IRoleManagement, IOrganizationManagementStoreState>
            resource="sistema - gestione accessi"
            selectedId={selectedRoleId}
            entity={role}
            emptyValues={{name: ''}}
            mapEntityToForm={(r) => ({
                name: r.name,
            })}
            create={(payload) => createRole(payload)}
            update={(id, payload) => updateRole({id, payload})}
            remove={(id) => deleteRole(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedRoleId: null})}
            validateBeforeSave={(v) => !!v.name}
            renderFields={() => (
                <TextFieldControlled<IRoleForm>
                    name="name"
                    label={t("role_management.name")}
                    required
                />
            )}
        />
    );
};

export default RoleManagementForm;
