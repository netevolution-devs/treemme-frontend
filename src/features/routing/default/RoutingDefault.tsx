import {Navigate, Route, Routes} from "react-router";
import AuthUserGuard from "../AuthUserGuard";
import {useFilteredRoutes} from "@features/routing/ProtectedRoutes";
import LoginPage from "@features/auth/ui/LoginPage";
import OtpPage from "@features/auth/ui/setup-otp/OtpPage";
import OtpSetupPage from "@features/auth/ui/setup-otp/OtpSetupPage";
import Layout from "@ui/layout/default/Layout";
import {defaultProtectedRoutes} from "@features/routing/default/defaultProtectedRoutes";
import useAxiosInstance from "@api/useAxiosInstance";
import PermissionGuard from "@features/authz/PermissionGuard";
import LogoutAndRedirect from "@features/routing/LogoutAndRedirect";
import ResetPasswordPage from "@features/password-reset/ui/shared/ResetPasswordPage";
import {EnumRoles} from "@features/user/model/RoleInterfaces";
import SubcontractorFilePage from "@features/file/subcontractor/ui/SubcontractorFilePage";

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
                {/* File routes: auth required, no Admin/Staff gate, no app Layout */}
                <Route
                    path="/file/subcontractor/:id"
                    element={
                        <PermissionGuard
                            // TODO: add resource and requiredRoles once the role is known
                            action="get"
                            FallbackElement={<LogoutAndRedirect to="/login"/>}
                        >
                            <SubcontractorFilePage/>
                        </PermissionGuard>
                    }
                />

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
