export const EnumRoles = {
    Admin: 'Admin',
    Staff: 'Staff',
    User: 'User',
} as const

export type IRoles = typeof EnumRoles[keyof typeof EnumRoles];

export interface IUserRole {
    associationId: number;
    role: IRole;
    workArea: IWorkArea;
}

export interface IRole {
    id: number;
    name: string;
    description: string;
}

export interface IWorkArea {
    id: number;
    name: string;
    description: string;
    active: boolean;
}

export interface IApiUserRole {
    id: number;
    role: IApiRole;
    work_area: IApiWorkArea;
}

export interface IApiRole {
    id: number;
    name: string;
    description: string;
}

export interface IApiWorkArea {
    id: number;
    name: string;
    description: string;
    active: boolean;
}

export function UserRoleAdapter(apiUserRole: IApiUserRole): IUserRole {
    return {
        associationId: apiUserRole.id,
        role: RoleAdapter(apiUserRole.role),
        workArea: WorkAreaAdapter(apiUserRole.work_area)
    }
}

export function RoleAdapter(apiRole: IApiRole): IRole {
    return {
        id: apiRole.id,
        name: apiRole.name,
        description: apiRole.description,
    }
}

export function WorkAreaAdapter(apiWorkArea: IApiWorkArea): IWorkArea {
    return {
        id: apiWorkArea.id,
        name: apiWorkArea.name,
        description: apiWorkArea.description,
        active: apiWorkArea.active,
    }
}

export function UserRoleArrayAdapter(apiUserRoles: IApiUserRole[]): IUserRole[] {
    return apiUserRoles
        .map(UserRoleAdapter)
        .sort((a, b) => a.role.id - b.role.id);
}
