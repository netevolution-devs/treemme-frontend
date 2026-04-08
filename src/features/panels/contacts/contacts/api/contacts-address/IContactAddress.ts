import type {INation} from "@features/panels/contacts/nations/api/INation";
import type {ICap} from "@features/panels/contacts/cap/api/ICap";

export interface IContactAddress {
    id: number;
    address_name: string;
    nation: INation;
    town: ICap;
    address: string;
    address_2: string;
    address_3: string;
    address_4: string;
    // contact_id?: number;
    // weight?: number;
}