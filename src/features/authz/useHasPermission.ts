import {useAuth} from "@features/auth/model/AuthContext";
import {useMemo} from "react";
import type {IAccessControl} from "@features/user/model/RoleInterfaces";
import {hasPermission, type IPermissionCheck} from "@features/authz/permission.utils";

export const useHasPermission = (permissionCheck: IPermissionCheck = {}): boolean => {
    const {user} = useAuth();

    return useMemo(() => {
        if (!user?.accessControl) return false;
        return hasPermission(user.accessControl as IAccessControl[], permissionCheck);
    }, [user, permissionCheck]);
};