import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import UsersList from "@features/panels/user-management/users/UsersList";
import UsersForm from "@features/panels/user-management/users/UsersForm";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface IUsersStoreState extends IPanelUIState {
    selectedUserId?: number | null;
}

const UsersPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IUsersStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IUsersStoreState>
            kind={"users"}
            uuid={props.api.id}
            initialState={{uiState: initialUiState}}
            listComponent={<UsersList/>}
        >
            <UsersForm/>
        </GenericPanel>
    )
}

export default UsersPanel;
