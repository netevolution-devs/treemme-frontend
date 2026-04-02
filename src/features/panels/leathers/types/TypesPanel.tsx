import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import TypesList from "@features/panels/leathers/types/TypesList.tsx";
import TypesForm from "@features/panels/leathers/types/TypesForm.tsx";
import type {ILeathersStoreState} from "@features/panels/leathers/leathers/LeathersPanel.tsx";
import TypesContent from "@features/panels/leathers/types/TypesContent.tsx";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";

export interface ITypesStoreState extends IPanelUIState, ILeathersStoreState {
    selectedTypeId?: number | null;
}

const TypesPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: ITypesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ITypesStoreState>
            kind={"types"}
            initialState={{uiState: initialUiState}}
            listComponent={<TypesList/>}
        >
            <TypesForm {...props.params}/>
            <TypesContent/>
        </GenericPanel>
    )
}

export default TypesPanel;
