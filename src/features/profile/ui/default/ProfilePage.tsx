import BasePage from "@ui/layout/BasePage.tsx";
import {useTranslation} from "react-i18next";
import UserProfileCard from "./UserProfileCard.tsx";
import ButtonLogout from "@features/auth/ui/ButtonLogout.tsx";
import {SettingsSection} from "@features/settings/ui/default/SettingsPage.tsx";
import BaseSettingsContainer from "@ui/container/BaseSettingsContainer.tsx";
import {Box} from "@mui/material";
// import useGetProfile from "@features/profile/api/useGetProfile.ts";
// import {useAuth} from "@features/auth/model/AuthContext.tsx";
// import UserProfileCardSkeleton from "@features/profile/ui/default/UserProfileCardSkeleton.tsx";

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
                    <Box>
                        <ButtonLogout/>
                    </Box>
                </SettingsSection>
            </BaseSettingsContainer>
        </BasePage>
    )
}

export default ProfilePage;