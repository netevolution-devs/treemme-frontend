import BasePage from "@ui/layout/BasePage";
import {useTranslation} from "react-i18next";
import UserProfileCard from "./UserProfileCard";
import ButtonLogout from "@features/auth/ui/ButtonLogout";
import {SettingsSection} from "@features/settings/ui/default/SettingsPage";
import BaseSettingsContainer from "@ui/container/BaseSettingsContainer";
import {Box, Stack, Typography} from "@mui/material";
import ButtonStartOtpSetup from "@features/auth/ui/ButtonStartOtpSetup";
// import useGetProfile from "@features/profile/api/useGetProfile";
// import {useAuth} from "@features/auth/model/AuthContext";
// import UserProfileCardSkeleton from "@features/profile/ui/default/UserProfileCardSkeleton";
import {version} from "../../../../../package.json";

const ProfilePage = () => {
    const {t} = useTranslation(["settings"]);
    // const {user} = useAuth();
    // const {isLoading} = useGetProfile(user?.userCode as string);

    return (
        <BasePage sx={{p: 20, mb: 3}} fullwidth>
            <BaseSettingsContainer>
                <SettingsSection title={t("profile.title")}>
                    {/*{isLoading*/}
                    {/*    ? <UserProfileCardSkeleton/>*/}
                    {/*    : <UserProfileCard/>*/}
                    {/*}*/}
                    <UserProfileCard/>
                    <Stack direction={"row"} spacing={2}>
                        <ButtonStartOtpSetup/>
                        <ButtonLogout/>
                    </Stack>
                    <Box sx={{width: "100%", mt: 2, mb: 2, textAlign: "center", flexDirection: "column", display: "flex", gap: 0.5}}>
                        <Typography variant="caption" color="text.secondary" textAlign={"center"} sx={{fontSize: 13}}>
                            Versione di sviluppo {version}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" textAlign={"center"} sx={{fontSize: 12}}>
                            Developed by netEvolution
                        </Typography>
                    </Box>
                </SettingsSection>
            </BaseSettingsContainer>
        </BasePage>
    )
}

export default ProfilePage;