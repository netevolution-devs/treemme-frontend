import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface IPaymentTypesStoreState extends IPanelUIState {
    _placeholder?: string;
}

const PaymentTypesPanel = () => {
    const initialUiState: IPaymentTypesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IPaymentTypesStoreState>
            kind={"paymentTypes"}
            initialState={{uiState: initialUiState}}
            listComponent={<div>List placeholder for PaymentTypes</div>}
        >
            <div>Form placeholder for PaymentTypes</div>
        </GenericPanel>
    )
}

export default PaymentTypesPanel;
