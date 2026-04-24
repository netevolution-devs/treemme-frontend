import type {INation} from "@features/panels/contacts/nations/api/INation";

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
    // contact_id?: number;
    // weight?: number;
}