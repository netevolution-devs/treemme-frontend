import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import UserAccessForm from "@features/panels/user-management/permission (legacy)/UserAccessForm";
import UserAccessList from "@features/panels/user-management/permission (legacy)/UserAccessList";

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
