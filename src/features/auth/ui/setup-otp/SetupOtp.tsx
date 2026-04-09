import usePostSetupOTP from "@features/auth/api/usePostSetupOtp";
import {useAuth} from "@features/auth/model/AuthContext";
import {
    Stack,
    Typography,
    Box,
    CircularProgress,
    Button,
    Accordion,
    AccordionDetails,
    AccordionSummary
} from "@mui/material";
import {useEffect, useState} from "react";
import {QRCodeSVG} from 'qrcode.react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {useTranslation} from "react-i18next";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import HelpTooltip from "@shared/ui/tooltip/HelpTooltip";
import {appNs} from "../../../../i18n";

interface SetupOtpProps {
    onSetupSuccess: () => void;
}

interface ISetupOtpResponse {
    message: string;
    qr_data: {
        secret: string;
        qr_url: string;
        manual_entry_key: string;
        issuer: string;
        account: string;
    };
    backup_codes: string[];
}

const SetupOtp = ({onSetupSuccess}: SetupOtpProps) => {
    const {t} = useTranslation([appNs("login"), "common"]);
    const {userCode} = useAuth();
    const [otpData, setOtpData] = useState<ISetupOtpResponse | null>(null);

    const {mutate: setupOtp, isPending, isError} = usePostSetupOTP();

    useEffect(() => {
        if (userCode) {
            setupOtp(
                {userCode: userCode as string},
                {
                    onSuccess: (response: ISetupOtpResponse) => {
                        setOtpData(response);
                    },
                    onError: (error) => {
                        console.error("Errore setup OTP:", error);
                    }
                }
            );
        }
    }, [userCode, setupOtp]);

    if (isPending) {
        return (
            <Stack alignItems="center" spacing={2}>
                <CircularProgress/>
                <Typography>{t("otp.setup.label")}</Typography>
            </Stack>
        );
    }

    return (
        <Stack
            spacing={4}
            sx={{
                maxWidth: 800,
                p: {xs: 3, sm: 5},
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
                textAlign: 'center',
            }}
        >
            <Typography variant="h5" fontWeight="bold">
                {t("otp.setup.title")}
            </Typography>

            {isError && (
                <Typography variant="body1" gutterBottom>
                    {t("otp.setup.already-configured")}
                </Typography>
            )}

            {otpData && (
                <>
                    <Box sx={{display: 'flex', gap: 0.3}}>
                        <Typography variant="body1" color="text.secondary">
                            {t("otp.setup.description")}
                        </Typography>
                        <HelpTooltip
                            text={
                                <>
                                    <Typography variant="body2" gutterBottom>
                                        {t("otp.setup.description-help")}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        {t("otp.setup.description-help-2")}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        {t("otp.setup.description-help-3")}
                                    </Typography>
                                </>
                            }
                            size="small"
                        />
                    </Box>

                    <Box sx={{display: 'flex', justifyContent: 'center', my: 3}}>
                        <QRCodeSVG
                            value={otpData.qr_data.qr_url}
                            size={256}
                            level="M"
                            marginSize={2}
                        />
                    </Box>

                    <Accordion sx={{borderRadius: 1}}>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon/>}
                        >
                            <Box>{t("otp.setup.helper")}</Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{borderRadius: 1}}>
                                <Typography variant="caption" color="text.secondary">
                                    {t("otp.setup.helper-description")}
                                </Typography>
                                <Typography variant="body2" fontFamily="monospace" sx={{mt: 1}}>
                                    {otpData.qr_data.manual_entry_key}
                                </Typography>
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Button
                        variant="contained"
                        onClick={() => onSetupSuccess()}
                    >
                        Verifica dispositivo
                        <ArrowForwardIcon sx={{ml: 0.6}} fontSize="small"/>
                    </Button>

                    {/* {otpData.backup_codes && otpData.backup_codes.length > 0 && (
                        <Alert severity="warning">
                            <Typography variant="subtitle2" gutterBottom>
                                Codici di backup (salvali in un posto sicuro):
                            </Typography>
                            {otpData.backup_codes.map((code, index) => (
                                <Typography key={index} variant="body2" fontFamily="monospace">
                                    {code}
                                </Typography>
                            ))}
                        </Alert>
                    )} */}
                </>
            )}
        </Stack>
    );
};

export default SetupOtp;
