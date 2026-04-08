import usePutPassword from "@features/auth/api/usePutPassword";
import {Box, Button, Checkbox, CircularProgress, FormControlLabel, Link, Stack, Typography} from "@mui/material";
import PasswordField from "@shared/ui/form/controlled/PasswordField";
import {Controller, FormProvider, useForm, useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {appNs} from "../../../../i18n";
import ButtonLogout from "@features/auth/ui/ButtonLogout";

interface IPasswordForm {
    password: string;
    confirmPassword: string;
    privacyConsent: boolean;
    responsibilityTermsConsent: boolean;
}

interface ChangePasswordProps {
    onChangeSuccess: () => void;
}

const ChangePassword = ({onChangeSuccess}: ChangePasswordProps) => {
    const {t} = useTranslation([appNs("login"), "common"]);
    const {mutateAsync: changePassword, isPending} = usePutPassword();

    const methods = useForm<IPasswordForm>({
        mode: "onSubmit"
    })

    const baseUrl = import.meta.env?.VITE_PUBLIC_BASE_URL ?? window.location.origin;
    const privacyConsentFileUrl = `${baseUrl}/assets/Informativa_Fornitori_One_Company.doc`;
    const responsibilityTermsFileUrl = `${baseUrl}/assets/Nomina_Responsabile_Esterno_ex_art_28_Reg.to_679_del_2016.doc`;


    const passwordValue = useWatch({
        control: methods.control,
        name: "password",
    });

    const onChangePasswordSubmit = async (data: IPasswordForm) => {
        if (!data.privacyConsent || !data.responsibilityTermsConsent) {
            return;
        }

        await changePassword({
            password: data.password,
            signed_information: data.privacyConsent,
            signed_appointment_head: data.responsibilityTermsConsent
        })
        onChangeSuccess();
    }

    return (
        <Stack gap={2} sx={{justifyContent: 'center', alignItems: 'center'}}>
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
                    {t("otp.change-password.title")}
                </Typography>
                <Typography variant="body1" sx={{mb: 2}} color="text.secondary">
                    {t("otp.change-password.description")}
                </Typography>
                <FormProvider {...methods}>
                    <Stack
                        gap={1}
                        component={"form"}
                        onSubmit={methods.handleSubmit(onChangePasswordSubmit)}
                    >
                        <PasswordField<IPasswordForm>
                            autoComplete="current-password"
                            name="password"
                            required
                            showRequired={false}
                            label={t("otp.change-password.password")}
                        />
                        <PasswordField<IPasswordForm>
                            autoComplete="new-password"
                            name="confirmPassword"
                            required
                            label={t("otp.change-password.confirm-password")}
                            showRequired={false}
                            rules={{
                                validate: (value) =>
                                    value === passwordValue || t("otp.change-password.not-equal"),
                            }}
                        />
                        <Controller
                            name="privacyConsent"
                            control={methods.control}
                            defaultValue={false}
                            rules={{
                                required: {value: true, message: t("reset-password.change.privacy-consent-required")},
                            }}
                            render={({field, fieldState: {error}}) => (
                                <>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...field}
                                                checked={field.value}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">
                                                {t("reset-password.change.privacy-consent-label-1")}
                                                <Link href={privacyConsentFileUrl} target="_blank"
                                                      rel="noopener">
                                                    {t("reset-password.change.privacy-consent-link")}
                                                </Link>
                                                {t("reset-password.change.privacy-consent-label-2")}
                                            </Typography>
                                        }
                                    />
                                    {error && (
                                        <Typography color="error" variant="caption" display="block" sx={{m:0, alignSelf:"start"}}>
                                            {error.message}
                                        </Typography>
                                    )}
                                </>
                            )}
                        />
                        <Controller
                            name="responsibilityTermsConsent"
                            control={methods.control}
                            defaultValue={false}
                            rules={{
                                required: {value: true, message: t("reset-password.change.responsibility-consent-required")},
                            }}
                            render={({field, fieldState: {error}}) => (
                                <>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...field}
                                                checked={field.value}
                                            />
                                        }
                                        sx={{justifyContent: 'flex-start'}}
                                        label={
                                            <Typography variant="body2">
                                                {t("reset-password.change.responsibility-consent-label-1")}
                                                <Link href={responsibilityTermsFileUrl} target="_blank"
                                                      rel="noopener">
                                                    {t("reset-password.change.responsibility-consent-link")}
                                                </Link>
                                                {t("reset-password.change.responsibility-consent-label-2")}
                                            </Typography>
                                        }
                                    />
                                    {error && (
                                        <Typography color="error" variant="caption" display="block" sx={{m:0, alignSelf:"start"}}>
                                            {error.message}
                                        </Typography>
                                    )}
                                </>
                            )}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isPending}
                            sx={{mt: 2, height: 45}}
                        >

                            {isPending ? (
                                    <>
                                        {t("otp.change-password.loading")}<CircularProgress size={18} sx={{ml: 2}}/>
                                    </>
                                ) :
                                <>{t("otp.change-password.button")}</>
                            }
                        </Button>
                    </Stack>
                </FormProvider>
            </Stack>
            <ButtonLogout sx={{width: 160}}/>
            <Box>
                <Typography fontSize={13} color="text.secondary" sx={{mt: 2}}>
                    {t("long-terms-text")}
                </Typography>
            </Box>
        </Stack>
    )
}

export default ChangePassword;
