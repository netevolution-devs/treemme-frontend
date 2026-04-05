import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import ThicknessesList from "@features/panels/leathers/thicknesses/ThicknessesList";
import ThicknessesForm from "@features/panels/leathers/thicknesses/ThicknessesForm";
import type {ILeathersStoreState} from "@features/panels/leathers/leathers/LeathersPanel";
import ThicknessesContent from "@features/panels/leathers/thicknesses/ThicknessesContent";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface IThicknessesStoreState extends IPanelUIState, ILeathersStoreState {
    selectedThicknessId?: number | null;
}

const ThicknessesPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IThicknessesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IThicknessesStoreState>
            kind={"thicknesses"}
            initialState={{uiState: initialUiState}}
            listComponent={<ThicknessesList/>}
        >
            <ThicknessesForm {...props.params}/>
            <ThicknessesContent/>
        </GenericPanel>
    )
}

export default ThicknessesPanel;
