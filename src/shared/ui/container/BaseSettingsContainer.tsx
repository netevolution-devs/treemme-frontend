import {Box, Button, Stack, type SxProps} from "@mui/material";
import type {ReactNode} from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useNavigate} from "react-router";
import {useLayout} from "@ui/layout/default/LayoutContext.tsx";
import {useTranslation} from "react-i18next";

interface Props {
    children: ReactNode;
    sx?: SxProps | undefined;
}

const BaseSettingsContainer = ({children}: Props) => {
    const {t} = useTranslation(["settings"]);
    const navigate = useNavigate();
    const {setShowTopBar} = useLayout()

    function handleBackNavigation() {
        setShowTopBar(true);
        navigate(-1);
    }

    return (
        <Box sx={{display: "flex", justifyContent: 'center'}}>
            <Stack sx={{minWidth: "70%", maxWidth: 1200}} spacing={2}>
                <Box>
                    <Button
                        onClick={handleBackNavigation}
                        startIcon={<ArrowBackIcon/>}
                    >
                        {t("interface.go-back")}
                    </Button>
                </Box>
                <Box>
                    {children}
                </Box>
            </Stack>
        </Box>
    )
}

export default BaseSettingsContainer;