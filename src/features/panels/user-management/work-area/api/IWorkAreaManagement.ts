export interface IWorkAreaGroupRoleAccess {
    id: number;
    group: { id: number; name: string };
    role: { id: number; name: string };
    can_get: boolean;
    can_post: boolean;
    can_put: boolean;
    can_delete: boolean;
    check_order: boolean;
}

export interface IWorkAreaManagement {
    id: number;
    name: string;
    description: string | null;
    group_role_work_areas?: IWorkAreaGroupRoleAccess[];
}

export interface IWorkAreaManagementPayload {
    name: string;
    description: string | null;
}
