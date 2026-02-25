import type {IAccessControl, IRoles} from "@features/user/model/RoleInterfaces.ts";

export type PermissionMode = "any" | "all";

export interface IPermissionCheck {
    requiredRoles?: IRoles[];
    deniedRoles?: IRoles[];
    requiredRolesMode?: PermissionMode;
    deniedRolesMode?: PermissionMode;
}

const hasAllRoles = (
    accessControl: IAccessControl[],
    roles: IRoles[]
): boolean => {
    const userRoles = new Set(accessControl.map(ac => ac.role));
    return roles.every(role => userRoles.has(role));
};

const hasAnyRole = (
    accessControl: IAccessControl[],
    roles: IRoles[]
): boolean => {
    const userRoles = new Set(accessControl.map(ac => ac.role));
    return roles.some(role => userRoles.has(role));
};

export function checkPermission(
    accessControl: IAccessControl[],
    {
        requiredRoles = [],
        deniedRoles = [],
        requiredRolesMode = "all",
        deniedRolesMode = "any",
    }: IPermissionCheck = {}
): boolean {
    if (!accessControl) return false;

    if (deniedRoles.length > 0) {
        const deniedMatch =
            deniedRolesMode === "all"
                ? hasAllRoles(accessControl, deniedRoles)
                : hasAnyRole(accessControl, deniedRoles);

        if (deniedMatch) return false;
    }

    if (requiredRoles.length > 0) {
        const requiredMatch =
            requiredRolesMode === "all"
                ? hasAllRoles(accessControl, requiredRoles)
                : hasAnyRole(accessControl, requiredRoles);

        if (!requiredMatch) return false;
    }

    return true;
}