import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import OriginsList from "@features/panels/leathers/origins/OriginsList.tsx";
import OriginsForm from "@features/panels/leathers/origins/OriginsForm.tsx";
import type {ILeathersStoreState} from "@features/panels/leathers/leathers/LeathersPanel.tsx";
import OriginsContent from "@features/panels/leathers/origins/OriginsContent.tsx";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";

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
