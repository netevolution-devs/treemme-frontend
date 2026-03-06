import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IProduct} from "@features/panels/products/products/api/IProduct.ts";

export const productsApi = createPanelApi<IProduct>({
    baseEndpoint: "/product",
    queryKey: "PRODUCT",
});