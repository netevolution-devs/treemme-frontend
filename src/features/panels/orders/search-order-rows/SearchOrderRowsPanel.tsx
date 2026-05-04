import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import SearchOrderRowsList from "@features/panels/orders/search-order-rows/SearchOrderRowsList";

export interface ISearchOrderRowsStoreState extends IPanelUIState {
    selectedOrderRowId?: number | null;
}

export interface ISearchOrderRowsFilters {
    filterStartDate?: string | undefined;
    filterEndDate?: string | undefined;
    filterShippingStatus?: "to_ship" | "shipped" | undefined;
    filterProductionStatus?: "to_produce" | "produced" | undefined;
    filterPrintStatus?: "to_print" | "printed" | undefined;
    filterClientId?: number | undefined;
}

const SearchOrderRowsPanel = () => {
    const initialUiState: ISearchOrderRowsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<ISearchOrderRowsFilters, ISearchOrderRowsStoreState>
            kind={"searchOrderRows"}
            initialState={{uiState: initialUiState}}
            listComponent={<SearchOrderRowsList/>}
        />
    )
}

export default SearchOrderRowsPanel;
