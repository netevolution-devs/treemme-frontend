import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface IShipmentConditionsStoreState extends IPanelUIState {
    _placeholder?: string;
}

const ShipmentConditionsPanel = () => {
    const initialUiState: IShipmentConditionsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IShipmentConditionsStoreState>
            kind={"shipmentConditions"}
            initialState={{uiState: initialUiState}}
            listComponent={<div>List placeholder for ShipmentConditions</div>}
        >
            <div>Form placeholder for ShipmentConditions</div>
        </GenericPanel>
    )
}

export default ShipmentConditionsPanel;
