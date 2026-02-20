import type {IProvince} from "@features/panels/contacts/province/api/IProvince.ts";

export interface ICap {
    id: number;
    cap: string;
    name: string;
    province: IProvince;
}