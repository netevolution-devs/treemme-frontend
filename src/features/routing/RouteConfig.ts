import type {ReactNode} from "react";
import type {IPermissionCheck} from "@features/authz/permission.utils.ts";

export interface IRouteConfig {
    path?: string;
    index?: boolean;
    element?: ReactNode;
    children?: IRouteConfig[];
    permissionCheck?: IPermissionCheck;
    fallbackElement?: ReactNode;
}
