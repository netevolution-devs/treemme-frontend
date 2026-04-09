import {Navigate} from "react-router";
import SettingsPage from "@features/settings/ui/default/SettingsPage";
import type {IRouteConfig} from "@features/routing/RouteConfig";
import ProfilePage from "@features/profile/ui/default/ProfilePage";

export const defaultProtectedRoutes: IRouteConfig[] = [
    {
        path: "/",
        element: <Navigate to="/app" replace/>
    },
    {
        path: "/app",
        element: null
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
