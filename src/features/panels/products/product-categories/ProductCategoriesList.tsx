import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {
    IProductCategoriesStoreState
} from "@features/panels/products/product-categories/ProductCategoriesPanel.tsx";
import {productCategoryApi} from "@features/panels/products/product-categories/api/productCategoryApi.ts";
import type {MRT_ColumnDef} from "material-react-table";
import {useMemo} from "react";
import type {IProductCategory} from "@features/panels/products/product-categories/api/IProductCategory.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";

const ProductCategoriesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IProductCategoriesStoreState>();
    const selectedProductCategoryId = useStore(state => state.uiState.selectedProductCategoryId);
    const setUIState = useStore(state => state.setUIState);

    const {data: productCategories = [], isLoading} = productCategoryApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IProductCategory>[]>(() => [
        {
            accessorKey: "code",
            header: t("products.categories.code")
        },
        {
            accessorKey: "name",
            header: t("products.categories.name")
        }
    ], [t]);

    return (
        <GenericList<IProductCategory>
            data={productCategories}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedProductCategoryId}
            onRowSelect={(id) => setUIState({selectedProductCategoryId: id})}
        />
    )
}

export default ProductCategoriesList;