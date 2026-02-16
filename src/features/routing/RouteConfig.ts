import type {ReactNode} from "react";
import type {IPermissionGuardProps} from "@features/routing/useHasPermission.ts";

export interface IRouteConfig {
    path?: string;
    index?: boolean;
    element?: ReactNode;
    children?: IRouteConfig[];
    permissionGuardProps?: IPermissionGuardProps;
    fallbackElement?: ReactNode;
}
