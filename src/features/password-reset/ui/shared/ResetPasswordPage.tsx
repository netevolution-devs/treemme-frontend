import {useState} from "react";
import {Box} from "@mui/material";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {appNs} from "../../../../i18n";
import usePostPasswordReset from "@features/password-reset/api/usePostPasswordReset";
import usePasswordResetVerify from "@features/password-reset/api/usePostPasswordResetVerify";
import {useNavigate} from "react-router";
import ResetEmailStep from "./components/ResetEmailStep";
import ResetVerifyStep from "./components/ResetVerifyStep";
import ResetChangePassword from "./components/ResetChangePassword";
import ResetSuccessStep from "./components/ResetSuccessStep";

type ResetStep = "email" | "verify" | "change" | "success";

interface IEmailForm {
    email: string;
}

interface IVerifyForm {
    verificationCode: string;
}

const ResetPasswordPage = () => {
    const {t} = useTranslation([appNs("login"), "common"]);
    const navigate = useNavigate();

    const [step, setStep] = useState<ResetStep>("email");
    const [email, setEmail] = useState<string>("");
    const [resetToken, setResetToken] = useState<string>("");
    const [verifyError, setVerifyError] = useState<string>("");

    const {mutateAsync: requestReset, isPending: isRequestPending} = usePostPasswordReset();
    const {mutateAsync: verifyCode, isPending: isVerifyPending} = usePasswordResetVerify();

    const emailMethods = useForm<IEmailForm>({
        mode: "onSubmit"
    });

    const verifyMethods = useForm<IVerifyForm>({
        mode: "onSubmit",
        defaultValues: {
            verificationCode: ""
        }
    });

    const onEmailSubmit = async (data: IEmailForm) => {
        await requestReset({email: data.email});
        setEmail(data.email);
        setStep("verify");
    };

    const onVerifySubmit = async (data: IVerifyForm) => {
        setVerifyError("");
        const response = await verifyCode({verification_code: data.verificationCode});

        if (response && response[0] && response[0].status === "ok" && response[0].reset_token) {
            setResetToken(response[0].reset_token);
            setStep("change");
        } else {
            // Status is "ko" or missing reset_token
            setVerifyError(response[0]?.message || t("reset-password.verify.error-invalid-code"));
        }
    };

    const onChangeSuccess = () => {
        setStep("success");
    };

    const handleBackToLogin = () => {
        navigate("/login");
    };

    const handleBackToEmail = () => {
        setVerifyError("");
        verifyMethods.reset();
        setStep("email");
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: 2,
            }}
        >
            <Box sx={{maxWidth: 500, flex: 1}}>
                {step === "email" && (
                    <ResetEmailStep
                        emailMethods={emailMethods}
                        onEmailSubmit={onEmailSubmit}
                        isRequestPending={isRequestPending}
                        onBackToLogin={handleBackToLogin}
                    />
                )}

                {step === "verify" && (
                    <ResetVerifyStep
                        email={email}
                        verifyMethods={verifyMethods}
                        onVerifySubmit={onVerifySubmit}
                        isVerifyPending={isVerifyPending}
                        verifyError={verifyError}
                        onBackToEmail={handleBackToEmail}
                    />
                )}

                {step === "change" && (
                    <ResetChangePassword
                        resetToken={resetToken}
                        onChangeSuccess={onChangeSuccess}
                    />
                )}

                {step === "success" && (
                    <ResetSuccessStep
                        onBackToLogin={handleBackToLogin}
                    />
                )}
            </Box>
        </Box>
    );
};

export default ResetPasswordPage;
