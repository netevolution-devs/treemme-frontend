import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ProductsList from "@features/panels/products/products/ProductsList.tsx";
import ProductsForm from "@features/panels/products/products/ProductsForm.tsx";

export interface IProductsStoreState extends IPanelUIState {
    selectedProductId?: number | null;
}

const ProductsPanel = () => {
    const initialUiState: IProductsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IProductsStoreState>
            kind={"products"}
            initialState={{uiState: initialUiState}}
        >
            <ProductsList/>
            <ProductsForm/>
        </GenericPanel>
    )
}

export default ProductsPanel;
