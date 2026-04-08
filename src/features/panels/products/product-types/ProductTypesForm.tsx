import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IProductTypesStoreState} from "@features/panels/products/product-types/ProductTypesPanel";
import {productTypeApi} from "@features/panels/products/product-types/api/productTypeApi";
import GenericForm from "@features/panels/shared/GenericForm";
import type {IProductType} from "@features/panels/products/product-types/api/IProductType";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import {Box} from "@mui/material";

export type IProductTypeForm = Omit<IProductType, 'id'>;

const ProductTypesForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IProductTypesStoreState>();
    const selectedProductTypeId = useStore(state => state.uiState.selectedProductTypeId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = productTypeApi;
    const {data: productType} = useGetDetail(selectedProductTypeId);
    const {mutateAsync: createProductType, isPending: isPosting} = usePost();
    const {mutateAsync: updateProductType, isPending: isPutting} = usePut();
    const {mutateAsync: deleteProductType, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IProductTypeForm, IProductType, IProductTypesStoreState>
            resource="articoli - tipologie prodotti"
            selectedId={selectedProductTypeId}
            entity={productType}
            emptyValues={{
                name: '',
                code: '',
            }}
            mapEntityToForm={(x) => ({
                name: x.name,
                code: x.code,
            })}
            create={(payload) => createProductType(payload)}
            update={(id, payload) => updateProductType({id, payload})}
            remove={(id) => deleteProductType(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedProductTypeId: null})}
            validateBeforeSave={(v) => !!v.name && !!v.code}
            renderFields={() => (
                <>
                    <Box sx={{display: 'flex', gap: 1}}>
                        <TextFieldControlled<IProductTypeForm>
                            name={"code"}
                            label={t("products.types.code")}
                            required
                        />
                        <TextFieldControlled<IProductTypeForm>
                            name={"name"}
                            label={t("products.types.name")}
                            required
                        />
                    </Box>
                </>
            )}
        />
    )
}

export default ProductTypesForm;