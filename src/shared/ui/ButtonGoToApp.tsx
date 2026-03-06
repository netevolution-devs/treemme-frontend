import {Button} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import type {ButtonProps as MuiButtonProps} from "@mui/material";
import {useMenuStore} from "@ui/layout/default/layoutStore.ts";

interface Props extends MuiButtonProps {
    label?: string;
}

const ButtonGoToApp = ({label, ...props}: Props) => {
    const {t} = useTranslation(["settings"]);
    const navigate = useNavigate();
    const {showMenu} = useMenuStore();

    function handleBackNavigation() {
        navigate("/app");
        showMenu();
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