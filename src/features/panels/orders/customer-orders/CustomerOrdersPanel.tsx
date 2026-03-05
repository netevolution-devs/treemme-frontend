import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import CustomerOrdersList from "@features/panels/orders/customer-orders/CustomerOrdersList.tsx";

export interface ICustomerOrdersStoreState extends IPanelUIState {
    selectedCustomerOrderId?: number | null;
}

const CustomerOrdersPanel = () => {
    const initialUiState: ICustomerOrdersStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ICustomerOrdersStoreState>
            kind={"customerOrders"}
            initialState={{uiState: initialUiState}}
        >
            <CustomerOrdersList/>
            <div>Form placeholder for Customer-orders</div>
        </GenericPanel>
    )
}

export default CustomerOrdersPanel;
