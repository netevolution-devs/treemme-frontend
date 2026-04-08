import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IProduct} from "@features/panels/products/products/api/IProduct";
import type {IProductForm} from "@features/panels/products/products/ProductsForm";

export type IProductPayload = IProductForm;

export const productsApi = createPanelApi<IProduct, IProductPayload>({
    baseEndpoint: "/product",
    queryKey: "PRODUCT",
});