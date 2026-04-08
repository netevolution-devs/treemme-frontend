import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import CurrenciesList from "@features/panels/commercial/currenciesExchange/CurrenciesList";
import CurrenciesForm from "@features/panels/commercial/currenciesExchange/CurrenciesForm";
import CurrenciesExchangeList from "@features/panels/commercial/currenciesExchange/exchange/CurrenciesExchangeList";
import {Box} from "@mui/material";

export interface ICurrenciesExchangeStoreState extends IPanelUIState {
    selectedCurrencyId?: number | null;
    selectedCurrencyExchangeId?: number | null;
}

const CurrenciesExchangePanel = () => {
    const initialUiState: ICurrenciesExchangeStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ICurrenciesExchangeStoreState>
            kind={"currenciesExchange"}
            initialState={{uiState: initialUiState}}
            listComponent={<CurrenciesList/>}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                gap: 2,
                width: '100%'
            }}>
                <Box sx={{
                    minWidth: '600px',
                    flex: '1 1 600px',
                }}>
                    <CurrenciesForm/>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: "column",
                    flex: '1 1 350px',
                    gap: 1,
                    overflow: 'hidden',
                    minWidth: '300px',
                }}>
                    <CurrenciesExchangeList/>
                </Box>
            </Box>
        </GenericPanel>
    )
}

export default CurrenciesExchangePanel;
