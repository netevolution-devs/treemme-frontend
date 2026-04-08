import usePostPasswordResetChange from "@features/password-reset/api/usePostPasswordResetChange";
import {Button, CircularProgress, Stack, Typography} from "@mui/material";
import PasswordField from "@ui/form/controlled/PasswordField";
import {FormProvider, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {appNs} from "../../../../../i18n";

interface IResetPasswordForm {
    password: string;
    confirmPassword: string;
}

interface ResetChangePasswordProps {
    resetToken: string;
    onChangeSuccess: () => void;
}

const ResetChangePassword = ({resetToken, onChangeSuccess}: ResetChangePasswordProps) => {
    const {t} = useTranslation([appNs("login"), "common"]);
    const {mutateAsync: changePassword, isPending} = usePostPasswordResetChange();

    const methods = useForm<IResetPasswordForm>({
        mode: "onSubmit"
    });

    const {watch} = methods;
    const passwordValue = watch("password");

    const onChangePasswordSubmit = async (data: IResetPasswordForm) => {
        await changePassword({
            new_password: data.password,
            reset_token: resetToken
        });
        onChangeSuccess();
    };

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
            <Typography variant="h5" fontWeight="bold">
                {t("reset-password.change.title")}
            </Typography>
            <Typography variant="body1" sx={{mb: 2}} color="text.secondary">
                {t("reset-password.change.description")}
            </Typography>
            <FormProvider {...methods}>
                <Stack
                    gap={1}
                    component={"form"}
                    onSubmit={methods.handleSubmit(onChangePasswordSubmit)}
                >
                    <PasswordField<IResetPasswordForm>
                        autoComplete="new-password"
                        name="password"
                        required
                        showRequired={false}
                        label={t("reset-password.change.password")}
                    />
                    <PasswordField<IResetPasswordForm>
                        autoComplete="new-password"
                        name="confirmPassword"
                        required
                        label={t("reset-password.change.confirm-password")}
                        showRequired={false}
                        rules={{
                            validate: (value) =>
                                value === passwordValue || t("reset-password.change.password-mismatch"),
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isPending}
                        sx={{mt: 2}}
                    >
                        {isPending ? (
                            <>
                                {t("reset-password.change.loading")}
                                <CircularProgress size={18} sx={{ml: 2}}/>
                            </>
                        ) : (
                            <>{t("reset-password.change.button")}</>
                        )}
                    </Button>
                </Stack>
            </FormProvider>
        </Stack>
    );
};

export default ResetChangePassword;
