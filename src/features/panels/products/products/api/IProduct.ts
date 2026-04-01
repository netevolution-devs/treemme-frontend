import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";
import type {IMeasurementUnit} from "@features/panels/shared/api/measurement-unit/IMeasurementUnit.ts";
import type {IProductType} from "@features/panels/products/product-types/api/IProductType.ts";
import type {IColor} from "@features/panels/products/article-colors/api/IColor.ts";
import type {IProductCategory} from "@features/panels/products/product-categories/api/IProductCategory.ts";

export interface IProduct {
    id: number;
    product_code: string | null;
    name: string;
    internal_name: string;
    external_name: string;
    vendor_code: string | null;
    product_note: string | null;
    exclude_mrp: boolean ;
    alarm: number | null;
    stock_quantity: number | null;
    weight: number | null;
    thickness: number | null;
    use_coefficient: number | null;
    bill_of_material_quantity: number | null;
    last_cost: number | null;
    last_price: number | null;
    product_type: IProductType;
    product_category: IProductCategory;
    supplier: IContact;
    measurement_unit: IMeasurementUnit;
    color: IColor;
    weight_measurement_unit: IMeasurementUnit;
    thickness_measurement_unit: IMeasurementUnit;
    contact: IContact;
}