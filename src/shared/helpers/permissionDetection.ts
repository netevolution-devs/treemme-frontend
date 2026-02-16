import type {IPermissionGuardProps} from "@features/routing/useHasPermission.ts";
import type {IUserRole} from "@features/user/model/RoleInterfaces.ts";

const hasAllRequiredRoles = (userRoles: IUserRole[], required: string[]): boolean => {
    const userRoleNames = userRoles.map(userRole => userRole.role.name);
    return required.every(requiredRole => userRoleNames.includes(requiredRole));
};

const hasAnyRequiredRole = (userRoles: IUserRole[], required: string[]): boolean => {
    const userRoleNames = userRoles.map(userRole => userRole.role.name);
    return required.some(requiredRole => userRoleNames.includes(requiredRole));
};

export function checkPermission(
    userRoles: IUserRole[],
    permissionProps?: IPermissionGuardProps
): boolean {
    if (!permissionProps) return true;

    const {
        requiredRoles = [],
        deniedRoles = [],
        requiredRolesMode = "all",
        deniedRolesMode = "any",
    } = permissionProps;

    const hasDeniedRoles = (() => {
        if (deniedRoles.length === 0) return false;
        const userHasAnyDenied = hasAnyRequiredRole(userRoles, deniedRoles);
        const userHasAllDenied = hasAllRequiredRoles(userRoles, deniedRoles);
        return deniedRolesMode === "any" ? userHasAnyDenied : userHasAllDenied;
    })();

    const hasRequired = (() => {
        if (requiredRoles.length === 0) return true;
        const allReq = hasAllRequiredRoles(userRoles, requiredRoles);
        const anyReq = hasAnyRequiredRole(userRoles, requiredRoles);
        return requiredRolesMode === "all" ? allReq : anyReq;
    })();

    return !hasDeniedRoles && hasRequired;
}
