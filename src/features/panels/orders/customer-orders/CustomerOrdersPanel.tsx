import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import {Box} from "@mui/material";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import CustomerOrdersList from "@features/panels/orders/customer-orders/CustomerOrdersList.tsx";

import CustomerOrdersForm from "@features/panels/orders/customer-orders/CustomerOrdersForm.tsx";
import OrderRowsList from "@features/panels/orders/customer-orders/order-rows/OrderRowsList.tsx";

export interface ICustomerOrdersStoreState extends IPanelUIState {
    selectedCustomerOrderId?: number | null;
    selectedOrderRowId?: number | null;
}

const CustomerOrdersPanel = () => {
    const initialUiState: ICustomerOrdersStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ICustomerOrdersStoreState>
            kind={"customerOrders"}
            initialState={{uiState: initialUiState}}
            listComponent={<CustomerOrdersList/>}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 2,
                alignItems: 'flex-start'
            }}>
                <Box sx={{flex: '1 1 600px', minWidth: 0}}>
                    <CustomerOrdersForm/>
                </Box>
                <Box sx={{flex: '1 1 600px', minWidth: 0}}>
                    <OrderRowsList/>
                </Box>
            </Box>
        </GenericPanel>
    )
}

export default CustomerOrdersPanel;
