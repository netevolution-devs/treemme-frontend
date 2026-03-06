import {Box} from "@mui/material";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled.tsx";
import {type IProductPayload, productsApi} from "@features/panels/products/products/api/productsApi.ts";
import {productTypeApi} from "@features/panels/products/products/api/product-type/productTypeApi.ts";
import {colorApi} from "@features/panels/products/products/api/color/colorApi.ts";
import {measurementUnitApi} from "@features/panels/shared/api/measurement-unit/measurementUnitApi.ts";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import type {IProduct} from "@features/panels/products/products/api/IProduct.ts";
import type {IProductsStoreState} from "@features/panels/products/products/ProductsPanel.tsx";

export type IProductForm = Omit<IProduct, "id" 
    | "product_type" 
    | "supplier" 
    | "measurement_unit" 
    | "color" 
    | "weight_measurement" 
    | "thickness_measurement" 
    | "contact"
> & {
    product_type_id: number;
    supplier_id: number;
    measurement_unit_id: number;
    color_id: number;
    weight_measurement_id: number;
    thickness_measurement_id: number;
    contact_id: number;
};

const ProductsForm = () => {
    const {t} = useTranslation(["form"]);
    const {useStore} = usePanel<unknown, IProductsStoreState>();
    const selectedProductId = useStore(state => state.uiState.selectedProductId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = productsApi;
    const {data: product} = useGetDetail(selectedProductId);
    const {mutateAsync: createProduct, isPending: isPosting} = usePost();
    const {mutateAsync: updateProduct, isPending: isPutting} = usePut();
    const {mutateAsync: deleteProduct, isPending: isDeleting} = useDelete();
    
    const {data: productTypes = []} = productTypeApi.useGetList();
    const {data: colors = []} = colorApi.useGetList();
    const {data: measurementUnits = []} = measurementUnitApi.useGetList();
    const {data: contacts = []} = contactsApi.useGetList();

    return (
        <GenericForm<IProductForm, IProduct, IProductsStoreState>
            selectedId={selectedProductId}
            entity={product}
            emptyValues={{
                product_code: "",
                name: "",
                internal_name: "",
                external_name: "",
                vendor_code: "",
                product_note: "",
                exclude_mrp: false,
                alarm: 0,
                stock_quantity: 0,
                weight: 0,
                thickness: 0,
                use_coefficient: 0,
                bill_of_material_quantity: 0,
                last_cost: 0,
                last_price: 0,
                product_type_id: 0,
                supplier_id: 0,
                measurement_unit_id: 0,
                color_id: 0,
                weight_measurement_id: 0,
                thickness_measurement_id: 0,
                contact_id: 0,
            } as IProductForm}
            create={(payload) => createProduct(payload as IProductPayload)}
            update={(id, payload) => updateProduct({id, payload: payload as IProductPayload})}
            remove={(id) => deleteProduct(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedProductId: null})}
            mapEntityToForm={(p) => ({
                ...p,
                product_type_id: p.product_type?.id,
                supplier_id: p.supplier?.id,
                measurement_unit_id: p.measurement_unit?.id,
                color_id: p.color?.id,
                weight_measurement_id: p.weight_measurement?.id,
                thickness_measurement_id: p.thickness_measurement?.id,
                contact_id: p.contact?.id,
            } as IProductForm)}
            renderFields={() => (
                <>
                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                        <TextFieldControlled<IProductForm>
                            label={t("products.product_code")}
                            name={"product_code"}
                        />
                        <TextFieldControlled<IProductForm>
                            label={t("products.name")}
                            name={"name"}
                        />
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, mt: 1}}>
                        <TextFieldControlled<IProductForm>
                            label={t("products.internal_name")}
                            name={"internal_name"}
                        />
                        <TextFieldControlled<IProductForm>
                            label={t("products.external_name")}
                            name={"external_name"}
                        />
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, mt: 1}}>
                        <TextFieldControlled<IProductForm>
                            label={t("products.vendor_code")}
                            name={"vendor_code"}
                        />
                        <SelectFieldControlled<IProductForm>
                            label={t("products.product_type")}
                            name={"product_type_id"}
                            options={productTypes.map(pt => ({value: pt.id, label: pt.name}))}
                        />
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, mt: 1}}>
                        <SelectFieldControlled<IProductForm>
                            label={t("products.supplier")}
                            name={"supplier_id"}
                            options={contacts.map(c => ({value: c.id, label: c.name}))}
                        />
                        <SelectFieldControlled<IProductForm>
                            label={t("products.contact")}
                            name={"contact_id"}
                            options={contacts.map(c => ({value: c.id, label: c.name}))}
                        />
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, mt: 1}}>
                        <SelectFieldControlled<IProductForm>
                            label={t("products.measurement_unit")}
                            name={"measurement_unit_id"}
                            options={measurementUnits.map(mu => ({value: mu.id, label: mu.name}))}
                        />
                        <SelectFieldControlled<IProductForm>
                            label={t("products.color")}
                            name={"color_id"}
                            options={colors.map(c => ({value: c.id, label: c.color}))}
                        />
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, mt: 1}}>
                        <NumberFieldControlled<IProductForm>
                            label={t("products.alarm")}
                            name={"alarm"}
                        />
                        <NumberFieldControlled<IProductForm>
                            label={t("products.stock_quantity")}
                            name={"stock_quantity"}
                        />
                        <FlagCheckBoxFieldControlled<IProductForm>
                            label={t("products.exclude_mrp")}
                            name={"exclude_mrp"}
                            width={150}
                        />
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, mt: 1}}>
                        <NumberFieldControlled<IProductForm>
                            label={t("products.weight")}
                            name={"weight"}
                        />
                        <SelectFieldControlled<IProductForm>
                            label={t("products.weight_measurement")}
                            name={"weight_measurement_id"}
                            options={measurementUnits.map(mu => ({value: mu.id, label: mu.name}))}
                        />
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, mt: 1}}>
                        <NumberFieldControlled<IProductForm>
                            label={t("products.thickness")}
                            name={"thickness"}
                        />
                        <SelectFieldControlled<IProductForm>
                            label={t("products.thickness_measurement")}
                            name={"thickness_measurement_id"}
                            options={measurementUnits.map(mu => ({value: mu.id, label: mu.name}))}
                        />
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, mt: 1}}>
                        <NumberFieldControlled<IProductForm>
                            label={t("products.use_coefficient")}
                            name={"use_coefficient"}
                        />
                        <NumberFieldControlled<IProductForm>
                            label={t("products.bill_of_material_quantity")}
                            name={"bill_of_material_quantity"}
                        />
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, mt: 1}}>
                        <NumberFieldControlled<IProductForm>
                            label={t("products.last_cost")}
                            name={"last_cost"}
                        />
                        <NumberFieldControlled<IProductForm>
                            label={t("products.last_price")}
                            name={"last_price"}
                        />
                    </Box>

                    <Box sx={{mt: 1}}>
                        <TextFieldControlled<IProductForm>
                            label={t("products.product_note")}
                            name={"product_note"}
                            TextFieldProps={{multiline: true, rows: 2}}
                        />
                    </Box>
                </>
            )}
        />
    );
};

export default ProductsForm;