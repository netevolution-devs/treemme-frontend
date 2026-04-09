import {AppBar, Avatar, Box, Toolbar} from "@mui/material";
import {type IMenuEntry, MenuEntries} from "@ui/layout/menu/MenuEntries";
import MenuEntry from "@ui/layout/menu/MenuEntry";
import {useDockviewStore} from "@ui/panel/store/DockviewStore";
import {useTranslation} from "react-i18next";
import {ThemeSwitch} from "@ui/ThemeSwitch";
import {useNavigate} from "react-router";
import {useMenuStore} from "@ui/layout/default/layoutStore";
import {useAuth} from "@features/auth/model/AuthContext";
import {hasPermission} from "@features/authz/permission.utils";
import type {IAccessControl} from "@features/user/model/RoleInterfaces";

function filterMenuEntries(entries: IMenuEntry[], accessControl: IAccessControl[]): IMenuEntry[] {
    const result: IMenuEntry[] = [];

    for (const entry of entries) {
        let canRender = false;
        let subMenu: IMenuEntry[] | undefined = entry.subMenu;

        if (entry.permissionCheck) {
            canRender = hasPermission(accessControl, entry.permissionCheck);
        }

        if (entry.subMenu) {
            const filteredSubMenu = filterMenuEntries(entry.subMenu, accessControl);

            if (filteredSubMenu.length > 0) {
                subMenu = filteredSubMenu;
                canRender = true;
            }
        }

        if (canRender) {
            const menuEntry: IMenuEntry = {
                ...entry,
            };

            if (subMenu) {
                menuEntry.subMenu = subMenu;
            }

            result.push(menuEntry);
        }
    }

    return result;
}

const MenuToolbar = () => {
    const {t} = useTranslation(["menu"]);
    const {hideMenu, isMenuVisible} = useMenuStore();
    const navigate = useNavigate();
    const addPanel = useDockviewStore(state => state.addPanel);
    const {user} = useAuth();
    const accessControl = (user?.accessControl ?? []) as IAccessControl[];
    const visibleEntries = filterMenuEntries(MenuEntries, accessControl);

    const handlePanelOpen = async (menu: IMenuEntry) => {
        addPanel({
            id: `${menu.component}:${crypto.randomUUID()}`,
            title: t(menu.i18nKey),
            component: menu.component || "not-implemented",
        });
    }

    const handleProfileNavigation = () => {
        // setShowTopBar(false);
        navigate("/profile");
        hideMenu();
    }

    return isMenuVisible && (
        <AppBar position="static">
            <Toolbar disableGutters sx={{px: 1}} variant="dense">
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
                    <Box>
                        {visibleEntries.map((entry) => (
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
                        alignItems: 'center',
                        mr: 1
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