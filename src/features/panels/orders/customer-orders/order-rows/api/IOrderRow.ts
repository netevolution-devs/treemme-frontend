import type {IMeasurementUnit} from "@features/panels/shared/api/measurement-unit/IMeasurementUnit.ts";
import type {IArticle} from "@features/panels/products/articles/api/IArticle.ts";
import type {ICustomerOrder} from "@features/panels/orders/customer-orders/api/ICustomerOrder.ts";

export interface IOrderRow {
    id: number;
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
    article: IArticle;
    client_order: ICustomerOrder;
    available_quantity: number;
}