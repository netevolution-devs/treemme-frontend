import type {IThickness} from "@features/panels/leathers/thicknesses/api/IThickness";

export interface ILeatherType {
    id: number;
    name: string;
    code: string;
    thickness?: IThickness;
}