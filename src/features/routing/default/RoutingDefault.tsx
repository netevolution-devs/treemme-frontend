import {Navigate, Route, Routes} from "react-router";
import AuthUserGuard from "../AuthUserGuard.tsx";
import {useFilteredRoutes} from "@features/routing/ProtectedRoutes.tsx";
import LoginPage from "@features/auth/ui/LoginPage.tsx";
import OtpPage from "@features/auth/ui/setup-otp/OtpPage.tsx";
import OtpSetupPage from "@features/auth/ui/setup-otp/OtpSetupPage.tsx";
import Layout from "@ui/layout/default/Layout.tsx";
import {defaultProtectedRoutes} from "@features/routing/default/defaultProtectedRoutes.tsx";
import useAxiosInstance from "@api/useAxiosInstance.ts";
import PermissionGuard from "@features/routing/PermissionGuard.tsx";
import LogoutAndRedirect from "@features/routing/LogoutAndRedirect.tsx";
import ResetPasswordPage from "@features/password-reset/ui/shared/ResetPasswordPage.tsx";
import {EnumRoles} from "@features/user/model/RoleInterfaces.ts";

const RoutingDefault = () => {
    useAxiosInstance();
    const filteredRoutes = useFilteredRoutes(defaultProtectedRoutes);

    return (
        <Routes>
            <Route path="/login">
                <Route index element={<LoginPage/>}/>
                <Route path="/login/otp" element={<OtpPage/>}/>
                <Route path="/login/otp/setup" element={<OtpSetupPage/>}/>
            </Route>

            <Route path="/reset-password" element={<ResetPasswordPage/>}/>

            <Route element={<AuthUserGuard/>}>
                <Route element={
                    <PermissionGuard
                        requiredRoles={[EnumRoles.Admin, EnumRoles.Staff]}
                        deniedRolesMode="any"
                        requiredRolesMode="any"
                        FallbackElement={<LogoutAndRedirect to="/login"/>}
                    >
                        <Layout/>
                    </PermissionGuard>
                }>
                    {filteredRoutes}
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Route>
            </Route>
        </Routes>
    );
};

export default RoutingDefault;
