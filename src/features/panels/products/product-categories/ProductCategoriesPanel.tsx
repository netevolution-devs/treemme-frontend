import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import ProductCategoriesList from "@features/panels/products/product-categories/ProductCategoriesList";
import ProductCategoriesForm from "@features/panels/products/product-categories/ProductCategoriesForm";

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
