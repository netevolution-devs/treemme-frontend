import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IProductsStoreState} from "@features/panels/products/products/ProductsPanel";
import {productsApi} from "@features/panels/products/products/api/productsApi";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IProduct} from "@features/panels/products/products/api/IProduct";
import GenericList from "@features/panels/shared/GenericList";

const ProductsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IProductsStoreState>();
    const selectedProductId = useStore(state => state.uiState.selectedProductId);
    const setUIState = useStore(state => state.setUIState);

    const {data: products = [], isLoading, isFetching} = productsApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IProduct>[]>(() => [
        {
            accessorKey: "name",
            header: t("products.name"),
        }
    ], [t]);

    return (
        <GenericList<IProduct>
            data={products}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedProductId}
            onRowSelect={(id) => setUIState({selectedProductId: id})}
        />
    )
}

export default ProductsList;