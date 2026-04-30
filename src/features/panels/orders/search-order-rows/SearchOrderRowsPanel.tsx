import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import SearchOrderRowsList from "@features/panels/orders/search-order-rows/SearchOrderRowsList";

export interface ISearchOrderRowsStoreState extends IPanelUIState {
    _placeholder?: string;
}

const SearchOrderRowsPanel = () => {
    const initialUiState: ISearchOrderRowsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ISearchOrderRowsStoreState>
            kind={"searchOrderRows"}
            initialState={{uiState: initialUiState}}
            listComponent={<SearchOrderRowsList/>}
        />
    )
}

export default SearchOrderRowsPanel;
