import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IProductCategory} from "@features/panels/products/product-categories/api/IProductCategory";

export const productCategoryApi = createPanelApi<IProductCategory>({
    baseEndpoint: "/product-category",
    queryKey: "PRODUCT-CATEGORY"
});