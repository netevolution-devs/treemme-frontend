import {Box, Button, Card, CircularProgress, Stack, Typography} from "@mui/material";
import {FormProvider, type UseFormReturn} from "react-hook-form";
import {useTranslation} from "react-i18next";
import EmailField from "@ui/form/controlled/EmailField";
import LockResetIcon from '@mui/icons-material/LockReset';
import {appNs} from "../../../../../i18n.ts";

interface IEmailForm {
    email: string;
}

interface ResetEmailStepProps {
    emailMethods: UseFormReturn<IEmailForm>;
    onEmailSubmit: (data: IEmailForm) => Promise<void>;
    isRequestPending: boolean;
    onBackToLogin: () => void;
}

const ResetEmailStep = ({
                            emailMethods,
                            onEmailSubmit,
                            isRequestPending,
                            onBackToLogin,
                        }: ResetEmailStepProps) => {
    const {t} = useTranslation([appNs("login"), "common"]);

    return (
        <Card variant="outlined">
            <Stack
                spacing={4}
                sx={{
                    width: '100%',
                    p: {xs: 3, sm: 5},
                    borderRadius: 2,
                    textAlign: 'center',
                }}
            >
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <LockResetIcon sx={{fontSize: 60, color: 'primary.main'}}/>
                </Box>
                <Typography variant="h5" fontWeight="bold">
                    {t("reset-password.email.title")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t("reset-password.email.description")}
                </Typography>
                <FormProvider {...emailMethods}>
                    <Stack
                        component="form"
                        onSubmit={emailMethods.handleSubmit(onEmailSubmit)}
                        spacing={2}
                    >
                        <EmailField<IEmailForm>
                            name="email"
                            required
                            showRequired={false}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isRequestPending}
                            sx={{mt: 2, boxShadow: 'none'}}
                        >
                            {isRequestPending ? (
                                <>
                                    {t("reset-password.email.loading")}
                                    <CircularProgress size={18} sx={{ml: 2}}/>
                                </>
                            ) : (
                                <>{t("reset-password.email.button")}</>
                            )}
                        </Button>
                        <Button
                            onClick={onBackToLogin}
                            variant="text"
                            sx={{mt: 1, boxShadow: 'none'}}
                        >
                            {t("reset-password.back-to-login")}
                        </Button>
                    </Stack>
                </FormProvider>
            </Stack>
        </Card>

    );
};

export default ResetEmailStep;
