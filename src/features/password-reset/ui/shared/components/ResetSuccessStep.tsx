import {Box, Button, Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {appNs} from "../../../../../i18n.ts";

interface ResetSuccessStepProps {
    onBackToLogin: () => void;
}

const ResetSuccessStep = ({onBackToLogin}: ResetSuccessStepProps) => {
    const {t} = useTranslation([appNs("login"), "common"]);

    return (
        <Stack
            spacing={4}
            sx={{
                maxWidth: 500,
                width: '100%',
                p: {xs: 3, sm: 5},
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
                textAlign: 'center',
            }}
        >
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <CheckCircleIcon sx={{fontSize: 80, color: 'primary.main'}}/>
            </Box>
            <Typography variant="h5" fontWeight="bold" color="primary.main">
                {t("reset-password.success.title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                {t("reset-password.success.description")}
            </Typography>
            <Button
                variant="contained"
                onClick={onBackToLogin}
                sx={{mt: 2}}
            >
                {t("reset-password.success.button")}
            </Button>
        </Stack>
    );
};

export default ResetSuccessStep;
