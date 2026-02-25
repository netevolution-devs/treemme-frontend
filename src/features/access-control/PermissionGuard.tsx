import {type PropsWithChildren, type ReactNode} from "react";
import {useHasPermission} from "@features/access-control/useHasPermission.ts";
import type {IPermissionCheck} from "@features/access-control/permission.utils.ts";

type Props = IPermissionCheck & PropsWithChildren & { FallbackElement: ReactNode };

const PermissionGuard = ({
                             children,
                             FallbackElement = null,
                             ...permissionProps
                         }: Props) => {
    const hasPermission = useHasPermission(permissionProps);
    if (!hasPermission) return FallbackElement;
    return <>{children}</>;
};

export default PermissionGuard;
