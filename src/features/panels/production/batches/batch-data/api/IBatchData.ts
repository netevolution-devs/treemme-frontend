import type {ISeaPort} from "@features/panels/contacts/seaports/api/ISeaPort";
import type {IBatch} from "@features/panels/production/batches/api/IBatch";
import type {IShipmentCondition} from "@features/panels/commercial/shipment-conditions/api/IShipmentCondition";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact";
import type {IPallet} from "@features/panels/warehouse/pallets/api/IPallet";
import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency";

export interface IBatchData {
    id: number;
    sea_port: ISeaPort | null;
    pallet: IPallet | null;
    delivery_date: string | null;
    amount: number;
    currency_exchange: number | null;
    payment_date: string | null;
    sea_port_date: string | null;
    declared_gross_weight: number | null;
    declared_net_weight: number | null;
    declared_average_weight: number | null;
    founded_gross_weight: number | null;
    founded_net_weight: number | null;
    founded_average_weight: number | null;
    container_code: string | null;
    shipping_cost: number | null;
    pallet_number: string | null;
    pallet_weight: number | null;
    batch: IBatch;
    shipment_condition: IShipmentCondition;
    shipment_subcontractor: IContact;
    currency: ICurrency;
}