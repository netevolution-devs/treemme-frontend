import {Divider, Stack, Typography} from "@mui/material";
import BasePage from "@shared/ui/layout/BasePage";
import {ThemeSwitch} from "@ui/ThemeSwitch";
import {type PropsWithChildren} from "react";
import {useTranslation} from "react-i18next";
import info from "../../../../../package.json";
import BaseSettingsContainer from "@ui/container/BaseSettingsContainer";

type SettingsSectionProps = { title: string } & PropsWithChildren
export const SettingsSection = ({children, title}: SettingsSectionProps) =>
    <Stack gap={2} sx={{my: 0}}>
        <Typography variant={"h5"} fontWeight={900}>
            {title}
        </Typography>
        {children}
    </Stack>
const SettingsRow = ({children}: PropsWithChildren) => <Stack direction={"row"} gap={2}>{children}</Stack>

const SettingsPage = () => {
    const {t} = useTranslation(["common"]);

    return (
        <BasePage fullwidth sx={{p: 0, pb: 3}}>
            <BaseSettingsContainer>
                <SettingsSection title={t("interface.title")}>
                    <SettingsRow>
                        <Typography color={"text.secondary"}>
                            {t("interface.theme")}
                        </Typography>
                        <ThemeSwitch/>
                    </SettingsRow>
                </SettingsSection>
                <Divider sx={{mb: 2}}/>
                <Typography color="textDisabled">
                    {t("common:software-version", {version: info.version})} {info.version}
                </Typography>
            </BaseSettingsContainer>
        </BasePage>
    )
}

export default SettingsPage;
