import type {IPermissionGuardProps} from "@features/routing/useHasPermission.ts";
import type {IAccessControl, IRoles} from "@features/user/model/RoleInterfaces.ts";

const hasAllRequiredRoles = (accessControl: IAccessControl[], required: IRoles[]): boolean => {
    const userRoleNames = accessControl.map(ac => ac.role);
    return required.every(requiredRole => userRoleNames.includes(requiredRole));
};

const hasAnyRequiredRole = (accessControl: IAccessControl[], required: IRoles[]): boolean => {
    const userRoleNames = accessControl.map(ac => ac.role);
    return required.some(requiredRole => userRoleNames.includes(requiredRole));
};

export function checkPermission(
    accessControl: IAccessControl[],
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
        const userHasAnyDenied = hasAnyRequiredRole(accessControl, deniedRoles);
        const userHasAllDenied = hasAllRequiredRoles(accessControl, deniedRoles);
        return deniedRolesMode === "any" ? userHasAnyDenied : userHasAllDenied;
    })();

    const hasRequired = (() => {
        if (requiredRoles.length === 0) return true;
        const allReq = hasAllRequiredRoles(accessControl, requiredRoles);
        const anyReq = hasAnyRequiredRole(accessControl, requiredRoles);
        return requiredRolesMode === "all" ? allReq : anyReq;
    })();

    return !hasDeniedRoles && hasRequired;
}
