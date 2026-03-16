import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import SubcontractingNotReturnedList
    from "@features/panels/shipping-invoicing/subcontracting-not-returned/SubcontractingNotReturnedList.tsx";

export interface ISubcontractingNotReturnedStoreState extends IPanelUIState {
    selectedSubcontractingNotReturnedId?: number | null;
}

const SubcontractingNotReturnedPanel = () => {
    const initialUiState: ISubcontractingNotReturnedStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ISubcontractingNotReturnedStoreState>
            kind={"subcontractingNotReturned"}
            initialState={{uiState: initialUiState}}
        >
            <SubcontractingNotReturnedList/>
        </GenericPanel>
    )
}

export default SubcontractingNotReturnedPanel;
