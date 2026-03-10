import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IProductTypesStoreState} from "@features/panels/products/product-types/ProductTypesPanel.tsx";
import {productTypeApi} from "@features/panels/products/product-types/api/productTypeApi.ts";
import type {MRT_ColumnDef} from "material-react-table";
import {useMemo} from "react";
import type {IProductType} from "@features/panels/products/product-types/api/IProductType.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";

const ProductTypesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IProductTypesStoreState>();
    const selectedProductTypeId = useStore(state => state.uiState.selectedProductTypeId);
    const setUIState = useStore(state => state.setUIState);

    const {data: productTypes = [], isLoading} = productTypeApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IProductType>[]>(() => [
        {
            accessorKey: "code",
            header: t("products.types.code")
        },
        {
            accessorKey: "name",
            header: t("products.types.name")
        }
    ], [t]);

    return (
        <GenericList<IProductType>
            data={productTypes}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedProductTypeId}
            onRowSelect={(id) => setUIState({selectedProductTypeId: id})}
        />
    )
}

export default ProductTypesList;