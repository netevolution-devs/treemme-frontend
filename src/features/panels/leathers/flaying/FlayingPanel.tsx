import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import FlayingList from "@features/panels/leathers/flaying/FlayingList.tsx";
import FlayingForm from "@features/panels/leathers/flaying/FlayingForm.tsx";
import type {ILeathersStoreState} from "@features/panels/leathers/leathers/LeathersPanel.tsx";
import FlayingContent from "@features/panels/leathers/flaying/FlayingContent.tsx";

export interface IFlayingStoreState extends IPanelUIState, ILeathersStoreState {
    selectedFlayId?: number | null;
}

const FlayingPanel = () => {
    const initialUiState: IFlayingStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IFlayingStoreState>
            kind={"flaying"}
            initialState={{uiState: initialUiState}}
        >
            <FlayingList/>
            <FlayingForm/>
            <FlayingContent/>
        </GenericPanel>
    )
}

export default FlayingPanel;
