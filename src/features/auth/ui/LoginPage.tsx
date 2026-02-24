import {
    Box,
    Button,
    Stack,
    Typography,
    Link as MUILink,
    Card,
    Divider,
    CircularProgress,
    useTheme
} from "@mui/material";
import {Link as RouterLink, useNavigate} from "react-router";
import {Trans, useTranslation} from "react-i18next";
import {appNs} from "../../../i18n";
import Splash from "./Splash";
import {FormProvider, useForm} from "react-hook-form";
import EmailField from "../../../shared/ui/form/controlled/EmailField";
import PasswordField from "../../../shared/ui/form/controlled/PasswordField";
import usePostLogin from "../api/usePostLogin";
import {useAuth} from "../model/AuthContext";

const backgroundSrc = "";

const LoginPage = () => {
    const {t} = useTranslation([appNs("login")]);
    const navigate = useNavigate();
    const theme = useTheme();
    const {mutateAsync: loginMutation, isPending: loginIsPending} = usePostLogin();

    const {setUserCode} = useAuth();

    const methods = useForm<{ email: string; password: string }>({
        defaultValues: {email: "", password: ""},
        disabled: loginIsPending
    });

    const onSubmit = methods.handleSubmit(async ({email, password}) => {
        const response = await loginMutation({email, password});
        if (response.error === "totp_required") {
            setUserCode(response.user_code as string);
            navigate("/login/otp", {replace: true});
            return;
        }
        navigate("/", {replace: true});
    });

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                flexDirection: {xs: 'column', md: 'column', lg: 'row'},
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {backgroundSrc &&
                <img
                    src={backgroundSrc}
                    alt="Background"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: -1,
                        filter: theme.palette.mode === 'dark'
                            ? 'grayscale(100%) brightness(0.3)'
                            : 'none'
                    }}
                />
            }
            <Splash/>
            <Divider orientation="vertical" flexItem sx={{m: {md: 0, lg: 16}, display: {md: 'none', lg: 'flex'}}}/>
            <Stack
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: {xs: "flex-start", lg: "center"},
                    mr: {md: 0, lg: 12},
                }}
                spacing={6}
            >
                <Card
                    sx={{
                        background: theme => theme.palette.background.paper,
                        minWidth: {xs: "90%", sm: 500, lg: 600}, p: {xs: 4, lg: 8},
                        borderRadius: 4
                    }}
                    elevation={0}
                >
                    <Typography variant="h4" sx={{fontWeight: 200, mb: 1}}>
                        {t("form.welcome")}
                    </Typography>
                    <Typography variant="body2" sx={{mb: 3}} color="text.secondary">
                        {t("form.subtitle")}
                    </Typography>
                    <FormProvider {...methods}>
                        <Box component="form" onSubmit={onSubmit}>
                            <Stack spacing={3}>
                                <Stack spacing={2}>
                                    <EmailField name={"email"} required={true}/>
                                    <PasswordField name={"password"} required={true}/>
                                </Stack>
                                <Button
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    sx={{textTransform: 'none', fontWeight: 800, height: 50}}
                                    type="submit"
                                    disabled={loginIsPending}
                                >
                                    {loginIsPending ? (
                                        <CircularProgress size={20}/>
                                    ) : (
                                        <>{t("form.button")}</>
                                    )}
                                </Button>

                            </Stack>
                        </Box>
                    </FormProvider>
                    <Stack direction={"row"} alignItems={"center"} spacing={2} sx={{mt: 4, justifyContent: 'center'}}>
                        <Typography variant="body2" color="text.secondary" sx={{textAlign: 'center'}}>
                            <Trans
                                t={t}
                                i18nKey={"form.forgotPassword"}
                                components={{
                                    outLink: (
                                        <MUILink
                                            component={RouterLink}
                                            to="/reset-password"
                                            rel="noopener noreferrer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                            }}
                                        />
                                    )
                                }}
                            />
                        </Typography>
                    </Stack>
                </Card>
            </Stack>
        </Box>
    );
};

export default LoginPage;
