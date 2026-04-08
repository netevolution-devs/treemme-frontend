import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import ProductTypesList from "@features/panels/products/product-types/ProductTypesList";
import ProductTypesForm from "@features/panels/products/product-types/ProductTypesForm";

export interface IProductTypesStoreState extends IPanelUIState {
    selectedProductTypeId?: number | null;
}

const ProductTypesPanel = () => {
    const initialUiState: IProductTypesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IProductTypesStoreState>
            kind={"productTypes"}
            initialState={{uiState: initialUiState}}
        >
            <ProductTypesList/>
            <ProductTypesForm/>
        </GenericPanel>
    )
}

export default ProductTypesPanel;
