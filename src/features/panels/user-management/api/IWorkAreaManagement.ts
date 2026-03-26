export interface IWorkAreaManagement {
    id: number;
    name: string;
    description: string | null;
}

export interface IWorkAreaManagementPayload {
    name: string;
    description: string | null;
}
