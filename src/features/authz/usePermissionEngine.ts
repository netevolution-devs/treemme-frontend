import {useMemo} from "react";
import {permissionEngine, type PermissionEngine} from "@features/authz/permission.utils.ts";
import {useAuth} from "@features/auth/model/AuthContext.tsx";

export const usePermissionEngine = (): PermissionEngine | null => {
    const {user} = useAuth();
    const permission = permissionEngine(user?.accessControl ?? []);

    return useMemo(() => {
        if (!permission) return null;
        return {
            can: permission.can,
            hasRole: permission.hasRole,
            hasRequiredRoles: permission.hasRequiredRoles,
            hasDeniedRoles: permission.hasDeniedRoles,
        };
    }, [permission]);
};