import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import ShipmentConditionForm from "@features/panels/commercial/shipment-conditions/ShipmentConditionForm";
import ShipmentConditionsList from "@features/panels/commercial/shipment-conditions/ShipmentConditionsList";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface IShipmentConditionsStoreState extends IPanelUIState {
    selectedConditionId?: number | null;
}

const ShipmentConditionsPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
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
            <ShipmentConditionForm {...props.params}/>
        </GenericPanel>
    )
}

export default ShipmentConditionsPanel;
