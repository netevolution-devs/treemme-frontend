export interface IGroupManagement {
    id: number;
    name: string;
    description: string | null;
}

export interface IGroupManagementPayload {
    name: string;
    description: string | null;
}
