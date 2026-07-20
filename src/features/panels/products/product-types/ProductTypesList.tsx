import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IProductTypesStoreState} from "@features/panels/products/product-types/ProductTypesPanel";
import {productTypeApi} from "@features/panels/products/product-types/api/productTypeApi";
import type {MRT_ColumnDef} from "material-react-table";
import {useMemo} from "react";
import type {IProductType} from "@features/panels/products/product-types/api/IProductType";
import GenericList from "@features/panels/shared/GenericList";
import ListToolbar from "@features/panels/shared/ListToolbar";

const ProductTypesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IProductTypesStoreState>();
    const selectedProductTypeId = useStore(state => state.uiState.selectedProductTypeId);
    const setUIState = useStore(state => state.setUIState);

    const {data: productTypes = [], isLoading, isFetching} = productTypeApi.useGetList();
    const exportMutation = productTypeApi.useExport();

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
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedProductTypeId}
            onRowSelect={(id) => setUIState({selectedProductTypeId: id})}
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar: () => (
                    <ListToolbar
                        onExport={() => exportMutation.mutate()}
                        exportLoading={exportMutation.isPending}
                    />
                )
            }}
        />
    )
}

export default ProductTypesList;