import type {INation} from "@features/panels/contacts/nations/api/INation";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact";

export interface IContactAddress {
    id: number;
    address_name: string;
    nation: INation;
    // town: ICap;
    address: string;
    address_2: string;
    address_3: string;
    address_4: string;
    zip_code: string;
    default_address: boolean;
    // contact_id?: number;
    // weight?: number;
    different_destination: IContactAddress | null;
    different_destination_id: number | null;
    contact: IContact;
}