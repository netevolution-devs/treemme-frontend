import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {
    IProductCategoriesStoreState
} from "@features/panels/products/product-categories/ProductCategoriesPanel";
import {productCategoryApi} from "@features/panels/products/product-categories/api/productCategoryApi";
import type {MRT_ColumnDef} from "material-react-table";
import {useMemo} from "react";
import type {IProductCategory} from "@features/panels/products/product-categories/api/IProductCategory";
import GenericList from "@features/panels/shared/GenericList";

const ProductCategoriesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IProductCategoriesStoreState>();
    const selectedProductCategoryId = useStore(state => state.uiState.selectedProductCategoryId);
    const setUIState = useStore(state => state.setUIState);

    const {data: productCategories = [], isLoading, isFetching} = productCategoryApi.useGetList();

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
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedProductCategoryId}
            onRowSelect={(id) => setUIState({selectedProductCategoryId: id})}
        />
    )
}

export default ProductCategoriesList;