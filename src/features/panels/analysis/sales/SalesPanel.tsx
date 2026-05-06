import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel";
import SalesList from "@features/panels/analysis/sales/SalesList";

export interface ISalesStoreState extends IPanelUIState {
    selectedOrderRowSoldId?: number | null;
}

export interface ISalesStoreFilter {
    filterStartDate?: string;
    filterEndDate?: string;
    filterClientId?: number;
}

const SalesPanel = () => {
    const initialUiState: ISalesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<ISalesStoreFilter, ISalesStoreState>
            kind={"sales"}
            initialState={{uiState: initialUiState}}
            listComponent={<SalesList/>}
        />
    )
}

export default SalesPanel;
