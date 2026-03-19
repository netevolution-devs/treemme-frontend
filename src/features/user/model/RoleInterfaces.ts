export const EnumRoles = {
    Admin: 'Admin',
    Staff: 'Staff',
} as const

export type IRoles = typeof EnumRoles[keyof typeof EnumRoles];

export interface IAccessControl {
    group: string;
    role: IRoles;
    resource: string;
    canGet: boolean;
    canPost: boolean;
    canPut: boolean;
    canDelete: boolean;
}

export interface IApiAccessControl {
    group: string;
    role: IRoles;
    work_area: string;
    can_get: boolean;
    can_post: boolean;
    can_put: boolean;
    can_delete: boolean;
}

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

export function AccessControlAdapter(apiAccessControl: IApiAccessControl): IAccessControl {
    return {
        group: apiAccessControl.group,
        role: apiAccessControl.role,
        resource: apiAccessControl.work_area,
        canGet: apiAccessControl.can_get,
        canPost: apiAccessControl.can_post,
        canPut: apiAccessControl.can_put,
        canDelete: apiAccessControl.can_delete,
    }
}

export function AccessControlArrayAdapter(apiAccessControl: IApiAccessControl[]): IAccessControl[] {
    return apiAccessControl.map(AccessControlAdapter);
}

export function UserRoleAdapter(apiUserRole: string): IUserRole {

    const tempId = 0
    //TODO using temp data
    return {
        associationId: tempId,
        role: {id:tempId, name:apiUserRole, description:apiUserRole},
        workArea: {id:tempId, name:apiUserRole, description:apiUserRole, active:true}
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

export function UserRoleArrayAdapter(apiUserRoles: (string | IApiUserRole)[]): IUserRole[] {
    return (apiUserRoles ?? [])
        .map(role => typeof role === 'string' ? UserRoleAdapter(role) : {
            associationId: role.id,
            role: RoleAdapter(role.role),
            workArea: WorkAreaAdapter(role.work_area)
        })
        .sort((a, b) => a.role.id - b.role.id);
}
