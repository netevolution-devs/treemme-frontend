import {Box, Typography} from "@mui/material";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled.tsx";
import {type IProductPayload, productsApi} from "@features/panels/products/products/api/productsApi.ts";
import {productTypeApi} from "@features/panels/products/product-types/api/productTypeApi.ts";
import {measurementUnitApi} from "@features/panels/shared/api/measurement-unit/measurementUnitApi.ts";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import type {IProduct} from "@features/panels/products/products/api/IProduct.ts";
import type {IProductsStoreState} from "@features/panels/products/products/ProductsPanel.tsx";
import TextFieldValue from "@ui/form/controlled/TextFieldValue.tsx";
import {productCategoryApi} from "@features/panels/products/product-categories/api/productCategoryApi.ts";

export type IProductForm = Omit<IProduct, "id"
    | "product_type"
    | "supplier"
    | "measurement_unit"
    | "color"
    | "weight_measurement_unit"
    | "thickness_measurement_unit"
    | "contact"
    | "product_category"
    | "alarm"
    | "stock_quantity"
> & {
    product_type_id: number;
    supplier_id: number;
    measurement_unit_id: number;
    color_id: number;
    contact_id: number;
    product_category_id: number;
    weight_measurement_unit_id: number;
    thickness_measurement_unit_id: number;
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
    const {data: productCategories = []} = productCategoryApi.useGetList();
    // const {data: colors = []} = colorApi.useGetList();
    const {data: measurementUnits = []} = measurementUnitApi.useGetList();
    const {data: suppliers = []} = contactsApi.useGetList({queryParams: {type: "supplier"}});

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
                // alarm: 0,
                // stock_quantity: 0,
                weight: null,
                thickness: null,
                use_coefficient: null,
                bill_of_material_quantity: null,
                last_cost: null,
                last_price: null,
                product_type_id: 0,
                supplier_id: 0,
                measurement_unit_id: 0,
                color_id: 0,
                weight_measurement_unit_id: 0,
                thickness_measurement_unit_id: 0,
                product_category_id: 0,
                contact_id: 0,
            } as IProductForm}
            create={(payload) => createProduct(payload as IProductPayload)}
            update={(id, payload) => updateProduct({id, payload: payload as IProductPayload})}
            remove={(id) => deleteProduct(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedProductId: null})}
            mapEntityToForm={(p) => ({
                name: p.name,
                internal_name: p.internal_name,
                external_name: p.external_name,
                vendor_code: p.vendor_code,
                product_note: p.product_note,
                exclude_mrp: p.exclude_mrp,
                weight: p.weight,
                thickness: p.thickness,
                use_coefficient: p.use_coefficient,
                bill_of_material_quantity: p.bill_of_material_quantity,
                last_cost: p.last_cost,
                last_price: p.last_price,
                product_category_id: p.product_category?.id,
                product_type_id: p.product_type?.id,
                supplier_id: p.supplier?.id,
                measurement_unit_id: p.measurement_unit?.id,
                color_id: p.color?.id,
                contact_id: p.contact?.id,
                weight_measurement_unit_id: p.weight_measurement_unit?.id,
                thickness_measurement_unit_id: p.thickness_measurement_unit?.id,
            } as IProductForm)}
            renderFields={() => (
                <>
                    {/* Generals */}
                    <Box sx={{display: 'flex', gap: 1, flexDirection: 'column'}}>
                        <Typography variant="h6">{t("products.generals")}</Typography>
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                            <TextFieldValue
                                label={t("products.product_code")}
                                value={product?.product_code as string}
                                isFilled={!!selectedProductId}
                            />
                            <TextFieldValue
                                label={t("products.stock_quantity")}
                                value={product?.stock_quantity as number}
                                isFilled={!!selectedProductId}
                                precision={2}
                            />
                        </Box>

                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                            <TextFieldControlled<IProductForm>
                                label={t("products.vendor_code")}
                                name={"vendor_code"}
                            />
                            <SelectFieldControlled<IProductForm>
                                label={t("products.supplier")}
                                name={"supplier_id"}
                                options={suppliers.map(c => ({value: c.id, label: c.name}))}
                            />
                            <FlagCheckBoxFieldControlled<IProductForm>
                                label={t("products.exclude_mrp")}
                                name={"exclude_mrp"}
                                width={120}
                            />
                        </Box>

                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                            <SelectFieldControlled<IProductForm>
                                label={t("products.product_category")}
                                name={"product_category_id"}
                                options={productCategories.map(pc => ({value: pc.id, label: `${pc.code} - ${pc.name}`}))}
                            />
                            <SelectFieldControlled<IProductForm>
                                label={t("products.product_type")}
                                name={"product_type_id"}
                                options={productTypes.map(pt => ({value: pt.id, label: `${pt.code} - ${pt.name}`}))}
                            />
                            <SelectFieldControlled<IProductForm>
                                label={t("products.measurement_unit")}
                                name={"measurement_unit_id"}
                                options={measurementUnits.map(mu => ({value: mu.id, label: mu.name}))}
                            />
                        </Box>

                        <TextFieldControlled<IProductForm>
                            label={t("products.name")}
                            name={"name"}
                        />
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                            <TextFieldControlled<IProductForm>
                                label={t("products.internal_name")}
                                name={"internal_name"}
                            />
                            <TextFieldControlled<IProductForm>
                                label={t("products.external_name")}
                                name={"external_name"}
                            />
                        </Box>

                        {/*<Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>*/}
                        {/*    <SelectFieldControlled<IProductForm>*/}
                        {/*        label={t("products.contact")}*/}
                        {/*        name={"contact_id"}*/}
                        {/*        options={contacts.map(c => ({value: c.id, label: c.name}))}*/}
                        {/*    />*/}
                        {/*</Box>*/}

                        {/*<Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>*/}
                        {/*    <SelectFieldControlled<IProductForm>*/}
                        {/*        label={t("products.color")}*/}
                        {/*        name={"color_id"}*/}
                        {/*        options={colors.map(c => ({value: c.id, label: c.color}))}*/}
                        {/*    />*/}
                        {/*</Box>*/}

                        <TextFieldControlled<IProductForm>
                            label={t("products.product_note")}
                            name={"product_note"}
                            TextFieldProps={{multiline: true, rows: 2}}
                        />
                    </Box>

                    {/* Technical data */}
                    <Box sx={{display: 'flex', gap: 1, flexDirection: 'column'}}>
                        <Typography variant="h6">{t("products.technical")}</Typography>
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                            <NumberFieldControlled<IProductForm>
                                label={t("products.weight")}
                                name={"weight"}
                            />
                            <SelectFieldControlled<IProductForm>
                                label={t("products.weight_measurement")}
                                name={"weight_measurement_unit_id"}
                                options={measurementUnits.map(mu => ({value: mu.id, label: mu.name}))}
                            />
                            <NumberFieldControlled<IProductForm>
                                label={t("products.thickness")}
                                name={"thickness"}
                            />
                            <SelectFieldControlled<IProductForm>
                                label={t("products.thickness_measurement")}
                                name={"thickness_measurement_unit_id"}
                                options={measurementUnits.map(mu => ({value: mu.id, label: mu.name}))}
                            />
                        </Box>

                        {/*<NumberFieldControlled<IProductForm>*/}
                        {/*    label={t("products.alarm")}*/}
                        {/*    name={"alarm"}*/}
                        {/*/>*/}

                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                        </Box>

                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                            <NumberFieldControlled<IProductForm>
                                label={t("products.use_coefficient")}
                                name={"use_coefficient"}
                            />
                            <NumberFieldControlled<IProductForm>
                                label={t("products.bill_of_material_quantity")}
                                name={"bill_of_material_quantity"}
                            />
                        </Box>

                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                            <NumberFieldControlled<IProductForm>
                                label={t("products.last_cost")}
                                name={"last_cost"}
                            />
                            <NumberFieldControlled<IProductForm>
                                label={t("products.last_price")}
                                name={"last_price"}
                            />
                        </Box>
                    </Box>

                </>
            )}
        />
    );
};

export default ProductsForm;