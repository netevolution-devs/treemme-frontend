import {Navigate, Outlet, useLocation} from "react-router";
import {AuthFetchingScreen} from "./Fallbacks";
import {useAuth} from "@features/auth/model/AuthContext";

const AuthUserGuard = () => {
    const {isAuthenticated, isLoading} = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <AuthFetchingScreen/>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    return <Outlet/>
}

export default AuthUserGuard;
