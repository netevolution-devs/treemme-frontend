import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import {Box} from "@mui/material";
import GenericPanel from "@features/panels/shared/GenericPanel";
import CustomerOrdersList from "@features/panels/orders/customer-orders/CustomerOrdersList";

import CustomerOrdersForm from "@features/panels/orders/customer-orders/CustomerOrdersForm";
import OrderRowsList from "@features/panels/orders/customer-orders/order-rows/OrderRowsList";

export interface ICustomerOrdersStoreState extends IPanelUIState {
    selectedClientId?: number | null;
    selectedCustomerOrderId?: number | null;
    selectedOrderRowId?: number | null;
}

export interface ICustomerOrdersFilters {
    filterOrderCode?: string;
    filterOrderClientId?: number;
}

const CustomerOrdersPanel = () => {
    const initialUiState: ICustomerOrdersStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<ICustomerOrdersFilters, ICustomerOrdersStoreState>
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
