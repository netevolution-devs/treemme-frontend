import usePostVerifyDevice from "@features/auth/api/usePostVerifyDevice";
import {useAuth} from "@features/auth/model/AuthContext";
import {Box, Button, Stack, Typography, CircularProgress} from "@mui/material";
import {MuiOtpInput} from 'mui-one-time-password-input';
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {appNs} from "../../../../i18n.ts";

interface Props {
    onVerifySuccess: () => void;
}

const VerifyDevice = ({onVerifySuccess}: Props) => {
    const {t} = useTranslation([appNs("login"), "common"]);

    const {userCode} = useAuth();
    const [otp, setOtp] = useState('');

    const {mutateAsync: verifyOtp, isPending} = usePostVerifyDevice();

    const handleVerify = async () => {
        try {
            if (userCode) {
                await verifyOtp({
                    userCode: userCode,
                    otpCode: otp
                })
            }
            onVerifySuccess();
        } catch (err) {
            void err
            setOtp("");
        }
    }

    const isVerificationDisabled = otp.length !== 6 || isPending;

    useEffect(() => {

    }, []);

    return (
        <Stack
            spacing={1}
            sx={{
                maxWidth: 500,
                p: {xs: 3, sm: 5},
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
                textAlign: 'center',
            }}
        >
            <Stack spacing={4}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    {t("otp.verify.title")}
                </Typography>

                <Typography color="text.secondary">
                    {t("otp.verify.description")}
                </Typography>

                <Box sx={{display: 'flex', justifyContent: 'center', my: 2}}>
                    <MuiOtpInput
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
                                {t("otp.verify.loading")}<CircularProgress size={18} sx={{ml: 2}}/>
                            </>
                        ) :
                        <>{t("otp.verify.button")}</>
                    }
                </Button>
            </Stack>
        </Stack>
    )
}

export default VerifyDevice;
