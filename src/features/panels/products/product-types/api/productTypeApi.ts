import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IProductType} from "@features/panels/products/product-types/api/IProductType.ts";

export const productTypeApi = createPanelApi<IProductType>({
    baseEndpoint: "/product-type",
    queryKey: "PRODUCT-TYPE"
});