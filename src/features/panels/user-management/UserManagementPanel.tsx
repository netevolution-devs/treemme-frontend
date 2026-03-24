import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import UserManagementList from "@features/panels/user-management/UserManagementList.tsx";
import UserManagementForm from "@features/panels/user-management/UserManagementForm.tsx";

export interface IUserManagementStoreState extends IPanelUIState {
    selectedUserId?: number | null;
}

const UserManagementPanel = () => {
    const initialUiState: IUserManagementStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IUserManagementStoreState>
            kind={"user-management"}
            initialState={{uiState: initialUiState}}
        >
            <UserManagementList />
            <UserManagementForm />
        </GenericPanel>
    )
}

export default UserManagementPanel;
