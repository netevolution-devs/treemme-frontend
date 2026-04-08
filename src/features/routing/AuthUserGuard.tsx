import {Navigate, Outlet} from "react-router";
import {AuthFetchingScreen} from "./Fallbacks";
import {useAuth} from "@features/auth/model/AuthContext";

const AuthUserGuard = () => {
    const {isAuthenticated, isLoading} = useAuth();

    if (isLoading) {
        return <AuthFetchingScreen/>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return <Outlet/>
}

export default AuthUserGuard;
