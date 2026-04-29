import type {IMeasurementUnit} from "@features/panels/shared/api/measurement-unit/IMeasurementUnit";
import type {IArticle} from "@features/panels/products/articles/api/IArticle";
import type {ICustomerOrder} from "@features/panels/orders/customer-orders/api/ICustomerOrder";
import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency";
import type {ISelection} from "@features/panels/products/selection/api/ISelection";

export interface IOrderRow {
    id: number;
    measurement_unit: IMeasurementUnit
    currency?: ICurrency | null;
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
    production_row_note: string | null;
    administration_row_note: string | null;
    delivery_date_request: string | null;
    delivery_date_confirmed: string | null;
    article: IArticle;
    client_order: ICustomerOrder;
    available_quantity: number;
    selection: ISelection;
}