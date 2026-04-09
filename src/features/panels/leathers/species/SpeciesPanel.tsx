import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import SpeciesList from "@features/panels/leathers/species/SpeciesList";
import SpeciesForm from "@features/panels/leathers/species/SpeciesForm";
import type {ILeathersStoreState} from "@features/panels/leathers/leathers/LeathersPanel";
import SpeciesContent from "@features/panels/leathers/species/SpeciesContent";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface ISpeciesStoreState extends IPanelUIState, ILeathersStoreState {
    selectedSpeciesId?: number | null;
}

const SpeciesPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: ISpeciesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ISpeciesStoreState>
            kind={"species"}
            initialState={{uiState: initialUiState}}
            listComponent={<SpeciesList/>}
        >
            <SpeciesForm {...props.params}/>
            <SpeciesContent/>
        </GenericPanel>
    )
}

export default SpeciesPanel;
