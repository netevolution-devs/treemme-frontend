import type {IWeight} from "@features/panels/leathers/weights/api/IWeight.ts";
import type {ISpecies} from "@features/panels/leathers/species/api/ISpecies.ts";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";
import type {IThickness} from "@features/panels/leathers/thicknesses/api/IThickness.ts";
import type {IFlay} from "@features/panels/leathers/flaying/api/IFlay.ts";
import type {ILeatherType} from "@features/panels/leathers/types/api/ILeatherType.ts";
import type {IOrigin} from "@features/panels/leathers/origins/api/IOrigin.ts";
import type {ITanningStage} from "@features/panels/leathers/tanning-stages/api/ITanningStage.ts";

export interface ILeather {
    id: number;
    weight: IWeight;
    species: ISpecies;
    contact: IContact;
    supplier: IContact;
    thickness: IThickness;
    flay: IFlay;
    type: ILeatherType;
    provenance: IOrigin;
    status: ITanningStage;
    code: string;
    name: string;
    sqft_leather_min: number;
    sqft_leather_max: number;
    sqft_leather_media: number;
    sqft_leather_expected: number;
    kg_leather_min: number;
    kg_leather_max: number;
    kg_leather_media: number;
    kg_leather_expected: number;
    container_piece: number;
    statistic_update: boolean;
    crust_revenue_expected: number;
}