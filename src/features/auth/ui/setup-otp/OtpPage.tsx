import usePostVerifyOTP from "@features/auth/api/usePostVerifyOTP";
import {useAuth} from "@features/auth/model/AuthContext";
import {Box, Button, Stack, Typography, CircularProgress} from "@mui/material";
import BasePage from "@shared/ui/layout/BasePage";
import {MuiOtpInput} from 'mui-one-time-password-input';
import {useState} from "react";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import {appNs} from "../../../../i18n";
import {useLayout} from "@ui/layout/default/LayoutContext";

const OtpPage = () => {
    const {t} = useTranslation([appNs("login"), "common"]);
    const navigate = useNavigate();
    const {setShowTopBar} = useLayout()

    const {userCode} = useAuth();
    const [otp, setOtp] = useState('');

    const {mutateAsync: verifyOtp, isPending} = usePostVerifyOTP();

    const handleVerify = async () => {
        try {
            if (userCode) {
                await verifyOtp({
                    user_code: userCode,
                    totp_code: otp
                })
            }
            setShowTopBar(true)
            navigate("/", {replace: true});
        } catch (err) {
            void err
            setOtp("");
        }
    }

    const isVerificationDisabled = otp.length !== 6 || isPending;

    return (
        <BasePage>
            <Box
                sx={{
                    py: 8,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh',
                }}
            >
                <Stack
                    spacing={4}
                    sx={{
                        maxWidth: 500,
                        p: {xs: 3, sm: 5},
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 3,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                        {t("otp.login.title")}
                    </Typography>

                    <Typography color="text.secondary">
                        {t("otp.login.description")}
                    </Typography>

                    <Box sx={{display: 'flex', justifyContent: 'center', my: 2}}>
                        <MuiOtpInput
                            autoFocus
                            value={otp}
                            onChange={setOtp}
                            length={6}
                            TextFieldsProps={{size: 'medium', placeholder: '•'}}
                            sx={{gap: {xs: 1, sm: 2}}}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleVerify}
                        disabled={isVerificationDisabled}
                        fullWidth
                    >
                        {isPending ? (
                                <>
                                    {t("otp.login.loading")}<CircularProgress size={18} sx={{ml: 2}}/>
                                </>
                            ) :
                            <>{t("otp.login.button")}</>
                        }
                    </Button>
                </Stack>
            </Box>
        </BasePage>
    )
}

export default OtpPage;
