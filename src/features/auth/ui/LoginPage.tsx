import {
    Box,
    Button,
    Stack,
    Typography,
    Card,
    CircularProgress,
    useTheme, Grid,
    Link
} from "@mui/material";
import {useLocation, useNavigate} from "react-router";
import {useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import {appNs} from "../../../i18n";
import Splash from "./Splash";
import {FormProvider, useForm} from "react-hook-form";
import EmailField from "../../../shared/ui/form/controlled/EmailField";
import PasswordField from "../../../shared/ui/form/controlled/PasswordField";
import usePostLogin from "../api/usePostLogin";
import {useAuth} from "../model/AuthContext";
import {useMenuStore} from "@ui/layout/default/layoutStore";
import {useSnackbar} from "notistack";

const backgroundSrc = "";

const LoginPage = () => {
    const {t} = useTranslation([appNs("login")]);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const {mutateAsync: loginMutation, isPending: loginIsPending} = usePostLogin();
    const {showMenu} = useMenuStore();

    const { enqueueSnackbar } = useSnackbar();

    const {setUserCode} = useAuth();
    const from = (location.state as { from?: { pathname: string; search: string } })?.from;

    const methods = useForm<{ email: string; password: string }>({
        defaultValues: {email: "", password: ""},
        disabled: loginIsPending
    });

    const [passwordExpiring, setPasswordExpiring] = useState(false);

    const onSubmit = methods.handleSubmit(async ({email, password}) => {
        const response = await loginMutation({email, password});
        console.log(response);

        if (response.error === "totp_required") {
            setUserCode(response.user_code as string);
            navigate("/login/otp", {replace: true, state: {from}});
            return;
        }
        if (response.requires_password_change) {
            setUserCode(response.user_code as string);
            navigate("/login/change-password", {replace: true, state: {from}});
            return;
        }
        if (response.error === "Password expiring" && response.user_code) {
            setUserCode(response.user_code as string);
            setPasswordExpiring(true);
            enqueueSnackbar(t("form.passwordExpiring"), {variant: "error"});
            return;
        }
        const destination = from ? `${from.pathname}${from.search ?? ""}` : "/";
        navigate(destination, {replace: true});

        showMenu() //Make sure the menu is visible after login
    });

    return (
        <Grid container sx={{minHeight: '100vh', gap: 0, justifyContent: 'center', alignItems: 'center'}}>
            {backgroundSrc &&
                <Box
                    component="img"
                    src={backgroundSrc}
                    alt="Background"
                    sx={{
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
            <Grid
                size={{xs: 12, lg: 6}}
                sx={{
                    height: {xs: '200px', lg: 'auto'},
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pt: 4
                }}
            >
                <Splash/>
            </Grid>
            <Grid
                size={{xs: 12, lg: 6}}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                }}
            >
                <Stack
                    sx={{
                        width: '100%',
                        maxWidth: 600,
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: {lg: 20},
                    }}
                >
                    <Card
                        sx={{
                            background: theme => theme.palette.background.paper,
                            width: '100%',
                            p: 3,
                            py: 5
                        }}
                        variant={"outlined"}
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
                                    <Stack spacing={1}>
                                        <EmailField name={"email"} required={true}/>
                                        <PasswordField name={"password"} required={true}/>
                                    </Stack>
                                    <Button
                                        fullWidth
                                        size="small"
                                        variant="contained"
                                        sx={{textTransform: 'none', fontWeight: 800, height: 35, boxShadow: "none"}}
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
                        {passwordExpiring && (
                            <Stack sx={{mt: 3, width: '100%', textAlign: 'center'}}>
                                <Link
                                    variant="body2"
                                    onClick={() => {
                                        setPasswordExpiring(false);
                                        navigate("/login/change-password", {replace: true, state: {from}});
                                    }}
                                    sx={{cursor: 'pointer', fontWeight: 500}}
                                >
                                    {t("form.changePasswordNow")}
                                </Link>
                            </Stack>
                        )}
                        <Stack
                            direction={"row"}
                            alignItems={"center"}
                            spacing={2}
                            sx={{
                                mt: 3,
                                justifyContent: 'center'
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" sx={{textAlign: 'center'}}>
                                <Trans
                                    t={t}
                                    i18nKey={"form.forgotPassword"}
                                />
                            </Typography>
                        </Stack>
                    </Card>
                </Stack>

            </Grid>
        </Grid>
    );
};

export default LoginPage;
