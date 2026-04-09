import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import UsersList from "@features/panels/user-management/users/UsersList";
import UsersForm from "@features/panels/user-management/users/UsersForm";

export interface IUsersStoreState extends IPanelUIState {
    selectedUserId?: number | null;
}

const UsersPanel = () => {
    const initialUiState: IUsersStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IUsersStoreState>
            kind={"users"}
            initialState={{uiState: initialUiState}}
            listComponent={<UsersList/>}
        >
            <UsersForm/>
        </GenericPanel>
    )
}

export default UsersPanel;
