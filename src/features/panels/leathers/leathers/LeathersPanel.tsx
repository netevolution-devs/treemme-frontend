import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import LeathersList from "@features/panels/leathers/leathers/LeathersList.tsx";
import LeathersForm from "@features/panels/leathers/leathers/LeathersForm.tsx";

export interface ILeathersStoreState extends IPanelUIState {
    selectedLeatherId?: number | null;
}

export interface ILeatherStoreFilter {
    filterProvenance?: string;
}

const LeathersPanel = () => {
    const initialUiState: ILeathersStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ILeathersStoreState>
            kind={"leathers"}
            initialState={{uiState: initialUiState}}
        >
            <LeathersList enableFilters/>
            <LeathersForm />
        </GenericPanel>
    )
}

export default LeathersPanel;
