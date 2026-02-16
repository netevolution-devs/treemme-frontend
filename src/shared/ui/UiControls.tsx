import {Stack} from "@mui/material";
import LanguageSelector from "../../shared/ui/LanguageSelector.tsx";
import {ThemeSwitch} from "@ui/ThemeSwitch.tsx";
import ButtonLogout from "@features/auth/ui/ButtonLogout.tsx";

interface Props {
    direction?: "row" | "column"
    showThemeSwitch?: boolean
    showLanguageSelector?: boolean
    showLogoutButton?: boolean
}

const UserInterfaceControls = ({
                                   direction = "row",
                                   showLanguageSelector = true,
                                   showLogoutButton = true,
                                   showThemeSwitch = true
                               }: Props) => {
    return (
        <Stack sx={{
            justifyContent: "center",
            alignItems: "center",
            gap: direction === "row" ? 4 : 2,
            flexDirection: direction,
            my: 2
        }}>
            <Stack sx={{
                justifyContent: "center",
                alignItems: "center",
                gap: direction === "row" ? 4 : 2,
                flexDirection: "row",
            }}>
                {showThemeSwitch && <ThemeSwitch showText={false}/>}
                {showLanguageSelector && <LanguageSelector/>}
            </Stack>
            {showLogoutButton && <ButtonLogout/>}
        </Stack>
    );
};

export default UserInterfaceControls;
