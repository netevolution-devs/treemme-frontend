import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import NationsList from "@features/panels/contacts/nations/NationsList.tsx";
import NationsForm from "@features/panels/contacts/nations/NationsForm.tsx";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";

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
