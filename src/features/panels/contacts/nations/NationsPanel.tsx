import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import NationsList from "@features/panels/contacts/nations/NationsList";
import NationsForm from "@features/panels/contacts/nations/NationsForm";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface INationsStoreState extends IPanelUIState {
    selectedNationId?: number | null;
}

const NationsPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: INationsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, INationsStoreState>
            kind={"nations"}
            initialState={{uiState: initialUiState}}
            listComponent={
                <NationsList/>
            }
        >
            <NationsForm {...props.params}/>
        </GenericPanel>
    )
}

export default NationsPanel;
