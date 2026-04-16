import type {IBatch} from "@features/panels/production/batches/api/IBatch";
import type {IMeasurementUnit} from "@features/panels/shared/api/measurement-unit/IMeasurementUnit";
import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency";

import type {ISelection} from "@features/panels/products/selection/api/ISelection";
import type {IWorking} from "@features/panels/production/workings/api/IWorking";

export interface IDeliveryNoteRow {
    id: number;
    batch: IBatch;
    measurement_unit: IMeasurementUnit;
    selection: ISelection | null;
    order_note: string;
    pieces: number;
    currency: ICurrency | null;
    quantity: number;
    price: number | null;
    total_value: number | null;
    currency_price: number | null;
    currency_exchange: number | null;
    currency_total_value: number | null;
    kg_weight: number | null;
    row_note: string | null;
    whole_piece: number | null;
    half_piece: number | null;
    processing: IWorking | null;
    stock_pieces: number;
}