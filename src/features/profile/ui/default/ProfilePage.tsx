import BasePage from "@ui/layout/BasePage.tsx";
import {useTranslation} from "react-i18next";
import UserProfileCard from "./UserProfileCard.tsx";
import ButtonLogout from "@features/auth/ui/ButtonLogout.tsx";
import {SettingsSection} from "@features/settings/ui/default/SettingsPage.tsx";
import BaseSettingsContainer from "@ui/container/BaseSettingsContainer.tsx";
import {Box, Stack, Typography} from "@mui/material";
import ButtonStartOtpSetup from "@features/auth/ui/ButtonStartOtpSetup.tsx";
// import useGetProfile from "@features/profile/api/useGetProfile.ts";
// import {useAuth} from "@features/auth/model/AuthContext.tsx";
// import UserProfileCardSkeleton from "@features/profile/ui/default/UserProfileCardSkeleton.tsx";
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
                    <Box sx={{width: "100%", mt: 2, mb: 2, textAlign: "center"}}>
                        <Typography variant="caption" color="text.secondary" textAlign={"center"}>
                            Versione di sviluppo {version}
                        </Typography>
                    </Box>
                </SettingsSection>
            </BaseSettingsContainer>
        </BasePage>
    )
}

export default ProfilePage;