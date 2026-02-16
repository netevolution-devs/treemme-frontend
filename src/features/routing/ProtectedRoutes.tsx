import {type ReactNode, useMemo} from "react";
import {Route, Outlet} from "react-router";
import {useAuth} from "@features/auth/model/AuthContext.tsx";
import {checkPermission} from "@helpers/permissionDetection.ts";
import type {IUserRole} from "@features/user/model/RoleInterfaces.ts";
import type {IRouteConfig} from "@features/routing/RouteConfig.ts";
import LogoutAndRedirect from "@features/routing/LogoutAndRedirect.tsx";

function renderRoutes(
    routes: IRouteConfig[],
    userRoles: IUserRole[],
    defaultFallback: ReactNode
): ReactNode[] {
    return routes
        .filter(route => {
            if (!route.permissionGuardProps) return true;
            return checkPermission(userRoles, route.permissionGuardProps);
        })
        .map((route, index) => {
            const hasChildren = route.children && route.children.length > 0;
            const element = hasChildren && !route.element
                ? <Outlet/>
                : route.element;

            const filteredChildren = hasChildren
                ? renderRoutes(route.children!, userRoles, defaultFallback)
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
    const userRoles = user?.roles ?? [];

    return useMemo(() => {
        return renderRoutes(routes, userRoles, defaultFallback);
    }, [routes, userRoles, defaultFallback]);
}
