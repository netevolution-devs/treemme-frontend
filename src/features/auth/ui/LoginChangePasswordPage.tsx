import {Box, Button, Stack, Typography, Alert, CircularProgress, Card} from "@mui/material";
import BasePage from "@shared/ui/layout/BasePage";
import usePutPublicChangePassword from "@features/auth/api/usePutPublicChangePassword";
import {useTranslation} from "react-i18next";
import {appNs} from "../../../i18n";
import {isAxiosError} from "axios";
import {useNavigate, useLocation} from "react-router";
import {FormProvider, useForm} from "react-hook-form";
import PasswordField from "@shared/ui/form/controlled/PasswordField";
import {useAuth} from "@features/auth/model/AuthContext";

interface ILoginChangePasswordForm {
    old_password: string;
    new_password: string;
    confirm_password: string;
}

const LoginChangePasswordPage = () => {
    const {t} = useTranslation([appNs("login"), "common"]);
    const {mutateAsync: changePassword, isPending, isError, isSuccess, error} = usePutPublicChangePassword();
    const navigate = useNavigate();
    const location = useLocation();
    const {userCode, setUserCode} = useAuth();
    const from = (location.state as {from?: {pathname: string; search: string}})?.from;

    const methods = useForm<ILoginChangePasswordForm>({
        defaultValues: {
            old_password: "",
            new_password: "",
            confirm_password: ""
        },
        mode: "onChange"
    });

    const {handleSubmit, watch} = methods;
    const newPassword = watch("new_password");

    const onSubmit = async (data: ILoginChangePasswordForm) => {
        if (!userCode) {
            return;
        }
        try {
            await changePassword({
                user_code: userCode,
                old_password: data.old_password,
                new_password: data.new_password
            });
            setUserCode(null);
            const destination = from ? `${from.pathname}${from.search ?? ""}` : "/login";
            setTimeout(() => navigate(destination, {replace: true}), 1500);
        } catch (e) {
            console.error(e);
        }
    };

    let errorMessage = t("otp.password-change.error") || "Errore durante il cambio password";
    if (isError && isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
    }

    return (
        <BasePage>
            <Stack
                sx={{
                    py: 8,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh',
                }}
            >
                <Card
                    sx={{
                        background: theme => theme.palette.background.paper,
                        width: '100%',
                        maxWidth: 500,
                        p: {xs: 3, sm: 5},
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                    variant={"outlined"}
                    elevation={0}
                >
                    <Typography variant="h5" fontWeight="bold" textAlign="center" sx={{mb: 1}}>
                        {t("otp.password-change.title")}
                    </Typography>
                    <Typography variant="body1" textAlign="center" sx={{mb: 3, color: "text.secondary"}}>
                        {t("otp.password-change.description")}
                    </Typography>

                    <Box sx={{mb: 3}}>
                        {isSuccess && (
                            <Alert severity="success" sx={{textAlign: "center"}}>
                                {t("otp.password-change.success")}
                            </Alert>
                        )}
                        {isError && (
                            <Alert severity="error" sx={{textAlign: "center"}}>
                                {errorMessage}
                            </Alert>
                        )}
                    </Box>

                    <FormProvider {...methods}>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={3}>
                                <PasswordField<ILoginChangePasswordForm>
                                    name="old_password"
                                    label={t("otp.password-change.old-password")}
                                    required
                                    autoComplete="current-password"
                                />
                                <PasswordField<ILoginChangePasswordForm>
                                    name="new_password"
                                    label={t("otp.password-change.new-password")}
                                    required
                                    autoComplete="new-password"
                                    rules={{
                                        validate: {
                                            different: (value, formValues) =>
                                                value !== formValues.old_password || t("otp.password-change.password-different")
                                        }
                                    }}
                                />
                                <PasswordField<ILoginChangePasswordForm>
                                    name="confirm_password"
                                    label={t("otp.password-change.confirm-password")}
                                    required
                                    autoComplete="new-password"
                                    rules={{
                                        validate: (value) =>
                                            value === newPassword || t("otp.password-change.not-equal")
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={isPending || !methods.formState.isValid}
                                    startIcon={isPending && <CircularProgress size={20} color="inherit"/>}
                                    sx={{mt: 1, height: 45}}
                                >
                                    {isPending ? t("otp.password-change.loading") : t("otp.password-change.button")}
                                </Button>
                            </Stack>
                        </Box>
                    </FormProvider>
                </Card>
            </Stack>
        </BasePage>
    );
};

export default LoginChangePasswordPage;