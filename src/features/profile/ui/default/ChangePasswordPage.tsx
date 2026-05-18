import {Box, Button, Stack, Typography, Alert, CircularProgress, Card} from "@mui/material";
import BasePage from "@shared/ui/layout/BasePage";
import ButtonBackToApp from "@ui/ButtonGoBack";
import useChangePassword from "@features/profile/api/useChangePassword";
import {useTranslation} from "react-i18next";
import {isAxiosError} from "axios";
import {useNavigate} from "react-router";
import {FormProvider, useForm} from "react-hook-form";
import PasswordField from "@shared/ui/form/controlled/PasswordField";

interface IChangePasswordForm {
    old_password: string;
    new_password: string;
    confirm_password: string;
}

const ChangePasswordPage = () => {
    const {t} = useTranslation(["settings", "common"]);
    const {mutateAsync: changePassword, isPending, isError, isSuccess, error} = useChangePassword();
    const navigate = useNavigate();

    const methods = useForm<IChangePasswordForm>({
        defaultValues: {
            old_password: "",
            new_password: "",
            confirm_password: ""
        },
        mode: "onChange"
    });

    const {handleSubmit, watch} = methods;
    const newPassword = watch("new_password");

    const onSubmit = async (data: IChangePasswordForm) => {
        try {
            await changePassword({
                old_password: data.old_password,
                new_password: data.new_password
            });
            setTimeout(() => navigate("/profile"), 1000);
        } catch (e) {
            console.error(e);
        }
    };

    let errorMessage = "Errore durante il cambio password";
    if (isError && isAxiosError(error)) {
        errorMessage = "Errore cambio password";
    }

    return (
        <BasePage>
            <Stack
                sx={{
                    p: 8,
                    alignItems: 'center',
                }}
            >
                <Box sx={{alignSelf: 'flex-start', mb: 1}}>
                    <ButtonBackToApp/>
                </Box>

                <Card
                    sx={{
                        background: theme => theme.palette.background.paper,
                        width: '100%',
                        p: 3,
                        py: 5,
                    }}
                    variant={"outlined"}
                    elevation={0}
                >
                    <Typography variant="h5" fontWeight="bold" textAlign="center" sx={{mb: 2}}>
                        {t("settings:interface.change-password")}
                    </Typography>

                    <Box sx={{mb: 2}}>
                        {isSuccess && (
                            <Alert severity="success">
                                {t("common:form.success.save") || "Password cambiata con successo"}
                            </Alert>
                        )}
                        {isError && (
                            <Alert severity="error">
                                {errorMessage}
                            </Alert>
                        )}
                    </Box>

                    <FormProvider {...methods}>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={3}>
                                <PasswordField<IChangePasswordForm>
                                    name="old_password"
                                    label="Vecchia Password"
                                    required
                                    autoComplete="current-password"
                                />
                                <PasswordField<IChangePasswordForm>
                                    name="new_password"
                                    label="Nuova Password"
                                    required
                                    autoComplete="new-password"
                                    rules={{
                                        validate: {
                                            different: (value, formValues) =>
                                                value !== formValues.old_password || "La nuova password deve essere diversa dalla vecchia"
                                        }
                                    }}
                                />
                                <PasswordField<IChangePasswordForm>
                                    name="confirm_password"
                                    label="Conferma Nuova Password"
                                    required
                                    autoComplete="new-password"
                                    rules={{
                                        validate: (value) =>
                                            value === newPassword || "Le password non corrispondono"
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={isPending || !methods.formState.isValid}
                                    startIcon={isPending && <CircularProgress size={20} color="inherit"/>}
                                >
                                    {isPending ? "Salvataggio..." : t("common:button.save")}
                                </Button>
                            </Stack>
                        </Box>
                    </FormProvider>
                </Card>
            </Stack>
        </BasePage>
    );
};

export default ChangePasswordPage;