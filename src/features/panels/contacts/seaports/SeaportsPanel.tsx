import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import SeaPortsList from "@features/panels/contacts/seaports/SeaPortsList";
import SeaPortsForm from "@features/panels/contacts/seaports/SeaPortsForm";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";
import type {IDockviewPanelProps} from "dockview";

export interface ISeaportsStoreState extends IPanelUIState {
    selectedSeaPortId?: number | null;
}

const SeaportsPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: ISeaportsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ISeaportsStoreState>
            kind={"seaports"}
            initialState={{uiState: initialUiState}}
            listComponent={
                <SeaPortsList/>
            }
        >
            <SeaPortsForm {...props.params}/>
        </GenericPanel>
    )
}

export default SeaportsPanel;
