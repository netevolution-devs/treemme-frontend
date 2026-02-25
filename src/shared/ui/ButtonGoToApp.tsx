import {Button} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useNavigate} from "react-router";
import {useLayout} from "@ui/layout/default/LayoutContext.tsx";
import {useTranslation} from "react-i18next";
import type {ButtonProps as MuiButtonProps} from "@mui/material";

interface Props extends MuiButtonProps {
    label?: string;
}

const ButtonGoToApp = ({label, ...props}: Props) => {
    const {t} = useTranslation(["settings"]);
    const navigate = useNavigate();
    const {setShowTopBar} = useLayout()

    function handleBackNavigation() {
        setShowTopBar(true);
        navigate(-1);
    }

    return (
        <Button
            onClick={handleBackNavigation}
            startIcon={<ArrowBackIcon/>}
            {...props}
        >
            {label ?? t("interface.go-to-app")}
        </Button>
    )
}

export default ButtonGoToApp;