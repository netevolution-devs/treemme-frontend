import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ProductCategoriesList from "@features/panels/products/product-categories/ProductCategoriesList.tsx";
import ProductCategoriesForm from "@features/panels/products/product-categories/ProductCategoriesForm.tsx";

export interface IProductCategoriesStoreState extends IPanelUIState {
    selectedProductCategoryId?: number | null;
}

const ProductCategoriesPanel = () => {
    const initialUiState: IProductCategoriesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IProductCategoriesStoreState>
            kind={"productCategories"}
            initialState={{uiState: initialUiState}}
        >
            <ProductCategoriesList/>
            <ProductCategoriesForm/>
        </GenericPanel>
    )
}

export default ProductCategoriesPanel;
