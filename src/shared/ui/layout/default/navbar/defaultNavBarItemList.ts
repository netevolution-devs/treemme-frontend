import {Dashboard, Settings} from "@mui/icons-material";
import type {INavBarItem} from "../../model/NavBarInterfaces.ts";
import {EnumRoles, type IUserRole} from "@features/user/model/RoleInterfaces.ts";
import {useMemo} from "react";
import {useAuth} from "@features/auth/model/AuthContext.tsx";
import {checkPermission} from "@helpers/permissionDetection.ts";

function filterNavItemsByRole(items: INavBarItem[], userRoles: IUserRole[]): INavBarItem[] {
    return items
        .filter(item => checkPermission(userRoles, item.permissionGuardProps))
        .map(item => {
            if (!item.subMenus) {
                return item;
            }

            return {
                ...item,
                subMenus: filterNavItemsByRole(item.subMenus, userRoles)
            };
        });
}

export function useBackofficeNavBarItemList(): INavBarItem[] {
    const {user} = useAuth();

    const allNavItems: INavBarItem[] = useMemo(() => {
        return [
            // Overview
            {
                group: "menu.group.overview",
                primaryNameKey: "menu.dashboard",
                to: "/dashboard",
                icon: Dashboard,
                permissionGuardProps: {
                    requiredRoles: [EnumRoles.Admin, EnumRoles.Staff],
                    requiredRolesMode: "any",
                }
            },
            {
                group: "menu.group.preferences",
                primaryNameKey: "menu.settings",
                to: "/settings",
                icon: Settings,
                permissionGuardProps: {
                    requiredRoles: [EnumRoles.Admin, EnumRoles.Staff],
                    requiredRolesMode: "any",
                }
            }
        ];
    }, []);

    return useMemo(() => {
        if (!user) return [];
        return filterNavItemsByRole(allNavItems, user.roles);
    }, [allNavItems, user]);
}
