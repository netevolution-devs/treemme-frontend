import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ShipmentConditionForm from "@features/panels/commercial/shipment-conditions/ShipmentConditionForm.tsx";
import ShipmentConditionsList from "@features/panels/commercial/shipment-conditions/ShipmentConditionsList.tsx";

export interface IShipmentConditionsStoreState extends IPanelUIState {
    selectedConditionId?: number | null;
}

const ShipmentConditionsPanel = () => {
    const initialUiState: IShipmentConditionsStoreState = {
        isFormDisabled: true,
        buttonsState: BaseButtonState
    };

    return (
        <GenericPanel<unknown, IShipmentConditionsStoreState>
            kind={"shipmentConditions"}
            initialState={{uiState: initialUiState}}
            listComponent={<ShipmentConditionsList/>}
        >
            <ShipmentConditionForm/>
        </GenericPanel>
    )
}

export default ShipmentConditionsPanel;
