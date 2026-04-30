import type {IBatch} from "@features/panels/production/batches/api/IBatch";
import type {
    IDeliveryNoteRow
} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/IDeliveryNoteRow";
import type {IOrderRow} from "@features/panels/orders/customer-orders/order-rows/api/IOrderRow";

export interface IBatchInOrderRow extends Pick<IBatch,
    'id' |
    'batch_code' |
    'batch_date' |
    'pieces' |
    'quantity'> {
    ddt_rows: IDeliveryNoteRow[]
}

export interface IOrderRowsSearch extends IOrderRow{
    batch_orders: {batch: IBatchInOrderRow};
}