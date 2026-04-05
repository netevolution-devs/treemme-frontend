import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";
import OrderRowsForm from "@features/panels/orders/customer-orders/order-rows/OrderRowsForm";

export interface IOrderRowsStoreState extends IPanelUIState {
    selectedOrderRowId?: number | null;
}

export interface IOrderRowsStoreParams {
    client_order_id?: number;
    order_row_id?: number;
    panelId?: string;
}

const OrderRowsPanel = (props: IDockviewPanelProps<ICustomPanelProps<IOrderRowsStoreParams>>) => {
    const initialUiState: IOrderRowsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IOrderRowsStoreState>
            disableBorders
            kind={"orderRows"}
            initialState={{uiState: initialUiState}}
        >
            <OrderRowsForm {...props.params}/>
        </GenericPanel>
    )
}

export default OrderRowsPanel;
