import {AppBar, Avatar, Box, Toolbar} from "@mui/material";
import {type IMenuEntry, MenuEntries} from "@ui/layout/menu/MenuEntries.ts";
import MenuEntry from "@ui/layout/menu/MenuEntry.tsx";
import {useDockviewStore} from "@ui/panel/store/DockviewStore.ts";
import {useTranslation} from "react-i18next";
import {ThemeSwitch} from "@ui/ThemeSwitch.tsx";
import {useNavigate} from "react-router";
import {useMenuStore} from "@ui/layout/default/layoutStore.ts";

const MenuToolbar = () => {
    const {t} = useTranslation(["menu"]);
    // const {setShowTopBar, showTopBar} = useLayout()

    const {hideMenu, isMenuVisible} = useMenuStore();

    const navigate = useNavigate();
    const addPanel = useDockviewStore(state => state.addPanel);

    const handlePanelOpen = async (menu: IMenuEntry) => {
        addPanel({
            id: `${menu.component}:${crypto.randomUUID()}`,
            title: t(menu.i18nKey),
            component: menu.component || "not-implemented",
        });
    }

    const handleProfileNavigation = () => {
        // setShowTopBar(false);
        hideMenu();
        navigate("/profile");
    }

    return isMenuVisible && (
        <AppBar position="static">
            <Toolbar disableGutters sx={{px: 1}} variant="dense">
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
                    <Box>
                        {MenuEntries.map((entry) => (
                            <MenuEntry
                                key={entry.i18nKey}
                                entry={entry}
                                onClick={handlePanelOpen}
                            />
                        ))}
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        gap: 2,
                        alignItems: 'center'
                    }}>
                        <ThemeSwitch showText={false} size={"small"}/>
                        <Avatar
                            sx={{width: 28, height: 28, cursor: 'pointer'}}
                            onClick={handleProfileNavigation}
                        />
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default MenuToolbar;