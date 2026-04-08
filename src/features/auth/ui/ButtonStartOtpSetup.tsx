import {Button} from "@mui/material";
import {useNavigate} from "react-router";
import type {ButtonProps as MuiButtonProps} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useLayout} from "@ui/layout/default/LayoutContext";
import {Security} from "@mui/icons-material";

interface Props extends MuiButtonProps {
    label?: string,
}

const ButtonStartOtpSetup = ({label, ...props}: Props) => {
    const {t} = useTranslation(["settings"]);
    const {setShowTopBar} = useLayout()
    const navigate = useNavigate();

    const handleStartOtpSetup = () => {
        setShowTopBar(false);
        navigate("/login/otp/setup");
    }

    return (
        <Button
            onClick={handleStartOtpSetup}
            variant={"outlined"}
            endIcon={<Security/>}
            {...props}
        >
            {label ?? t("interface.go-to-setup-otp")}
        </Button>
    )
}

export default ButtonStartOtpSetup;
