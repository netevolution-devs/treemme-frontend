import {useAuth} from "@features/auth/model/AuthContext.tsx";
import BasePage from "@ui/layout/BasePage.tsx";
import {useTranslation} from "react-i18next";
import UserProfileCard from "./UserProfileCard.tsx";
import ButtonLogout from "@features/auth/ui/ButtonLogout.tsx";
import {SettingsSection} from "@features/settings/ui/default/SettingsPage.tsx";
import BaseSettingsContainer from "@ui/container/BaseSettingsContainer.tsx";
import useGetProfile from "@features/profile/api/useGetProfile.ts";

const ProfilePage = () => {
    const {t} = useTranslation(["settings"]);

    const {user} = useAuth();
    const {isLoading} = useGetProfile(user?.userCode as string);

    return (
        <BasePage isLoading={isLoading} sx={{p: 0, mb: 3}} fullwidth>
            {isLoading ? (
                <></>
                // skeleton
            ) : (
                <BaseSettingsContainer>
                    <SettingsSection title={t("profile.title")}>
                        <UserProfileCard userCode={user?.userCode as string}/>
                        <ButtonLogout/>
                    </SettingsSection>
                </BaseSettingsContainer>
            )}
        </BasePage>
    )
}

export default ProfilePage;
