import {Navigate} from "react-router";
import SettingsPage from "@features/settings/ui/default/SettingsPage.tsx";
import type {IRouteConfig} from "@features/routing/RouteConfig.ts";
import ProfilePage from "@features/profile/ui/default/ProfilePage.tsx";

export const defaultProtectedRoutes: IRouteConfig[] = [
    {
        path: "/",
        element: <Navigate to="/dashboard" replace/>
    },
    {
        path: "/dashboard",
        element: <> </>
    },
    {
        path: "/settings",
        element: <SettingsPage/>
    },
    {
        path: "/profile",
        element: <ProfilePage/>
    },
];
