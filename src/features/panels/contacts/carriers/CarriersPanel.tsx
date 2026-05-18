
import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel"; 
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";
import type {IDockviewPanelProps} from "dockview";
import CarriersList from "@features/panels/contacts/carriers/CarriersList";
import CarriersForm from "@features/panels/contacts/carriers/CarriersForm";

export interface ICarriersStoreState extends IPanelUIState {
    selectedCarrierId?: number | null;
}

const CarriersPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: ICarriersStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ICarriersStoreState>
            kind={"carriers"}
            uuid={props.api.id}
            initialState={{uiState: initialUiState}}
            listComponent={<CarriersList/>}
        >
            <CarriersForm/>
        </GenericPanel>
    )
}

export default CarriersPanel;
