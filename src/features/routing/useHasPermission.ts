import type {IRoles, IUserRole} from "@features/user/model/RoleInterfaces.ts";
import type {ReactNode} from "react";
import {useAuth} from "@features/auth/model/AuthContext.tsx";

type Modes = "any" | "all";

export interface IPermissionGuardProps {
    requiredRoles?: IRoles[];
    deniedRoles?: IRoles[];
    requiredRolesMode?: Modes;
    deniedRolesMode?: Modes;
    FallbackElement?: ReactNode;
}

const hasAllRequiredRoles = (userRoles: IUserRole[], required: string[]): boolean => {
    const userRoleNames = userRoles.map(userRole => {
        return userRole.role.name;
    });
    return required.every(requiredRole => userRoleNames.includes(requiredRole));
};

const hasAnyRequiredRole = (userRoles: IUserRole[], required: string[]): boolean => {
    const userRoleNames = userRoles.map(userRole => userRole.role.name);
    return required.some(requiredRole => userRoleNames.includes(requiredRole));
};

export const useHasPermission = ({
                                     requiredRoles = [],
                                     deniedRoles = [],
                                     requiredRolesMode = "all",
                                     deniedRolesMode = "any",
                                 }: Omit<IPermissionGuardProps, "FallbackElement"> = {}): boolean => {
    const {user} = useAuth();

    if (!user) return false;

    const hasDeniedRoles = (() => {
        if (deniedRoles.length === 0) return false;
        const userHasAnyDenied = hasAnyRequiredRole(user.roles, deniedRoles);
        const userHasAllDenied = hasAllRequiredRoles(user.roles, deniedRoles);
        return deniedRolesMode === "any" ? userHasAnyDenied : userHasAllDenied;
    })();

    const hasRequired = (() => {
        if (requiredRoles.length === 0) return true;
        const allReq = hasAllRequiredRoles(user.roles, requiredRoles);
        const anyReq = hasAnyRequiredRole(user.roles, requiredRoles);
        return requiredRolesMode === "all" ? allReq : anyReq;
    })();

    if (!hasRequired) return false;
    if (hasDeniedRoles) return false;

    return true;
};
