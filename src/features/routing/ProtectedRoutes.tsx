import {type ReactNode, useMemo} from "react";
import {Route, Outlet} from "react-router";
import {useAuth} from "@features/auth/model/AuthContext.tsx";
import type {IRouteConfig} from "@features/routing/RouteConfig.ts";
import LogoutAndRedirect from "@features/routing/LogoutAndRedirect.tsx";
import type {IAccessControl} from "@features/user/model/RoleInterfaces.ts";
import {hasPermission} from "@features/authz/permission.utils.ts";

function renderRoutes(
    routes: IRouteConfig[],
    accessControlList: IAccessControl[],
    defaultFallback: ReactNode
): ReactNode[] {
    return routes
        .filter(route => {
            if (!route.permissionCheck) return true;
            return hasPermission(accessControlList, route.permissionCheck);
        })
        .map((route, index) => {
            const hasChildren = route.children && route.children.length > 0;
            const element = hasChildren && !route.element
                ? <Outlet/>
                : route.element;

            const filteredChildren = hasChildren
                ? renderRoutes(route.children!, accessControlList, defaultFallback)
                : undefined;

            if (route.index) {
                return <Route key={index} index element={element}/>;
            }

            return (
                <Route key={route.path ?? index} path={route.path} element={element}>
                    {filteredChildren}
                </Route>
            );
        });
}

export function useFilteredRoutes(
    routes: IRouteConfig[],
    defaultFallback: ReactNode = <LogoutAndRedirect to="/login"/>
): ReactNode[] {
    const {user} = useAuth();
    const userAccessControl = user?.accessControl ?? [];

    return useMemo(() => {
        return renderRoutes(routes, userAccessControl, defaultFallback);
    }, [routes, userAccessControl, defaultFallback]);
}
