import {Button} from "@mui/material";
import {useNavigate} from "react-router";
import type {ButtonProps as MuiButtonProps} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useLayout} from "@ui/layout/default/LayoutContext";
import KeyIcon from '@mui/icons-material/Key';

interface Props extends MuiButtonProps {
    label?: string,
}

const ButtonChangePassword = ({label, ...props}: Props) => {
    const {t} = useTranslation(["settings"]);
    const {setShowTopBar} = useLayout()
    const navigate = useNavigate();

    const handleChangePassword = () => {
        setShowTopBar(false);
        navigate("/change-password");
    }

    return (
        <Button
            onClick={handleChangePassword}
            variant={"outlined"}
            endIcon={<KeyIcon/>}
            {...props}
        >
            {label ?? t("interface.change-password")}
        </Button>
    )
}

export default ButtonChangePassword;
