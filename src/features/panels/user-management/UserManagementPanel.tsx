import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import GenericTabContent from "@features/panels/shared/GenericTabContent.tsx";
import UserManagementList from "@features/panels/user-management/UserManagementList.tsx";
import UserManagementForm from "@features/panels/user-management/UserManagementForm.tsx";
import GroupManagementList from "@features/panels/user-management/GroupManagementList.tsx";
import GroupManagementForm from "@features/panels/user-management/GroupManagementForm.tsx";
import RoleManagementList from "@features/panels/user-management/RoleManagementList.tsx";
import RoleManagementForm from "@features/panels/user-management/RoleManagementForm.tsx";
import WorkAreaManagementList from "@features/panels/user-management/WorkAreaManagementList.tsx";
import WorkAreaManagementForm from "@features/panels/user-management/WorkAreaManagementForm.tsx";
import UserAccessForm from "@features/panels/user-management/UserAccessForm.tsx";
import UserAccessList from "@features/panels/user-management/UserAccessList.tsx";
import {Divider, Stack, Typography} from "@mui/material";

export interface IUserManagementStoreState extends IPanelUIState {
    selectedUserId?: number | null;
    selectedGroupId?: number | null;
    selectedRoleId?: number | null;
    selectedWorkAreaId?: number | null;
    selectedAccessId?: number | null;
}

const SectionTitle = ({title}: { title: string }) => (
    <>
        <Typography variant="h6">{title}</Typography>
        <Divider sx={{mb: 1}}/>
    </>
);

const Permissions = () => (
    <Stack spacing={4}>
        <div><SectionTitle title="Gruppi"/><GroupManagementList/><GroupManagementForm/></div>
        <div><SectionTitle title="Ruoli"/><RoleManagementList/><RoleManagementForm/></div>
        <div><SectionTitle title="Funzionalità"/><WorkAreaManagementList/><WorkAreaManagementForm/></div>
    </Stack>
);

const UserManagementPanel = () => {
    const initialUiState: IUserManagementStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    const tabs = [
        {
            label: "Accessi",
            component: (<><UserAccessList/><UserAccessForm/></>),
        },
        {
            label: "Utenti",
            component: (<><UserManagementList/><UserManagementForm/></>),
        },
        {
            label: "Dettagli",
            component: (<Permissions/>),
        },
    ];

    return (
        <GenericPanel<unknown, IUserManagementStoreState>
            kind={"user-management"}
            initialState={{uiState: initialUiState}}
        >
            <GenericTabContent tabs={tabs}/>
        </GenericPanel>
    )
}

export default UserManagementPanel;
