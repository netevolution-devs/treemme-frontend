import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IProductType} from "@features/panels/products/product-types/api/IProductType";

export const productTypeApi = createPanelApi<IProductType>({
    baseEndpoint: "/product-type",
    queryKey: "PRODUCT-TYPE"
});