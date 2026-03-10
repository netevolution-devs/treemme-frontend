import type {IProduct} from "@features/panels/products/products/api/IProduct.ts";
import type {IMeasurementUnit} from "@features/panels/shared/api/measurement-unit/IMeasurementUnit.ts";

export interface IOrderRow {
    id: number;
    product: IProduct;
    measurement_unit: IMeasurementUnit
    processed: boolean;
    cancelled: boolean;
    weight: number | null;
    quantity: number;
    price: number | null;
    total_price: number | null;
    currency_price: number | null;
    currency_exchange: number | null;
    total_currency_price: number | null;
    agent_percentage_row: number | null;
    tolerance_quantity_percentage: number | null;
    shipment_schedule: number | null;
    production_schedule: number | null;
    delivery_date_request: string | null;
    delivery_date_confirmed: string | null;
}