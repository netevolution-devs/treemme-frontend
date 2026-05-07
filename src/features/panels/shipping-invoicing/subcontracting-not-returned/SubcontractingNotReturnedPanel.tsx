import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import SubcontractingNotReturnedList
    from "@features/panels/shipping-invoicing/subcontracting-not-returned/SubcontractingNotReturnedList";

export interface ISubcontractingNotReturnedStoreFilter {
    filterStartDate?: string;
    filterEndDate?: string;
    filterSubcontractorId?: number;
}

export interface ISubcontractingNotReturnedStoreState extends IPanelUIState {
    selectedSubcontractingNotReturnedId?: number | null;
}

const SubcontractingNotReturnedPanel = () => {
    const initialUiState: ISubcontractingNotReturnedStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<ISubcontractingNotReturnedStoreFilter, ISubcontractingNotReturnedStoreState>
            kind={"subcontractingNotReturned"}
            initialState={{uiState: initialUiState}}
            listComponent={<SubcontractingNotReturnedList/>}
        />
    )
}

export default SubcontractingNotReturnedPanel;
