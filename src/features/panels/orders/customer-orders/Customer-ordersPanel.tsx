import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface ICustomerOrdersStoreState extends IPanelUIState {
    _placeholder?: string;
}

const CustomerOrdersPanel = () => {
    const initialUiState: ICustomerOrdersStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ICustomerOrdersStoreState>
            kind={"customerOrders"}
            initialState={{uiState: initialUiState}}
        >
            <div>List placeholder for Customer-orders</div>
            <div>Form placeholder for Customer-orders</div>
        </GenericPanel>
    )
}

export default CustomerOrdersPanel;
