import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import GroupManagementList from "@features/panels/user-management/organization/group/GroupManagementList";
import GroupManagementForm from "@features/panels/user-management/organization/group/GroupManagementForm";
import RoleManagementList from "@features/panels/user-management/organization/role/RoleManagementList";
import RoleManagementForm from "@features/panels/user-management/organization/role/RoleManagementForm";
import {Stack, Typography} from "@mui/material";

export interface IOrganizationManagementStoreState extends IPanelUIState {
    selectedGroupId?: number | null;
    selectedRoleId?: number | null;
}

const SectionTitle = ({title}: { title: string }) => (
    <>
        <Typography variant="h6">{title}</Typography>
    </>
);

const OrganizationManagementPanel = () => {
    const initialUiState: IOrganizationManagementStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IOrganizationManagementStoreState>
            kind={"organization-management"}
            initialState={{uiState: initialUiState}}
        >
            <Stack spacing={2}>
                <Stack spacing={1}><SectionTitle title="Gruppi"/>
                    <GroupManagementList/>
                    <GroupManagementForm/>
                </Stack>
                <Stack spacing={1}>
                    <SectionTitle title="Ruoli"/>
                    <RoleManagementList/>
                    <RoleManagementForm/>
                </Stack>
            </Stack>
        </GenericPanel>
    )
}

export default OrganizationManagementPanel;
