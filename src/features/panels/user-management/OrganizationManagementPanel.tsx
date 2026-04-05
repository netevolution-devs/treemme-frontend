import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import GroupManagementList from "@features/panels/user-management/GroupManagementList";
import GroupManagementForm from "@features/panels/user-management/GroupManagementForm";
import RoleManagementList from "@features/panels/user-management/RoleManagementList";
import RoleManagementForm from "@features/panels/user-management/RoleManagementForm";
import {Divider, Stack, Typography} from "@mui/material";

export interface IOrganizationManagementStoreState extends IPanelUIState {
    selectedGroupId?: number | null;
    selectedRoleId?: number | null;
}

const SectionTitle = ({title}: { title: string }) => (
    <>
        <Typography variant="h6">{title}</Typography>
        <Divider sx={{mb: 1}}/>
    </>
);

const OrganizationManagementPanel = () => {
    const initialUiState: IOrganizationManagementStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IOrganizationManagementStoreState>
            kind={"organization-management"}
            initialState={{uiState: initialUiState}}
        >
            <Stack spacing={4} sx={{p: 2}}>
                <div><SectionTitle title="Gruppi"/><GroupManagementList/><GroupManagementForm/></div>
                <div><SectionTitle title="Ruoli"/><RoleManagementList/><RoleManagementForm/></div>
            </Stack>
        </GenericPanel>
    )
}

export default OrganizationManagementPanel;
