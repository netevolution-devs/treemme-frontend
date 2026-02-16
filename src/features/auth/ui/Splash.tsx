import {Box, Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {appNs} from "../../../i18n";

const Splash = () => {
    const {t} = useTranslation([appNs("login")]);

    return (
        <Box
            sx={{
                flex: 1,
                ml: {xs: 0, lg: 12},
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}
        >
            <Stack sx={{width: '100%', mb: {xs: 0, md: 0, lg: 8}, height: {xs: 0, lg: "95%"}, justifyContent: 'center', textAlign: 'center'}}
                   spacing={3}>
                <Typography variant="h1" sx={{fontWeight: 600, fontSize: "3rem", pt: {xs: 24, lg: 0}}} color={"primary"} textAlign={"center"}>
                    {t("splash.title")}
                </Typography>
                <Typography variant="h5" sx={{opacity: 0.95, fontStyle: "unset", display: {xs: "none", lg: "flex"}, justifyContent: 'center'}} textAlign={"center"}>
                    {t("splash.subtitle")}
                </Typography>
            </Stack>
        </Box>
    )
}

export default Splash;
