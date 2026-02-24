import type {IAccessControl, IRoles} from "@features/user/model/RoleInterfaces.ts";
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

const hasAllRequiredRoles = (accessControl: IAccessControl[], required: IRoles[]): boolean => {
    const userRoleNames = accessControl.map(ac => ac.role);
    return required.every(requiredRole => userRoleNames.includes(requiredRole));
};

const hasAnyRequiredRole = (accessControl: IAccessControl[], required: IRoles[]): boolean => {
    const userRoleNames = accessControl.map(ac => ac.role);
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
        const userHasAnyDenied = hasAnyRequiredRole(user.accessControl, deniedRoles);
        const userHasAllDenied = hasAllRequiredRoles(user.accessControl, deniedRoles);
        return deniedRolesMode === "any" ? userHasAnyDenied : userHasAllDenied;
    })();

    const hasRequired = (() => {
        if (requiredRoles.length === 0) return true;
        const allReq = hasAllRequiredRoles(user.accessControl, requiredRoles);
        const anyReq = hasAnyRequiredRole(user.accessControl, requiredRoles);
        return requiredRolesMode === "all" ? allReq : anyReq;
    })();

    if (!hasRequired) return false;
    if (hasDeniedRoles) return false;

    return true;
};
