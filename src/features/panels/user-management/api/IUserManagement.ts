export interface IUserManagement {
    id: number;
    user_code: string;
    email: string;
    last_access: string | null;
}

export interface IUserManagementPayload {
    email: string;
    password: string;
}