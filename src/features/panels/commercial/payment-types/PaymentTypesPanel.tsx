import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import PaymentTypeForm from "@features/panels/commercial/payment-types/PaymentTypeForm.tsx";
import PaymentTypesList from "@features/panels/commercial/payment-types/PaymentTypesList.tsx";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";

export interface IPaymentTypesStoreState extends IPanelUIState {
    selectedPaymentId?: number | null;
}

const PaymentTypesPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
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
            <PaymentTypeForm {...props.params}/>
        </GenericPanel>
    )
}

export default PaymentTypesPanel;
