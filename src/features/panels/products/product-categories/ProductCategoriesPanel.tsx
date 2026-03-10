import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface IProductCategoriesStoreState extends IPanelUIState {
    _placeholder?: string;
}

const ProductCategoriesPanel = () => {
    const initialUiState: IProductCategoriesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IProductCategoriesStoreState>
            kind={"productCategories"}
            initialState={{uiState: initialUiState}}
        >
            <div>List placeholder for ProductCategories</div>
            <div>Form placeholder for ProductCategories</div>
        </GenericPanel>
    )
}

export default ProductCategoriesPanel;
