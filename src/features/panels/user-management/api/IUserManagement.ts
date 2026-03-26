export interface IUserManagementGroup {
    id: number;
    name: string;
    description: string | null;
}

export interface IUserManagementGroupUser {
    group: IUserManagementGroup;
}

export interface IUserManagement {
    id: number;
    user_code: string;
    email: string;
    last_access: string | null;
    group_users: IUserManagementGroupUser[];
}

export interface IUserManagementPayload {
    email: string;
    password: string;
}