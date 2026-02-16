import type {ReactNode} from "react";
import {Button} from "@mui/material";
import {useNavigate} from "react-router";
import type {ButtonProps as MuiButtonProps} from "@mui/material";
import {useAuth} from "@features/auth/model/AuthContext.tsx";
import {Logout} from "@mui/icons-material";

interface Props extends MuiButtonProps {
    logoutText?: string,
    logoutIcon?: ReactNode,
}

const ButtonLogout = ({logoutText = "Logout", logoutIcon, ...props}: Props) => {
    const navigate = useNavigate();
    const {logout} = useAuth();

    const handleLogout = async () => {
        try {
            logout();
            navigate("/login");
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Button
            variant={"outlined"}
            endIcon={logoutIcon ?? <Logout/>}
            onClick={handleLogout}
            {...props}
        >
            {logoutText}
        </Button>
    )
}

export default ButtonLogout;
