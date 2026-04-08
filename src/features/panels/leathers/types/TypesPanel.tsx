import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import TypesList from "@features/panels/leathers/types/TypesList";
import TypesForm from "@features/panels/leathers/types/TypesForm";
import type {ILeathersStoreState} from "@features/panels/leathers/leathers/LeathersPanel";
import TypesContent from "@features/panels/leathers/types/TypesContent";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

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
