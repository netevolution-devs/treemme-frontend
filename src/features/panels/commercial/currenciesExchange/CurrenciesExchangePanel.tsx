import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import CurrenciesList from "@features/panels/commercial/currenciesExchange/CurrenciesList.tsx";
import CurrenciesForm from "@features/panels/commercial/currenciesExchange/CurrenciesForm.tsx";
import CurrenciesExchangeList from "@features/panels/commercial/currenciesExchange/CurrenciesExchangeList.tsx";

export interface ICurrenciesExchangeStoreState extends IPanelUIState {
    selectedCurrencyId?: number | null;
}

const CurrenciesExchangePanel = () => {
    const initialUiState: ICurrenciesExchangeStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ICurrenciesExchangeStoreState>
            kind={"currenciesExchange"}
            initialState={{uiState: initialUiState}}
        >
            <CurrenciesList/>
            <CurrenciesForm/>
            <CurrenciesExchangeList/>
        </GenericPanel>
    )
}

export default CurrenciesExchangePanel;
