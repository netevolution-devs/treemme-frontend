import {useAuth} from "@features/auth/model/AuthContext.tsx";
import {checkPermission, type IPermissionCheck} from "./permission.utils";

export const useHasPermission = (
    permissionProps?: IPermissionCheck
): boolean => {
    const {user} = useAuth();

    if (!user) return false;

    return checkPermission(user.accessControl, permissionProps);
};