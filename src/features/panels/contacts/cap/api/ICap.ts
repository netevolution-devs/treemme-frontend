import type {IProvince} from "@features/panels/contacts/province/api/IProvince";

export interface ICap {
    id: number;
    cap: string;
    name: string;
    province: IProvince;
}