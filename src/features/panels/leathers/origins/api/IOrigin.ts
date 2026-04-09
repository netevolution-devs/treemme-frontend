import type {IFlay} from "@features/panels/leathers/flaying/api/IFlay";
import type {INation} from "@features/panels/contacts/nations/api/INation";
import type {IOriginArea} from "@features/panels/leathers/origins/api/origin-area/IOriginArea";

export interface IOrigin {
    id: number;
    code: string;
    area: IOriginArea;
    nation: INation;
    flay: IFlay;
    trip_day: number;
    psp_yield_coefficient: number;
    grain_yield_coefficient: number;
    crust_yield_coefficient: number;
    raw_yield_coefficient: number;
    rind_yield_coefficient: number;
    sea_shipment: boolean;
}