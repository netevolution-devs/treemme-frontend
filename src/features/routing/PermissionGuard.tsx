import type {PropsWithChildren} from "react";
import {type IPermissionGuardProps, useHasPermission} from "@features/routing/useHasPermission.ts";

type Props = IPermissionGuardProps & PropsWithChildren;

const PermissionGuard = ({
                             requiredRoles = [],
                             deniedRoles = [],
                             requiredRolesMode = "all",
                             deniedRolesMode = "any",
                             FallbackElement,
                             children,
                         }: Props) => {
    const allowed = useHasPermission({requiredRoles, deniedRoles, requiredRolesMode, deniedRolesMode});
    if (!allowed) return FallbackElement;
    return <>{children}</>;
};

export default PermissionGuard;
