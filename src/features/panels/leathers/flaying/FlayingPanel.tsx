import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import FlayingList from "@features/panels/leathers/flaying/FlayingList";
import FlayingForm from "@features/panels/leathers/flaying/FlayingForm";
import type {ILeathersStoreState} from "@features/panels/leathers/leathers/LeathersPanel";
import FlayingContent from "@features/panels/leathers/flaying/FlayingContent";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface IFlayingStoreState extends IPanelUIState, ILeathersStoreState {
    selectedFlayId?: number | null;
}

const FlayingPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IFlayingStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IFlayingStoreState>
            kind={"flaying"}
            initialState={{uiState: initialUiState}}
            listComponent={<FlayingList/>}
        >
            <FlayingForm {...props.params}/>
            <FlayingContent/>
        </GenericPanel>
    )
}

export default FlayingPanel;
