import {useTranslation} from "react-i18next";
import type {IWorkAreaManagement, IWorkAreaManagementPayload} from "@features/panels/user-management/work-area/api/IWorkAreaManagement";
import {usePanel} from "@ui/panel/PanelContext";
import {workAreaManagementApi} from "@features/panels/user-management/work-area/api/workAreaManagementApi";
import GenericForm from "@features/panels/shared/GenericForm";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import type {
    IFunctionalityManagementStoreState
} from "@features/panels/user-management/work-area/WorkAreaPanel";
import WorkAreaPermissions from "@features/panels/user-management/work-area/WorkAreaPermissions";
import type {ResourceName} from "@features/authz/permission.utils";

type IWorkAreaForm = IWorkAreaManagementPayload;

const WorkAreaManagementForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IFunctionalityManagementStoreState>();
    const selectedWorkAreaId = useStore(state => state.uiState.selectedWorkAreaId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = workAreaManagementApi;
    const {data: workArea} = useGetDetail(selectedWorkAreaId);
    const {mutateAsync: createWorkArea, isPending: isPosting} = usePost();
    const {mutateAsync: updateWorkArea, isPending: isPutting} = usePut();
    const {mutateAsync: deleteWorkArea, isPending: isDeleting} = useDelete();

    return (
        <>
            <GenericForm<IWorkAreaForm, IWorkAreaManagement, IFunctionalityManagementStoreState>
                resource={"sistema - permessi"}
                selectedId={selectedWorkAreaId}
                entity={workArea}
                emptyValues={{name: "", description: ""}}
                mapEntityToForm={(w) => ({
                    name: w.name,
                    description: w.description,
                })}
                create={(payload) => createWorkArea(payload)}
                update={(id, payload) => updateWorkArea({id, payload})}
                remove={(id) => deleteWorkArea(id)}
                isSaving={isPosting || isPutting}
                isDeleting={isDeleting}
                onClearSelection={() => setUIState({selectedWorkAreaId: null})}
                validateBeforeSave={(v) => !!v.name}
                renderFields={() => (
                    <>
                        <TextFieldControlled<IWorkAreaForm>
                            name="name"
                            label={t("work_area_management.name")}
                            required
                        />
                        <TextFieldControlled<IWorkAreaForm>
                            name="description"
                            label={t("work_area_management.description")}
                            TextFieldProps={{multiline: true, rows: 2}}
                        />
                    </>
                )}
            />
            {selectedWorkAreaId && workArea && (
                <WorkAreaPermissions
                    workAreaId={selectedWorkAreaId}
                    workAreaAsResource={workArea.name.toLowerCase() as ResourceName}
                    groupRoleWorkAreas={workArea.group_role_work_areas ?? []}
                />
            )}
        </>
    );
};

export default WorkAreaManagementForm;
