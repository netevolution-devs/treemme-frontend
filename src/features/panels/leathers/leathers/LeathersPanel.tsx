import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import LeathersList from "@features/panels/leathers/leathers/LeathersList.tsx";
import LeathersForm from "@features/panels/leathers/leathers/LeathersForm.tsx";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";

export interface ILeathersStoreState extends IPanelUIState {
    selectedLeatherId?: number | null;
}

export interface ILeatherStoreFilter {
    filterProvenance?: string;
}

export interface ILeatherStoreParams {
    leatherId?: number;
}

const LeathersPanel = (props: IDockviewPanelProps<ICustomPanelProps<ILeatherStoreParams>>) => {
    const initialUiState: ILeathersStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ILeathersStoreState>
            kind={"leathers"}
            initialState={{uiState: initialUiState}}
            listComponent={
                <LeathersList enableFilters={false}/>
            }
        >
            <LeathersForm {...props.params}/>
        </GenericPanel>
    )
}

export default LeathersPanel;
