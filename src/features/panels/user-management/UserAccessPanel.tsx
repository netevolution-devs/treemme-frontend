import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import UserAccessForm from "@features/panels/user-management/UserAccessForm.tsx";
import UserAccessList from "@features/panels/user-management/UserAccessList.tsx";

export interface IUserAccessStoreState extends IPanelUIState {
    selectedAccessId?: number | null;
}

const UserAccessPanel = () => {
    const initialUiState: IUserAccessStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IUserAccessStoreState>
            kind={"user-access-management"}
            initialState={{uiState: initialUiState}}
            listComponent={<UserAccessList/>}
        >
            <UserAccessForm/>
        </GenericPanel>
    )
}

export default UserAccessPanel;
