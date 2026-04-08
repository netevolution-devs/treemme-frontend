import {useTranslation} from "react-i18next";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import {groupManagementApi} from "@features/panels/user-management/organization/api/groupManagementApi";
import {roleManagementApi} from "@features/panels/user-management/organization/api/roleManagementApi";
import {workAreaManagementApi} from "@features/panels/user-management/work-area/api/workAreaManagementApi";
import {
    useAssignGroupAccess,
    useDeleteGroupAccess,
    useGetGroupAccessList,
    useUpdateGroupAccessForm,
    type IUserGroupAccess,
} from "@features/panels/user-management/users/api/userManagementApi";
import {usePanel} from "@ui/panel/PanelContext";
import GenericForm from "@features/panels/shared/GenericForm";
import type {IUserAccessStoreState} from "@features/panels/user-management/permission (legacy)/UserAccessPanel";

interface IAccessForm {
    group_id: number;
    role_id: number;
    work_area_id: number;
}

const emptyValues: IAccessForm = {group_id: 0, role_id: 0, work_area_id: 0};

const UserAccessForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IUserAccessStoreState>();
    const selectedAccessId = useStore(state => state.uiState.selectedAccessId);
    const setUIState = useStore(state => state.setUIState);

    const {data: accesses = []} = useGetGroupAccessList();
    const selectedAccess = accesses.find(a => a.id === selectedAccessId) ?? null;

    const {mutateAsync: createAccess, isPending: isPosting} = useAssignGroupAccess();
    const {mutateAsync: updateAccess, isPending: isPutting} = useUpdateGroupAccessForm();
    const {mutateAsync: deleteAccess, isPending: isDeleting} = useDeleteGroupAccess();

    const {data: groups = []} = groupManagementApi.useGetList();
    const {data: roles = []} = roleManagementApi.useGetList();
    const {data: workAreas = []} = workAreaManagementApi.useGetList();

    const groupOptions = groups.map(g => ({value: g.id, label: g.name}));
    const roleOptions = roles.map(r => ({value: r.id, label: r.name}));
    const workAreaOptions = workAreas.map(w => ({value: w.id, label: w.name}));

    const getFieldId = (field: IUserGroupAccess["group"] | IUserGroupAccess["work_area"]) =>
        Array.isArray(field) ? 0 : field.id;

    return (
        <GenericForm<IAccessForm, IUserGroupAccess, IUserAccessStoreState>
            resource="sistema - permessi"
            selectedId={selectedAccessId}
            entity={selectedAccess}
            emptyValues={emptyValues}
            mapEntityToForm={(a) => ({
                group_id: getFieldId(a.group),
                role_id: getFieldId(a.role),
                work_area_id: getFieldId(a.work_area),
            })}
            create={(payload) => createAccess(payload)}
            update={(id, payload) => updateAccess({id, ...payload})}
            remove={(id) => deleteAccess(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedAccessId: null})}
            renderFields={() => (
                <>
                    <SelectFieldControlled<IAccessForm>
                        name="group_id"
                        label={t("form:access_management.group_id")}
                        options={groupOptions}
                        required
                    />
                    <SelectFieldControlled<IAccessForm>
                        name="role_id"
                        label={t("form:access_management.role_id")}
                        options={roleOptions}
                        required
                    />
                    <SelectFieldControlled<IAccessForm>
                        name="work_area_id"
                        label={t("form:access_management.work_area_id")}
                        options={workAreaOptions}
                        required
                    />
                </>
            )}
        />
    );
};

export default UserAccessForm;
