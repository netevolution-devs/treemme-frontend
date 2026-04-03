import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import PaymentTypeForm from "@features/panels/commercial/payment-types/PaymentTypeForm.tsx";
import PaymentTypesList from "@features/panels/commercial/payment-types/PaymentTypesList.tsx";

export interface IPaymentTypesStoreState extends IPanelUIState {
    selectedPaymentId?: number | null;
}

const PaymentTypesPanel = () => {
    const initialUiState: IPaymentTypesStoreState = {
        isFormDisabled: true,
        buttonsState: BaseButtonState
    };

    return (
        <GenericPanel<unknown, IPaymentTypesStoreState>
            kind={"paymentTypes"}
            initialState={{uiState: initialUiState}}
            listComponent={<PaymentTypesList/>}
        >
            <PaymentTypeForm/>
        </GenericPanel>
    )
}

export default PaymentTypesPanel;
