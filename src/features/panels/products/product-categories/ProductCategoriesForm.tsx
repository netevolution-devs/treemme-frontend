import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {
    IProductCategoriesStoreState
} from "@features/panels/products/product-categories/ProductCategoriesPanel";
import {productCategoryApi} from "@features/panels/products/product-categories/api/productCategoryApi";
import GenericForm from "@features/panels/shared/GenericForm";
import type {IProductCategory} from "@features/panels/products/product-categories/api/IProductCategory";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import {Box} from "@mui/material";

export type IProductCategoryForm = Omit<IProductCategory, 'id'>;

const ProductCategoriesForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IProductCategoriesStoreState>();
    const selectedProductCategoryId = useStore(state => state.uiState.selectedProductCategoryId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = productCategoryApi;
    const {data: productCategory} = useGetDetail(selectedProductCategoryId);
    const {mutateAsync: createProductCategory, isPending: isPosting} = usePost();
    const {mutateAsync: updateProductCategory, isPending: isPutting} = usePut();
    const {mutateAsync: deleteProductCategory, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IProductCategoryForm, IProductCategory, IProductCategoriesStoreState>
            resource="articoli - categorie"
            selectedId={selectedProductCategoryId}
            entity={productCategory}
            emptyValues={{
                name: '',
                code: '',
                note: '',
            }}
            mapEntityToForm={(x) => ({
                name: x.name,
                code: x.code ?? '',
                note: x.note ?? '',
            })}
            create={(payload) => createProductCategory(payload)}
            update={(id, payload) => updateProductCategory({id, payload})}
            remove={(id) => deleteProductCategory(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedProductCategoryId: null})}
            validateBeforeSave={(v) => !!v.name && !!v.code}
            renderFields={() => (
                <>
                    <Box sx={{display: 'flex', gap: 1}}>
                        <TextFieldControlled<IProductCategoryForm>
                            name={"code"}
                            label={t("products.categories.code")}
                            required
                        />
                        <TextFieldControlled<IProductCategoryForm>
                            name={"name"}
                            label={t("products.categories.name")}
                            required
                        />
                    </Box>
                    <TextFieldControlled<IProductCategoryForm>
                        name={"note"}
                        label={t("contacts.notes")}
                        TextFieldProps={{multiline: true, rows: 2}}
                    />
                </>
            )}
        />
    )
}

export default ProductCategoriesForm;