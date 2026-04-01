import {AppBar, Avatar, Box, Toolbar} from "@mui/material";
import {type IMenuEntry, MenuEntries} from "@ui/layout/menu/MenuEntries.ts";
import MenuEntry from "@ui/layout/menu/MenuEntry.tsx";
import {useDockviewStore} from "@ui/panel/store/DockviewStore.ts";
import {useTranslation} from "react-i18next";
import {ThemeSwitch} from "@ui/ThemeSwitch.tsx";
import {useNavigate} from "react-router";
import {useMenuStore} from "@ui/layout/default/layoutStore.ts";
import {useAuth} from "@features/auth/model/AuthContext.tsx";
import {hasPermission} from "@features/authz/permission.utils.ts";
import type {IAccessControl} from "@features/user/model/RoleInterfaces.ts";

function filterMenuEntries(entries: IMenuEntry[], accessControl: IAccessControl[]): IMenuEntry[] {
    return entries
        .map(entry => {
            console.log(entry.permissionCheck)
            if (entry.permissionCheck) {
                const has_permission = hasPermission(accessControl, entry.permissionCheck);
                console.log("user has permission: ", has_permission, " for ", entry.permissionCheck);
                return has_permission ? entry : null;
            }

            if (entry.subMenu) {
                const filteredSub = filterMenuEntries(entry.subMenu, accessControl);
                return filteredSub.length > 0 ? {...entry, subMenu: filteredSub} : null;
            }

            return entry;
        })
        .filter((e): e is IMenuEntry => e !== null);
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