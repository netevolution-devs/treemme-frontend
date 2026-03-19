import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IProductCategory} from "@features/panels/products/product-categories/api/IProductCategory.ts";

export const productCategoryApi = createPanelApi<IProductCategory>({
    baseEndpoint: "/product-category",
    queryKey: "PRODUCT-CATEGORY"
});