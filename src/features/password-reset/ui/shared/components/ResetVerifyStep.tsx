import {Box, Button, CircularProgress, Stack, TextField, Typography, Alert} from "@mui/material";
import {FormProvider, type UseFormReturn} from "react-hook-form";
import {useTranslation} from "react-i18next";
import VerifiedIcon from '@mui/icons-material/Verified';
import {appNs} from "../../../../../i18n";

interface IVerifyForm {
    verificationCode: string;
}

interface ResetVerifyStepProps {
    email: string;
    verifyMethods: UseFormReturn<IVerifyForm>;
    onVerifySubmit: (data: IVerifyForm) => Promise<void>;
    isVerifyPending: boolean;
    verifyError: string;
    onBackToEmail: () => void;
}

const ResetVerifyStep = ({
                             email,
                             verifyMethods,
                             onVerifySubmit,
                             isVerifyPending,
                             verifyError,
                             onBackToEmail,
                         }: ResetVerifyStepProps) => {
    const {t} = useTranslation([appNs("login"), "common"]);

    return (
        <Stack
            spacing={4}
            sx={{
                width: '100%',
                p: {xs: 3, sm: 5},
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
                textAlign: 'center',
            }}
        >
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <VerifiedIcon sx={{fontSize: 60, color: 'primary.main'}}/>
            </Box>
            <Typography variant="h5" fontWeight="bold">
                {t("reset-password.verify.title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                {t("reset-password.verify.description", {email})}
            </Typography>

            {verifyError && (
                <Alert severity="error" sx={{textAlign: 'left'}}>
                    {verifyError}
                </Alert>
            )}

            <FormProvider {...verifyMethods}>
                <Stack
                    component="form"
                    onSubmit={verifyMethods.handleSubmit(onVerifySubmit)}
                    spacing={2}
                >
                    <TextField
                        {...verifyMethods.register("verificationCode", {
                            required: t("common:form.error.required"),
                        })}
                        label={t("reset-password.verify.code-label")}
                        placeholder="000000"
                        error={!!verifyMethods.formState.errors.verificationCode}
                        helperText={verifyMethods.formState.errors.verificationCode?.message || " "}
                        slotProps={{
                            input: {
                                style: {textAlign: 'center', letterSpacing: '0.3rem'}
                            },
                            htmlInput: {
                                maxLength: 6
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isVerifyPending}
                        sx={{mt: 2}}
                    >
                        {isVerifyPending ? (
                            <>
                                {t("reset-password.verify.loading")}
                                <CircularProgress size={18} sx={{ml: 2}}/>
                            </>
                        ) : (
                            <>{t("reset-password.verify.button")}</>
                        )}
                    </Button>
                    <Button
                        onClick={onBackToEmail}
                        variant="text"
                        sx={{mt: 1}}
                    >
                        {t("reset-password.back-to-email")}
                    </Button>
                </Stack>
            </FormProvider>
        </Stack>
    );
};

export default ResetVerifyStep;
