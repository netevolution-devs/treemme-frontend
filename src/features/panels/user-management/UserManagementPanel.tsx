import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import UserManagementList from "@features/panels/user-management/UserManagementList";
import UserManagementForm from "@features/panels/user-management/UserManagementForm";

export interface IUserManagementStoreState extends IPanelUIState {
    selectedUserId?: number | null;
}

const UserManagementPanel = () => {
    const initialUiState: IUserManagementStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IUserManagementStoreState>
            kind={"user-management"}
            initialState={{uiState: initialUiState}}
            listComponent={<UserManagementList/>}
        >
            <UserManagementForm/>
        </GenericPanel>
    )
}

export default UserManagementPanel;
