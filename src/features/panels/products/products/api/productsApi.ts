import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IProduct} from "@features/panels/products/products/api/IProduct.ts";
import type {IProductForm} from "@features/panels/products/products/ProductsForm.tsx";

export type IProductPayload = IProductForm;

export const productsApi = createPanelApi<IProduct, IProductPayload>({
    baseEndpoint: "/product",
    queryKey: "PRODUCT",
});