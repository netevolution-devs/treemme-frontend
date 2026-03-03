import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import SpeciesList from "@features/panels/leathers/species/SpeciesList.tsx";
import SpeciesForm from "@features/panels/leathers/species/SpeciesForm.tsx";
import type {ILeathersStoreState} from "@features/panels/leathers/leathers/LeathersPanel.tsx";
import SpeciesContent from "@features/panels/leathers/species/SpeciesContent.tsx";

export interface ISpeciesStoreState extends IPanelUIState, ILeathersStoreState {
    selectedSpeciesId?: number | null;
}

const SpeciesPanel = () => {
    const initialUiState: ISpeciesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ISpeciesStoreState>
            kind={"species"}
            initialState={{uiState: initialUiState}}
        >
            <SpeciesList/>
            <SpeciesForm/>
            <SpeciesContent/>
        </GenericPanel>
    )
}

export default SpeciesPanel;
