import type {IContact} from "@features/panels/contacts/contacts/api/IContact";
import type {IUser} from "@features/user/model/UserInterfaces";
import type {IPayment} from "@features/panels/commercial/payment-types/api/IPayment";
import type {
    IShipmentCondition
} from "@features/panels/commercial/shipment-conditions/api/IShipmentCondition";
import type {IContactAddress} from "@features/panels/contacts/contacts/api/contacts-address/IContactAddress";
import type {IOrderRow} from "@features/panels/orders/customer-orders/order-rows/api/IOrderRow";

export interface ICustomerOrder {
    id: number;
    client: IContact;
    agent?: IContact;
    payment: IPayment;
    check_user: IUser;
    processed: boolean;
    cancelled: boolean;
    checked: boolean;
    order_number: string;
    order_date: string;
    percentage_agent: number;
    client_order_number: string;
    client_order_date: string;
    agent_order_number: string;
    agent_order_date: string;
    // percentage_tolerance_quantity: number;
    order_note: string;
    order_note_iso: string;
    order_note_production: string;
    order_note_administration: string;
    check_date: string;
    printed: boolean;
    print_date: string;
    shipment_condition: IShipmentCondition;
    address: IContactAddress;
    client_order_rows: IOrderRow[];
}