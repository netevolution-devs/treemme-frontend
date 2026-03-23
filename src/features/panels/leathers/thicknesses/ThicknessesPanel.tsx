import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ThicknessesList from "@features/panels/leathers/thicknesses/ThicknessesList.tsx";
import ThicknessesForm from "@features/panels/leathers/thicknesses/ThicknessesForm.tsx";
import type {ILeathersStoreState} from "@features/panels/leathers/leathers/LeathersPanel.tsx";
import ThicknessesContent from "@features/panels/leathers/thicknesses/ThicknessesContent.tsx";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";

export interface IThicknessesStoreState extends IPanelUIState, ILeathersStoreState {
    selectedThicknessId?: number | null;
}

const ThicknessesPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IThicknessesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IThicknessesStoreState>
            kind={"thicknesses"}
            initialState={{uiState: initialUiState}}
        >
            <ThicknessesList/>
            <ThicknessesForm {...props.params}/>
            <ThicknessesContent/>
        </GenericPanel>
    )
}

export default ThicknessesPanel;
