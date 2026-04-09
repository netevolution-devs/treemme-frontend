import {Navigate} from "react-router";
import {useAuth} from "@features/auth/model/AuthContext";
import {useEffect} from "react";

interface Props {
    to: string;
}

const LogoutAndRedirect = ({to}: Props) => {
    const { logout } = useAuth();

    useEffect(() => {
        logout();
    }, [logout])

    return (
        <Navigate to={to} replace/>
    )
}

export default LogoutAndRedirect;
