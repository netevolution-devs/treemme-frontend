export interface ISeaPort {
    id: number;
    name: string;
    note: string | null;
    ductible_day: number | null;
    parking_day_cost: number | null;
    container_deductible_day: number | null;
    container_parking_day_cost: number | null;
}