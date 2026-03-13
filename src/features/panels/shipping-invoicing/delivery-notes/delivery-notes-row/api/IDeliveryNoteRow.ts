import type {IBatch} from "@features/panels/production/batches/api/IBatch.ts";
import type {IMeasurementUnit} from "@features/panels/shared/api/measurement-unit/IMeasurementUnit.ts";
import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency.ts";

export interface IDeliveryNoteRow {
    id: number;
    batch: IBatch;
    measurement_unit: IMeasurementUnit;
    order_note: string;
    pieces: number;
    currency: ICurrency | null;
    quantity: number;
    total_value: number | null;
    currency_price: number | null;
    currency_total_value: number | null;
    kg_weight: number | null;
    row_note: string | null;
    whole_piece: number | null;
    half_piece: number | null;
}