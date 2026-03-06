import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";
import type {IMeasurementUnit} from "@features/panels/shared/api/measurement-unit/IMeasurementUnit.ts";
import type {IProductType} from "@features/panels/products/products/api/product-type/IProductType.ts";
import type {IColor} from "@features/panels/products/products/api/color/IColor.ts";

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
    supplier: IContact;
    measurement_unit: IMeasurementUnit;
    color: IColor;
    weight_measurement: IMeasurementUnit;
    thickness_measurement: IMeasurementUnit;
    contact: IContact;
}