import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import OriginsList from "@features/panels/leathers/origins/OriginsList";
import OriginsForm from "@features/panels/leathers/origins/OriginsForm";
import type {ILeathersStoreState} from "@features/panels/leathers/leathers/LeathersPanel";
import OriginsContent from "@features/panels/leathers/origins/OriginsContent";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface IOriginsStoreState extends IPanelUIState, ILeathersStoreState {
    selectedOriginId?: number | null;
}

const OriginsPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IOriginsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IOriginsStoreState>
            kind={"origins"}
            initialState={{uiState: initialUiState}}
            listComponent={<OriginsList/>}
        >
            <OriginsForm {...props.params}/>
            <OriginsContent/>
        </GenericPanel>
    )
}

export default OriginsPanel;
